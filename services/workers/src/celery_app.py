import os
from celery import Celery
from kombu import Queue, Exchange

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "ai_video_studio_workers",
    broker=REDIS_URL,
    backend=REDIS_URL
)

default_exchange = Exchange("default", type="direct")

celery_app.conf.update(
    task_default_queue="q.research",
    task_queues=(
        Queue("q.research", default_exchange, routing_key="research"),
        Queue("q.audio", default_exchange, routing_key="audio"),
        Queue("q.assets", default_exchange, routing_key="assets"),
        Queue("q.motion", default_exchange, routing_key="motion"),
        Queue("q.render", default_exchange, routing_key="render"),
        Queue("q.publish", default_exchange, routing_key="publish"),
        Queue("q.dead", default_exchange, routing_key="dead"),
    ),
    task_routes={
        "services.workers.src.tasks.research.*": {"queue": "q.research"},
        "services.workers.src.tasks.audio.*": {"queue": "q.audio"},
        "services.workers.src.tasks.assets.*": {"queue": "q.assets"},
        "services.workers.src.tasks.motion.*": {"queue": "q.motion"},
        "services.workers.src.tasks.render.*": {"queue": "q.render"},
        "services.workers.src.tasks.publish.*": {"queue": "q.publish"},
    },
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)
