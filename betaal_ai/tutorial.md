# Betaal AI Backend Tutorial

This tutorial covers how to set up the Betaal AI backend for local development, configure environment variables, and get everything running for the demonstration.

## 1. Prerequisites
- Python 3.9+
- A Google Cloud / Firebase account
- A Google AI Studio account (for Gemini)

## 2. Setting Up the Virtual Environment

1. Open your terminal in the `betaal_ai` directory.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - **Windows:** `venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`

## 3. Installing Dependencies

Install the required packages:
```bash
pip install -r requirements.txt
```

## 4. Configuring Environment Variables (`.env`)

The application requires specific environment variables to connect to Firebase and Gemini. 

1. Create a file named `.env` in the root of `betaal_ai`.
2. Copy the contents of `.env.example` into your new `.env` file:
   ```env
   FIREBASE_CREDENTIALS_PATH=./firebase/service_account_key.json
   GEMINI_API_KEY=your_gemini_api_key_here
   CORS_ORIGINS=http://localhost:3000,http://localhost:8080,chrome-extension://*
   PORT=8000
   ```

### Acquiring the Values:

**1. Firebase Service Account Key:**
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Open your project and navigate to **Project Settings** > **Service Accounts**.
- Click **Generate new private key** and download the JSON file.
- Rename the downloaded file to `service_account_key.json` and place it in the `firebase/` directory inside `betaal_ai`.
- *Note: This file is ignored by Git. Never commit this file to a public repository.*

**2. Gemini API Key:**
- Go to [Google AI Studio](https://aistudio.google.com/).
- Click **Get API key** and create a new key.
- Paste this key into your `.env` file as `GEMINI_API_KEY=your_actual_key_here`.

## 5. Seeding the Database

Before starting the server, seed your Firebase Firestore with the initial mock data:
```bash
python scripts/seed_database.py
```
This script will populate the database with default users, rehab plans, and usage statistics.

## 6. Running the Server

Start the FastAPI application using Uvicorn:
```bash
.\venv\Scripts\activate; uvicorn main:app --reload

```

- The API will be running at `http://localhost:8000`
- Interactive API docs (Swagger UI) are available at `http://localhost:8000/docs`

