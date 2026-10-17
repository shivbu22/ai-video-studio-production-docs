from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import hashlib
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from ..config import settings

ph = PasswordHasher()

class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password securely using Argon2id."""
        return ph.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify an incoming plain password against an Argon2id hash."""
        try:
            return ph.verify(hashed_password, plain_password)
        except VerifyMismatchError:
            return False

    @staticmethod
    def create_access_token(user_id: str, email: str, expires_delta: Optional[timedelta] = None) -> str:
        """Create a signed JWT access token for tenant authentication."""
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(days=settings.JWT_EXPIRE_DAYS)
        
        payload = {
            "sub": user_id,
            "email": email,
            "exp": expire,
            "iat": datetime.now(timezone.utc)
        }
        return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    @staticmethod
    def decode_access_token(token: str) -> Dict[str, Any]:
        """Decode and validate a JWT access token."""
        try:
            return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        except jwt.PyJWTError as e:
            raise ValueError(f"Invalid or expired authentication token: {str(e)}")

    @staticmethod
    def hash_api_key(api_key: str) -> str:
        """Hash an external API key (e.g. for MCP agents) using SHA-256."""
        return hashlib.sha256(api_key.encode("utf-8")).hexdigest()
