import httpx
import json
import logging
from datetime import datetime
import os

# Configuration
BASE_URL = "http://localhost:8000"
LOG_DIR = "testing/logs"
os.makedirs(LOG_DIR, exist_ok=True)

# Setup logging
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
log_file = os.path.join(LOG_DIR, f"test_run_{timestamp}.log")
report_file = os.path.join(LOG_DIR, f"test_report_{timestamp}.json")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

ENDPOINTS = [
    # Auth
    {"method": "POST", "path": "/auth/verify", "payload": {"id_token": "demo_token_123"}},
    {"method": "POST", "path": "/auth/login", "payload": {"email": "Yash.demo@gmail.com", "password": "password123"}},
    {"method": "POST", "path": "/auth/logout", "payload": {"uid": "demo_user_001", "session_token": "sess_abc123"}},
    
    # User
    {"method": "GET", "path": "/user/profile", "params": {"uid": "demo_user_001"}},
    {"method": "PUT", "path": "/user/profile", "payload": {"uid": "demo_user_001", "name": "Yash Updated", "age": 20, "addiction_level": 8, "strictness": 3}},
    {"method": "GET", "path": "/user/list", "params": {"uid": "demo_user_001"}},
    {"method": "GET", "path": "/user/demo_user_001/stats"},
    {"method": "POST", "path": "/user/link", "payload": {"parent_uid": "demo_parent_001", "child_uid": "demo_user_001", "relation": "child", "link_code": "LINK123"}},
    
    # Usage
    {"method": "POST", "path": "/usage/log", "payload": {"uid": "demo_user_001", "events": [{"app_name": "Instagram", "category": "Social", "start": "2025-01-14T10:00:00Z", "end": "2025-01-14T10:15:00Z"}]}},
    {"method": "GET", "path": "/usage/stats", "params": {"uid": "demo_user_001"}},
    {"method": "GET", "path": "/usage/heatmap", "params": {"uid": "demo_user_001"}},
    {"method": "GET", "path": "/usage/summary", "params": {"uid": "demo_user_001"}},
    
    # AI & Chat
    {"method": "POST", "path": "/chat", "payload": {"uid": "demo_user_001", "message": "I need help reducing screen time", "session_id": "sess_123"}},
    {"method": "POST", "path": "/ai/evaluate", "payload": {"uid": "demo_user_001"}},
    {"method": "POST", "path": "/ai/schedule-session", "payload": {"user_name": "Yash", "daily_limit": 120, "recent_single_sitting_time": 45}},
    {"method": "POST", "path": "/youtube/recommend", "payload": {"uid": "demo_user_001", "prompt": "productivity", "topics": ["coding"], "keywords": ["python", "ai"]}},
    
    # Monitoring
    {"method": "GET", "path": "/monitor/demo_user_001/stats"},
    {"method": "PUT", "path": "/monitor/demo_user_001/strictness", "payload": {"parent_uid": "demo_parent_001", "new_strictness": 5}},
    
    # Rehab & Reports
    {"method": "GET", "path": "/rehab/plan", "params": {"uid": "demo_user_001"}},
    {"method": "POST", "path": "/rehab/recalculate", "payload": {"uid": "demo_user_001", "addiction_level": 8, "strictness": 4}},
    {"method": "GET", "path": "/report/daily", "params": {"uid": "demo_user_001"}},
    {"method": "GET", "path": "/report/weekly", "params": {"uid": "demo_user_001"}},
    
    # Extension & System
    {"method": "POST", "path": "/extension/heartbeat", "payload": {"uid": "demo_user_001", "today_browser_sec": 2700, "domains": [{"domain": "youtube.com", "seconds": 1200}]}},
    {"method": "POST", "path": "/extension/cooldown", "payload": {"uid": "demo_user_001", "daily_limit_sec": 1800, "num_effects": 4}},
    {"method": "GET", "path": "/dashboard", "params": {"uid": "demo_user_001"}},
    {"method": "GET", "path": "/features"},
    {"method": "GET", "path": "/health"}
]

async def run_tests():
    report = {
        "summary": {"total": len(ENDPOINTS), "passed": 0, "failed": 0},
        "details": []
    }
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        for test in ENDPOINTS:
            method = test["method"]
            path = test.get("path", test.get("/", "/")) # fallback for one dict error
            # Fix the error in my list definition
            if "path" not in test:
                # find the one that missed path key
                for key in test:
                    if key.startswith("/"):
                        path = key
                        break
            
            payload = test.get("payload")
            params = test.get("params")
            url = f"{BASE_URL}{path}"
            
            logger.info(f"Testing {method} {path}...")
            
            try:
                if method == "GET":
                    response = await client.get(url, params=params)
                elif method == "POST":
                    response = await client.post(url, json=payload)
                elif method == "PUT":
                    response = await client.put(url, json=payload)
                else:
                    logger.warning(f"Unsupported method: {method}")
                    continue
                
                status_code = response.status_code
                passed = 200 <= status_code < 300
                
                result = {
                    "method": method,
                    "path": path,
                    "status_code": status_code,
                    "passed": passed,
                    "response": response.json() if "application/json" in response.headers.get("content-type", "") else response.text[:200]
                }
                
                if passed:
                    report["summary"]["passed"] += 1
                    logger.info(f"✅ PASSED ({status_code})")
                else:
                    report["summary"]["failed"] += 1
                    logger.error(f"❌ FAILED ({status_code}) - {response.text[:200]}")
                
                report["details"].append(result)
                
            except Exception as e:
                logger.error(f"💥 ERROR testing {path}: {str(e)}")
                report["summary"]["failed"] += 1
                report["details"].append({
                    "method": method,
                    "path": path,
                    "error": str(e),
                    "passed": False
                })

    # Save report
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    logger.info("-" * 40)
    logger.info(f"TEST COMPLETE")
    logger.info(f"Total: {report['summary']['total']}")
    logger.info(f"Passed: {report['summary']['passed']}")
    logger.info(f"Failed: {report['summary']['failed']}")
    logger.info(f"Report saved to {report_file}")
    logger.info("-" * 40)

if __name__ == "__main__":
    import asyncio
    asyncio.run(run_tests())
