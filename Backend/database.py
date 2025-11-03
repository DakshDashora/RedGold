from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine= create_engine("sqlite:///./redGold.db" , connect_args={"check_same_thread":False})
sessionLocal= sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base=declarative_base()

def get_db():
    db=sessionLocal()
    try:
        yield db
    finally:
        db.close()