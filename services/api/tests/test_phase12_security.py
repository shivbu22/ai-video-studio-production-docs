import pytest
from src.security.rbac import StudioRole, Permission, has_permission, assert_permission
from src.routers.audit_ledger import verify_ledger_integrity, log_audit_event, AuditEventCreate, LEDGER

def test_rbac_super_admin_has_all_permissions():
    for perm in Permission:
        assert has_permission(StudioRole.SUPER_ADMIN, perm) is True

def test_rbac_reviewer_cannot_delete_or_export():
    assert has_permission(StudioRole.REVIEWER, Permission.COMMENT_CREATE) is True
    assert has_permission(StudioRole.REVIEWER, Permission.CLIP_DELETE) is False
    assert has_permission(StudioRole.REVIEWER, Permission.EXPORT_RENDER) is False
    assert has_permission(StudioRole.REVIEWER, Permission.EXPORT_WATERMARK_BYPASS) is False

    with pytest.raises(PermissionError):
        assert_permission(StudioRole.REVIEWER, Permission.CLIP_DELETE)

def test_rbac_editor_cannot_bypass_watermark():
    assert has_permission(StudioRole.EDITOR, Permission.EXPORT_RENDER) is True
    assert has_permission(StudioRole.EDITOR, Permission.EXPORT_WATERMARK_BYPASS) is False

def test_audit_ledger_integrity_verification():
    verification = verify_ledger_integrity()
    assert verification["valid"] is True
    assert verification["chain_length"] >= 3
    assert verification["compliance"] == "SOC2-CC7.2-Verified"

def test_audit_ledger_tamper_detection():
    # Save legitimate entry hash
    real_hash = LEDGER[1].entry_hash
    # Corrupt entry hash to simulate tampering
    LEDGER[1].entry_hash = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    
    tampered_result = verify_ledger_integrity()
    assert tampered_result["valid"] is False
    assert tampered_result["broken_at_index"] == 1
    
    # Restore legitimate entry hash
    LEDGER[1].entry_hash = real_hash
    clean_result = verify_ledger_integrity()
    assert clean_result["valid"] is True
