import pytest
from services.api.src.services.auth_service import AuthService

def test_password_hashing_and_verification():
    password = "SuperSecurePassword123!"
    hashed = AuthService.hash_password(password)
    assert hashed != password
    assert AuthService.verify_password(password, hashed) is True
    assert AuthService.verify_password("WrongPassword123!", hashed) is False

def test_jwt_token_generation_and_decoding():
    user_id = "usr_tenant_abc"
    email = "creator@studio.ai"
    token = AuthService.create_access_token(user_id=user_id, email=email)
    assert isinstance(token, str)
    
    payload = AuthService.decode_access_token(token)
    assert payload["sub"] == user_id
    assert payload["email"] == email

def test_api_key_hashing():
    raw_key = "avs_live_abcdef123456789"
    key_hash = AuthService.hash_api_key(raw_key)
    assert len(key_hash) == 64 # SHA-256 hex string
    assert AuthService.hash_api_key(raw_key) == key_hash
