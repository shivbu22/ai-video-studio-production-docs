import sys
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from services.api.src.models.entities import Base, Plan

DB_URL = "postgresql+psycopg2://postgres:postgres@localhost:5433/ai_video_studio"

def init_db():
    print(f"Connecting to database at {DB_URL}...")
    engine = create_engine(DB_URL)
    
    print("Creating all tables in PostgreSQL...")
    Base.metadata.create_all(engine)
    print("All tables created successfully!")

    # Seed default plans if not present
    with Session(engine) as session:
        default_plans = [
            Plan(
                id="plan_free",
                name="Free Tier",
                monthly_credits=5,
                max_quality_tier="540p_preview",
                price_paise=0
            ),
            Plan(
                id="plan_starter",
                name="Starter Creator",
                monthly_credits=30,
                max_quality_tier="1080p",
                price_paise=290000 # $29 or 2900 INR
            ),
            Plan(
                id="plan_pro",
                name="Pro Studio",
                monthly_credits=120,
                max_quality_tier="1080p",
                price_paise=790000
            ),
            Plan(
                id="plan_agency",
                name="Agency Unlimited",
                monthly_credits=500,
                max_quality_tier="4k",
                price_paise=2490000
            )
        ]
        
        for plan in default_plans:
            existing = session.scalar(select(Plan).where(Plan.id == plan.id))
            if not existing:
                session.add(plan)
                print(f"Seeded plan: {plan.id} ({plan.name})")
        session.commit()
    print("Database initialization and plan seeding complete!")

if __name__ == "__main__":
    init_db()
