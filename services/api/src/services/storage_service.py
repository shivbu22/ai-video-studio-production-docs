import boto3
from botocore.config import Config
from ..config import settings

class StorageService:
    def __init__(self):
        self.s3_client = boto3.client(
            "s3",
            endpoint_url=settings.S3_ENDPOINT_URL,
            aws_access_key_id=settings.S3_ACCESS_KEY_ID,
            aws_secret_access_key=settings.S3_SECRET_ACCESS_KEY,
            region_name=settings.S3_REGION,
            config=Config(signature_version="s3v4")
        )
        self.bucket = settings.S3_BUCKET_NAME

    def create_upload_url(self, project_id: str, filename: str, content_type: str, ttl_sec: int = 1800) -> dict:
        """Generate a presigned PUT URL for direct client upload."""
        storage_key = f"projects/{project_id}/assets/{filename}"
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
        """Generate a presigned GET URL for secure reading."""
        return self.s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": self.bucket,
                "Key": storage_key
            },
            ExpiresIn=ttl_sec
        )
