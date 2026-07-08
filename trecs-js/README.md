# TRECS JS Prototype

Electron prototype for the TRECS rebuild.

## Current Scope

- Native desktop shell.
- First dashboard view.
- Preload bridge placeholder for future database and filesystem APIs.
- Uses the existing migration prototype database as a reference point.

## Start

Dependencies are installed locally.

```powershell
npm install
npm start
```

The start script clears `ELECTRON_RUN_AS_NODE` before launching Electron. This matters in the current Codex shell because that environment variable is set globally.

## Current Implementation

- Electron shell launches.
- Dashboard reads counts and job rows from `../database/migration_prototype.db`.
- Jobs screen reads job metrics from `../database/migration_prototype.db`.
- Job detail workflow tabs read subjects, orders, images, and package/product data.
- Image previews are loaded through the preload bridge.
- Database access currently uses `sql.js` through Electron's main process.

## Checks

```powershell
npm run check
npm run check:db
```

## Planned Next Implementation

- Add job detail workflow screens for subjects, orders, and images.
- Add migration/import actions after the app shell is stable.
