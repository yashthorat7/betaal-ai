# API Endpoints (betaal_ai)

> **Note:** All endpoints aim to execute live core logic. However, to ensure a smooth hackathon demo, if the core logic or DB fails, they will gracefully catch the error and return fallback static data (Plan B).

## Authentication & User Management
*   **POST** `/auth/verify` - Verify user authentication.
*   **POST** `/auth/login` - User login.
*   **POST** `/auth/logout` - User logout.
*   **GET** `/user/list` - Get a list of users that the account can monitor (like linked profiles).
*   **GET** `/user/{user_id}/stats` - Get stats for a specific user (screen time, app usage, etc.).

## User Profile & Monitoring
*   **GET** `/user/profile` - Retrieve the current user's profile.
*   **PUT** `/user/profile` - Update the current user's profile.
*   **POST** `/user/link` - Link another user (e.g., child account) to monitor, creating a parent-child structure.

## Rehab & Stats
*   **GET** `/rehab/plan` - Retrieve the current rehab plan.
*   **POST** `/rehab/recalculate` - Adjust the rehab plan strictness/rules.
*   **GET** `/usage/summary` - Get a summary dashboard of your usage stats (total screen time, daily averages, etc.).

## AI/Chat Endpoints
*   **POST** `/chat` - User interaction with the AI assistant.
*   **POST** `/ai/evaluate` - Classify addiction risk based on user stats.

## YouTube Recommendations
*   **POST** `/youtube/recommend` - Return YouTube video links based on input (topics/keywords).

## Extension Sync & Monitoring
*   **POST** `/extension/heartbeat` - Extension reports user time, app usage.
*   **GET** `/monitor/{user_id}/stats` - Get that user’s stats, so a parent or friend can view their progress.

## Dashboard & Feature Lists
*   **GET** `/dashboard` - Return a dashboard view aggregating app and extension stats for the user and linked profiles.
*   **GET** `/features` - List all app/extension features.
