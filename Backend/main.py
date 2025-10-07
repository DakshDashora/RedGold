import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from sqlalchemy.orm import Session
from database import Base, engine, sessionLocal
from routes import auth, myrequests, donor
from routes.myrequests import expire_old_requests  # Dead state expiration
from routes.donor import handle_no_shows        # No-show handling

app = FastAPI()

# ---------------- Create tables ----------------
Base.metadata.create_all(bind=engine)

# ---------------- Include routers ----------------
app.include_router(auth.router)
app.include_router(myrequests.router)
app.include_router(donor.router)

# ---------------- Background task: Expire old pending requests ----------------
async def expire_pending_requests_periodically():
    while True:
        await asyncio.sleep(3600)  # Run every 1 hour
        db: Session = sessionLocal()
        try:
            expire_old_requests(db)
            print("Expired old pending requests (Dead state) ✅")
        except Exception as e:
            print(f"Error expiring requests: {e}")
        finally:
            db.close()

# ---------------- Background task: Handle no-shows ----------------
async def handle_no_shows_periodically():
    while True:
        await asyncio.sleep(3600)  # Run every 1 hour
        db: Session = sessionLocal()
        try:
            handle_no_shows(db)
            print("No-shows checked ✅")
        except Exception as e:
            print(f"Error handling no-shows: {e}")
        finally:
            db.close()

# ---------------- Lifespan context (Startup + Shutdown) ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start background tasks
    expire_task = asyncio.create_task(expire_pending_requests_periodically())
    no_show_task = asyncio.create_task(handle_no_shows_periodically())

    yield  # App is now running

    # Shutdown: cancel background tasks
    expire_task.cancel()
    no_show_task.cancel()
    try:
        await expire_task
    except asyncio.CancelledError:
        pass
    try:
        await no_show_task
    except asyncio.CancelledError:
        pass

app.router.lifespan_context = lifespan

# ---------------- Custom OpenAPI ----------------
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="RedGold API",
        version="1.0.0",
        description="Red Gold",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    for path in openapi_schema["paths"].values():
        for operation in path.values():
            operation["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
