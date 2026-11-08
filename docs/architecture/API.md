# Hacker News API & Data Layer

The application accesses Hacker News data via the injectable `hnApi` adapter system (`src/universal/lib/hnApi/`), supporting multiple backends:

## Adapters

1. **Modular Firebase Adapter (`hnApi/firebase.js`)**:
   Uses the modular Firebase v11+ Database SDK (`firebase/database`) to query `v0/` realtime endpoints.

2. **REST Adapter (`hnApi/rest.js`)**:
   Uses `fetch` to read from `https://hacker-news.firebaseio.com/v0/{path}.json`.

3. **In-Memory Adapter (`hnApi/memory.js`)**:
   Lightweight in-memory adapter used in tests to simulate Hacker News endpoints deterministically without network calls.

## Library Functions (`src/universal/lib/`)

- `getItem(id, { api })`: Fetches an item and normalizes fields via `transform()`.
- `getStories(type, { page, max, api })`: Fetches paginated story IDs and hydrates item records.
- `getComments(ids, { maxDepth, api })`: Hydrates nested comment trees using an explicit stack up to `maxDepth` (default 10).
- `db.js`: Convenient facade delegating to the active or passed `api`.
