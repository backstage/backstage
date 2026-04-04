# Plugin Architecture Reference

## Folder Structures

### Frontend Plugin

```
plugins/my-plugin/
├── dev/
│   └── index.tsx              # Standalone dev environment
├── src/
│   ├── alpha/
│   │   └── index.ts           # Experimental/new system exports
│   ├── apis/
│   │   ├── MyPluginApi.ts     # API interface definition
│   │   ├── MyPluginClient.ts  # API client implementation
│   │   └── index.ts
│   ├── components/
│   │   ├── MyPage/
│   │   │   ├── MyPage.tsx
│   │   │   ├── MyPage.test.tsx
│   │   │   └── index.ts
│   │   ├── MyCard/
│   │   │   ├── MyCard.tsx
│   │   │   ├── MyCard.test.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── index.ts               # Main public API exports
│   ├── plugin.ts              # Plugin definition + extensions
│   ├── plugin.test.ts         # Plugin smoke test
│   ├── routes.ts              # Route refs
│   └── setupTests.ts
├── config.d.ts                # Config schema (if needed)
├── package.json
├── README.md
└── catalog-info.yaml
```

### Backend Plugin

```
plugins/my-plugin-backend/
├── dev/
│   └── index.ts               # Standalone dev environment
├── src/
│   ├── service/
│   │   ├── plugin.ts          # Backend plugin definition
│   │   ├── plugin.test.ts
│   │   ├── router.ts          # Express router
│   │   └── router.test.ts
│   ├── processors/            # Data processors (if applicable)
│   ├── providers/             # Entity providers (if applicable)
│   └── index.ts               # Public API exports
├── config.d.ts
├── package.json
├── README.md
└── catalog-info.yaml
```

### Backend Module

```
plugins/my-plugin-backend-module-github/
├── src/
│   ├── module/
│   │   ├── module.ts          # Module definition
│   │   └── index.ts
│   ├── providers/
│   │   └── GithubEntityProvider.ts
│   ├── processors/
│   │   └── GithubProcessor.ts
│   └── index.ts
├── config.d.ts
├── package.json
└── README.md
```

### Common Package

```
plugins/my-plugin-common/
├── src/
│   ├── types.ts               # Shared TypeScript types
│   ├── constants.ts           # Shared constants
│   ├── permissions.ts         # Permission definitions
│   └── index.ts               # Re-export everything
├── package.json
└── README.md
```

### Community Plugins Workspace

```
workspaces/my-plugin/
├── .changeset/                # Workspace-scoped changesets
│   └── config.json
├── packages/
│   ├── app/                   # Optional dev app
│   └── backend/               # Optional dev backend
├── plugins/
│   ├── my-plugin/             # Frontend plugin
│   ├── my-plugin-backend/     # Backend plugin
│   └── my-plugin-common/      # Shared types
├── package.json               # Workspace root
├── tsconfig.json
└── README.md
```

## Package Relationship Diagram

```
                    ┌──────────────────┐
                    │  my-plugin-common │  (types, constants, permissions)
                    └────────┬─────────┘
                         ┌───┴───┐
                    uses │       │ uses
                         ▼       ▼
              ┌──────────────┐  ┌───────────────────┐
              │  my-plugin   │  │ my-plugin-backend  │
              │  (frontend)  │  │    (backend)       │
              └──────────────┘  └────────┬───────────┘
                                    exposes│extension points
                                         ▼
                              ┌─────────────────────────────┐
                              │ my-plugin-backend-module-xxx │
                              │     (extends backend)       │
                              └─────────────────────────────┘
```

## Naming Conventions

| Package Type | Name Pattern | Scope (community) | Role |
|---|---|---|---|
| Frontend plugin | `plugin-{name}` | `@backstage-community/plugin-{name}` | `frontend-plugin` |
| Backend plugin | `plugin-{name}-backend` | `@backstage-community/plugin-{name}-backend` | `backend-plugin` |
| Backend module | `plugin-{name}-backend-module-{mod}` | `@backstage-community/plugin-{name}-backend-module-{mod}` | `backend-plugin-module` |
| Common library | `plugin-{name}-common` | `@backstage-community/plugin-{name}-common` | `common-library` |
| React library | `plugin-{name}-react` | `@backstage-community/plugin-{name}-react` | `frontend-plugin` |
| Node library | `plugin-{name}-node` | `@backstage-community/plugin-{name}-node` | `node-library` |

For private/internal plugins, use your org scope: `@internal/plugin-{name}`
