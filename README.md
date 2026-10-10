# MemoryMesh

AI-powered memory layer for the web: a Chrome extension, a Node/Express + MongoDB
backend, and a React dashboard.

## Status

- Backend: auth, memory CRUD, AI analysis, embeddings, related-memory search
- Dashboard: login/register, memories list + search, memory details, settings
- Extension: popup to log in and save the current page

## Setup

```
cd backend && npm install && npm run dev
cd dashboard && npm install && npm run dev
```

Load `extension/` in Chrome via chrome://extensions (Developer mode, Load unpacked).
