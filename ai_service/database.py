import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

load_dotenv()

# We expect a PostgreSQL connection string like: PostgreSQL://user:password@localhost:5432/aidoctor
# For asyncpg: postgresql+asyncpg://user:password@localhost:5432/aidoctor
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://medai:medai123@127.0.0.1:5432/medai")

engine = create_async_engine(DATABASE_URL, echo=True)

async_session_maker = async_sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

Base = declarative_base()

async def get_db_session():
    async with async_session_maker() as session:
        yield session

async def init_db():
    # Will create tables dynamically if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
