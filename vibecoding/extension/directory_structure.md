# Browser Extension Directory Structure — Betaal AI

```
browser-extension/
│
├── manifest.json              # Chrome Extension Manifest V3 config
├── background.js              # Service worker: timer, sync, messaging hub
├── content.js                 # Injected into pages: overlay & warning banner
├── content.css                # Overlay & warning banner layout
│
├── popup/                     # Extension popup (click icon)
│   ├── popup.html             # Popup UI structure
│   ├── popup.css              # Popup layout
│   └── popup.js               # Popup logic (fetch stats from background.js)
│
├── options/                   # Settings page
│   ├── options.html           # Settings UI structure
│   ├── options.css            # Settings layout
│   └── options.js             # Settings logic (daily limit, whitelist, account link)
│
└── icons/                     # Extension icons
    ├── icon-16.png            # Favicon size
    ├── icon-48.png            # Extensions page
    └── icon-128.png           # Chrome Web Store
```
