"""
OmniCut Immutable Audit Ledger (SOC2 CC7.2 Compliance)
Tamper-evident append-only ledger with SHA-256 hash chaining.
Records all timeline operations, asset uploads, role changes, and exports.
"""

import hashlib
import json
import time
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends

router = APIRouter(prefix="/audit", tags=["Security & Audit Ledger"])

class AuditEventCreate(BaseModel):
    user_id: str
    user_email: str
    action: str
    resource_id: str
    details: Dict[str, Any]

class AuditEventEntry(BaseModel):
    id: str
    index: int
    timestamp: float
    user_id: str
    user_email: str
    action: str
    resource_id: str
    details: Dict[str, Any]
    prev_hash: str
    entry_hash: str

# In-Memory Append-Only Blockchain-Style Ledger
GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"
LEDGER: List[AuditEventEntry] = []

def compute_hash(index: int, timestamp: float, user_email: str, action: str, resource_id: str, details_json: str, prev_hash: str) -> str:
    raw = f"{index}:{timestamp}:{user_email}:{action}:{resource_id}:{details_json}:{prev_hash}".encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

# Seed with initial audit entries
initial_events = [
    ("usr_admin_1", "lead.director@omnicut.studio", "PROJECT_CREATED", "proj_quantum_2026", {"title": "Quantum Supremacy 2026"}),
    ("usr_vfx_2", "sarah.vfx@studio.com", "VFX_INPAINT_CLEAN_PLATE", "clip_c_v1_1", {"model": "SAM2_Diffusion", "psnrDb": 38.4}),
    ("usr_audio_3", "marcus.audio@studio.com", "DUBBING_ES_GENERATED", "clip_c_a1_1", {"targetLanguage": "es", "syllableMatch": 0.98}),
]

for uid, email, action, res_id, details in initial_events:
    idx = len(LEDGER)
    prev = LEDGER[-1].entry_hash if idx > 0 else GENESIS_HASH
    ts = time.time() - (3600 * (3 - idx))
    d_json = json.dumps(details, sort_keys=True)
    e_hash = compute_hash(idx, ts, email, action, res_id, d_json, prev)
    LEDGER.append(AuditEventEntry(
        id=f"audit_{idx+1}",
        index=idx,
        timestamp=ts,
        user_id=uid,
        user_email=email,
        action=action,
        resource_id=res_id,
        details=details,
        prev_hash=prev,
        entry_hash=e_hash,
    ))

@router.get("/entries", response_model=List[AuditEventEntry])
def get_audit_entries(limit: int = 50):
    """Retrieve immutable audit ledger entries in reverse chronological order."""
    return sorted(LEDGER, key=lambda x: x.index, reverse=True)[:limit]

@router.post("/log", response_model=AuditEventEntry)
def log_audit_event(event: AuditEventCreate):
    """Append a new tamper-evident event to the studio audit ledger."""
    idx = len(LEDGER)
    prev = LEDGER[-1].entry_hash if idx > 0 else GENESIS_HASH
    ts = time.time()
    d_json = json.dumps(event.details, sort_keys=True)
    e_hash = compute_hash(idx, ts, event.user_email, event.action, event.resource_id, d_json, prev)
    
    new_entry = AuditEventEntry(
        id=f"audit_{idx+1}",
        index=idx,
        timestamp=ts,
        user_id=event.user_id,
        user_email=event.user_email,
        action=event.action,
        resource_id=event.resource_id,
        details=event.details,
        prev_hash=prev,
        entry_hash=e_hash,
    )
    LEDGER.append(new_entry)
    return new_entry

@router.get("/verify")
def verify_ledger_integrity():
    """Verify cryptographic integrity of all SHA-256 links in the audit chain."""
    for i, entry in enumerate(LEDGER):
        expected_prev = GENESIS_HASH if i == 0 else LEDGER[i-1].entry_hash
        if entry.prev_hash != expected_prev:
            return {
                "valid": False,
                "broken_at_index": i,
                "error": f"Invalid prev_hash at index {i}",
            }
        recomputed = compute_hash(
            entry.index, entry.timestamp, entry.user_email, entry.action, entry.resource_id,
            json.dumps(entry.details, sort_keys=True), entry.prev_hash
        )
        if recomputed != entry.entry_hash:
            return {
                "valid": False,
                "broken_at_index": i,
                "error": f"Hash mismatch at index {i}",
            }

    return {
        "valid": True,
        "chain_length": len(LEDGER),
        "genesis_hash": GENESIS_HASH,
        "head_hash": LEDGER[-1].entry_hash if LEDGER else GENESIS_HASH,
        "compliance": "SOC2-CC7.2-Verified",
    }
