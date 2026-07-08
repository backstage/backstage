# Architecture

## Overview

This Backstage instance is built as a TypeScript monorepo using Yarn workspaces. It consists of a React frontend and a Node.js backend.

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│           packages/app  (:3000)                  │
└───────────────────────┬─────────────────────────┘
                        │ HTTP / WebSocket
┌───────────────────────▼─────────────────────────┐
│              Backstage Backend                   │
│           packages/backend  (:7007)              │
│                                                  │
│  ┌──────────┐  ┌─────────┐  ┌────────────────┐  │
│  │ Catalog  │  │TechDocs │  │  Auth / Plugins │  │
│  └──────────┘  └─────────┘  └────────────────┘  │
└───────────────────────┬─────────────────────────┘
                        │
        ┌───────────────┼──────────────┐
        ▼               ▼              ▼
   GitHub API      SQLite DB      Local FS (docs)
```

## Key packages

| Package                               | Purpose                                  |
| ------------------------------------- | ---------------------------------------- |
| `packages/app`                        | Main frontend (New Frontend System)      |
| `packages/backend`                    | Backend with all plugins wired           |
| `plugins/techdocs-editor`             | In-app TechDocs editor                   |
| `plugins/backstage-plugin-onboarding` | Custom onboarding plugin (git submodule) |

## Data flow for TechDocs

1. Catalog ingests `catalog-info.yaml` from GitHub (via `catalog.providers.github`)
2. On page load, the TechDocs backend fetches and builds docs from the `backstage.io/techdocs-ref` URL
3. Built docs are served from the local filesystem (`techdocs.publisher.type: local`)
4. The TechDocs editor commits changes back to GitHub via the integration token
