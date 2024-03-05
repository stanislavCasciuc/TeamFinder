from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Database connection
URL_DATABASE = 'postgresql://quantumtrio_vjd8j4:ATC2024!SecurePassword@atc-2024-postgresql-server.postgres.database.azure.com:5432/atc-2024-quantumtrio-postgresql-database'

engine= create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()