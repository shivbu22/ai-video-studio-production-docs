"""
OmniCut Enterprise Role-Based Access Control (RBAC) Module
Phase 12: Enterprise Studio Security & SOC2 Governance
Strictly Clean-Room Route B (Zero GPL/AGPL dependencies).
"""

from enum import Enum
from typing import Set, Dict

class StudioRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    LEAD_EDITOR = "lead_editor"
    EDITOR = "editor"
    REVIEWER = "reviewer"
    CLIENT_VIEWER = "client_viewer"

class Permission(str, Enum):
    PROJECT_READ = "project:read"
    PROJECT_WRITE = "project:write"
    PROJECT_DELETE = "project:delete"
    CLIP_CREATE = "clip:create"
    CLIP_TRIM = "clip:trim"
    CLIP_DELETE = "clip:delete"
    TRACK_LOCK = "track:lock"
    COMMENT_CREATE = "comment:create"
    COMMENT_RESOLVE = "comment:resolve"
    EXPORT_RENDER = "export:render"
    EXPORT_WATERMARK_BYPASS = "export:watermark_bypass"
    AUDIT_READ = "audit:read"
    RBAC_MANAGE = "rbac:manage"

# Granular Enterprise Role-to-Permission Matrix
ROLE_PERMISSIONS: Dict[StudioRole, Set[Permission]] = {
    StudioRole.SUPER_ADMIN: {p for p in Permission},
    StudioRole.LEAD_EDITOR: {
        Permission.PROJECT_READ,
        Permission.PROJECT_WRITE,
        Permission.CLIP_CREATE,
        Permission.CLIP_TRIM,
        Permission.CLIP_DELETE,
        Permission.TRACK_LOCK,
        Permission.COMMENT_CREATE,
        Permission.COMMENT_RESOLVE,
        Permission.EXPORT_RENDER,
        Permission.EXPORT_WATERMARK_BYPASS,
        Permission.AUDIT_READ,
    },
    StudioRole.EDITOR: {
        Permission.PROJECT_READ,
        Permission.PROJECT_WRITE,
        Permission.CLIP_CREATE,
        Permission.CLIP_TRIM,
        Permission.CLIP_DELETE,
        Permission.TRACK_LOCK,
        Permission.COMMENT_CREATE,
        Permission.EXPORT_RENDER,
    },
    StudioRole.REVIEWER: {
        Permission.PROJECT_READ,
        Permission.COMMENT_CREATE,
        Permission.COMMENT_RESOLVE,
    },
    StudioRole.CLIENT_VIEWER: {
        Permission.PROJECT_READ,
        Permission.COMMENT_CREATE,
    },
}

def has_permission(role: StudioRole, perm: Permission) -> bool:
    """Verify if a given studio role holds the requested permission."""
    return perm in ROLE_PERMISSIONS.get(role, set())

def assert_permission(role: StudioRole, perm: Permission):
    """Enforce permission, raising PermissionError if disallowed."""
    if not has_permission(role, perm):
        raise PermissionError(f"Role '{role.value}' lacks required permission '{perm.value}'")
