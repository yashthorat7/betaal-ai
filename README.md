# 👁️ Betaal AI

<p align="center">
  <img src="logo.png" alt="Betaal AI Banner" width="100%">
</p>

A **digital rehabilitation ecosystem** designed to break the digital loop and reclaim human presence.  
**Betaal AI** combats smartphone addiction through **adaptive, intelligent interruptions** that gradually retrain your focus rather than relying on rigid app-blocking.
It is an vibecoded project

## ✨ Features

- 🧠 **AI-Driven Focus Engine**: Analyzes real-time usage patterns to predict and prevent addictive loops.
- ⚡ **Adaptive Interruptions**: Intelligent, non-blocking nudges that grow stronger as you drift deeper.
- 📱 **Multi-Platform Sync**: Seamless synchronization across Mobile, Web Dashboard, and Browser Guard.
- 📊 **Clinical Insights**: Deep analytics into your digital recovery journey with progress visualization.
- 🔐 **Privacy First**: Secure, encrypted data handling with local-first processing for user safety.
- 🎨 **Minimalist Design**: A charcoal-and-teal aesthetic optimized for low cognitive load and focus.

## 📂 Directory Structure

```
🌟 Betaal-AI-Monorepo/
├── 📂 betaal_ai/                  # 🧠 AI Backend & ML Core (FastAPI)
│   ├── 📂 data/                   # JSON seed data & usage logs
│   ├── 📂 engine/                 # Core interruption math & logic
│   ├── 📂 ml/                     # ML training, inference, & models
│   ├── 📂 routers/                # API Endpoints & Routes
│   └── 📜 main.py                 # Application entry point
│
├── 📂 betaal_app/                 # 📱 Flutter Mobile Experience
│   ├── 📂 lib/                    # Dart source code (Screens, Widgets)
│   ├── 📂 assets/                 # Branding & UI resources
│   └── 📜 pubspec.yaml            # Flutter configuration
│
├── 📂 betaal_web/                 # 🌐 Next.js Clinical Dashboard
│   ├── 📂 app/                    # App router pages & layouts
│   ├── 📂 components/             # Reusable React UI components
│   └── 📜 next.config.mjs         # Next.js configuration
│
├── 📂 betaal_ex/                  # 🧩 Chrome Extension Guard
│   ├── 📂 background/             # Extension service workers
│   ├── 📂 popup/                  # Extension UI & controls
│   └── 📜 manifest.json           # Extension manifest v3
│
└── 📜 README.md                   # Ecosystem Documentation
```

---

## 📦 Ecosystem Components

| Component | Directory | Tech Stack | Description |
| :--- | :--- | :--- | :--- |
| **Backend Core** | `betaal_ai/` | Python, FastAPI, TF | The central logic and ML engine for session analysis. |
| **Mobile App** | `betaal_app/` | Flutter, Dart, Kotlin | The primary interface for digital rehab on the go. |
| **Web Dashboard** | `betaal_web/` | Next.js, React, Tailwind | Clinical overview and progress tracking dashboard. |
| **Browser Guard** | `betaal_ex/` | JS, Chrome MV3 | Desktop browser extension to manage web-based loops. |

---

## 📄 Getting Started

Follow these steps to set up the Betaal AI ecosystem on your local machine:

### 1️⃣ Repository Setup
```bash
git clone https://github.com/yashthorat7/betaal-ai.git
cd betaal-ai
```

### 2️⃣ Backend Initialization
```bash
cd betaal_ai
pip install -r requirements.txt
python main.py
```

### 3️⃣ Mobile Deployment
```bash
cd betaal_app
flutter pub get
flutter run
```

### 4️⃣ Web App Launch
```bash
cd betaal_web
npm install
npm run dev
```

---

## ❤️ Developed By

The core team dedicated to reclaiming human presence:

| Member | Role | Responsibilities |
| :--- | :--- | :--- |
| **Yash** | Lead Architect | Ideation, AI/Backend Engine, & System Integration |
| **Divesh** | Mobile Lead | Flutter Development & App User Experience |
| **Bhumika** | Web & UX | Clinical Web Dashboard & Design System |
| **Diya** | Extension & Data | Browser Extension & Synthetic Data Generation |

👨‍💻 **Vibecoded**  
Feel free to suggest improvements or star the repo if you support digital wellness!
