import logging
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("hipaa_audit")

class AuditLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # In a real app, you'd get the actual user from auth
        user = "anonymous"
        
        # Log the access for HIPAA audit
        logger.info(f"HIPAA AUDIT: User {user} accessed {request.url.path}")
        
        response = await call_next(request)
        return response
