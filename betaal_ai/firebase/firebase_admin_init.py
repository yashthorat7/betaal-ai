import firebase_admin
from firebase_admin import credentials, firestore
from config import settings
import os

db = None

def initialize_firebase():
    """Initializes the Firebase Admin SDK. Sets db to None if it fails (Plan B fallback)."""
    global db
    if not firebase_admin._apps:
        try:
            if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                firebase_admin.initialize_app(cred)
                db = firestore.client()
                print("✅ Firebase initialized successfully.")
            else:
                print(f"⚠️ Firebase credentials not found at {settings.FIREBASE_CREDENTIALS_PATH}. Using Plan B fallbacks.")
        except Exception as e:
            print(f"⚠️ Error initializing Firebase: {e}. Using Plan B fallbacks.")

initialize_firebase()
