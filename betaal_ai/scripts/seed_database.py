import sys
import os

# Ensure the root directory is accessible to import config and firebase correctly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from firebase.firebase_admin_init import db
import json

def load_json_file(filename):
    path = os.path.join(os.path.dirname(__file__), f"../data/{filename}")
    if os.path.exists(path):
         with open(path, 'r') as f:
             return json.load(f)
    print(f"⚠️ Warning: Could not find {path}")
    return None

def seed_database():
    """Seeds the demo hackathon data into Firestore."""
    print("🌱 Starting database seeding process...")
    
    # 1. Seed Patient Zero User Profile
    user_data = load_json_file('seed_users.json')
    if user_data:
        for user in user_data:
            db.collection("users").document(user["uid"]).set(user)
            print(f"✅ Seeded user profile: {user['uid']}")
    else:
        # Fallback dummy data if JSON falls through
        db.collection("users").document("demo_user_001").set({
             "uid": "demo_user_001", "name": "Yash", "age": 19, "addiction_level": 8, "strictness": 3
        })
        print(f"✅ Seeded fallback user profile: demo_user_001")

    # 2. Seed 14-days Usage History
    usage_data = load_json_file('seed_usage.json')
    if usage_data:
        # Saving mock usage list as a single aggregated document for easy demo retrieval, 
        # normally you would loop through subcollections
        db.collection("usage_summaries").document("demo_user_001").set({"logs": usage_data})
        print("✅ Seeded 14 days of usage logs")
        
    print("🎉 Database seeding complete!")

if __name__ == "__main__":
    seed_database()
