"""Vercel serverless entry point for the OmniVital FastAPI backend.

Vercel looks for an ASGI app exported from this file.
All routes under /_/backend/* are forwarded here.
"""
import sys
import os

# Put the backend directory on the Python path so we can import server.py
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server import app  # noqa: E402  — must be after sys.path manipulation

# Vercel expects the ASGI app to be named `app`
__all__ = ["app"]
