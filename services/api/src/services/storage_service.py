import os
import hashlib
from pathlib import Path
from typing import Dict, Any, Optional
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from ..config import settings

class StorageService:
    def __init__(self):
        self.provider = settings.STORAGE_PROVIDER # 'r2', 's3', 'minio', or 'local'
        self.bucket = settings.S3_BUCKET_NAME
        self.local_root = Path(os.getenv("LOCAL_STORAGE_DIR", "./storage_data")).resolve()
        self.local_root.mkdir(parents=True, exist_ok=True)

        if self.provider != "local":
            self.s3_client = boto3.client(
                "s3",
                endpoint_url=settings.S3_ENDPOINT_URL if settings.S3_ENDPOINT_URL else None,
                aws_access_key_id=settings.S3_ACCESS_KEY_ID,
                aws_secret_access_key=settings.S3_SECRET_ACCESS_KEY,
                region_name=settings.S3_REGION,
                config=Config(signature_version="s3v4")
            )
        else:
            self.s3_client = None

    def create_upload_url(self, project_id: str, filename: str, content_type: str, ttl_sec: int = 1800) -> Dict[str, Any]:
        """Generate a presigned PUT URL (or local direct upload path) for direct client upload."""
        storage_key = f"projects/{project_id}/assets/{filename}"
        if self.provider == "local" or not self.s3_client:
            target_path = self.local_root / storage_key
            target_path.parent.mkdir(parents=True, exist_ok=True)
            return {
                "upload_url": f"/v1/storage/local-upload/{storage_key}",
                "storage_key": storage_key,
                "expires_in_seconds": ttl_sec,
                "local_path": str(target_path)
            }

        presigned_url = self.s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": self.bucket,
                "Key": storage_key,
                "ContentType": content_type
            },
            ExpiresIn=ttl_sec
        )
        return {
            "upload_url": presigned_url,
            "storage_key": storage_key,
            "expires_in_seconds": ttl_sec
        }

    def create_download_url(self, storage_key: str, ttl_sec: int = 900) -> str:
        """Generate a presigned GET URL (or local serving path) for secure reading."""
        if self.provider == "local" or not self.s3_client:
            return f"/v1/storage/local-files/{storage_key}"

        return self.s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": self.bucket,
                "Key": storage_key
            },
            ExpiresIn=ttl_sec
        )

    def compute_sha256(self, file_path: str) -> str:
        """Compute SHA-256 checksum for asset immutability verification."""
        sha = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                sha.update(chunk)
        return sha.hexdigest()
