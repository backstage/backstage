---
id: well-known-skills
title: Well-known published skills
description: This section lists the AI skills published by the Backstage project.
---

This section lists the [AI skills](./skills.md) published by the Backstage project at the [`backstage.io` well-known endpoint](https://backstage.io/.well-known/skills/). Install any of these skills into your repository with:

```bash
npx skills add https://backstage.io
```

## Skills

### Plugin Development

- `frontend-plugin-development`: Reference for building, wiring, running, and testing frontend plugins on the new frontend system. Covers plugin packaging, app integration, entity page content, dev apps, tests, and troubleshooting plugins that do not show up or fail at startup.
- `backend-plugin-development`: Reference for developing backend plugins and modules on the new backend system. Currently covers testing with `@backstage/backend-test-utils`, including mocking core services and credentials, and testing against real databases, caches, the filesystem, and remote services.

### Frontend System Migration

- `new-frontend-system-migration`: Migrate a Backstage app, its frontend plugins, or both from the old frontend system to the new one. Covers the hybrid and full app migration, plugins that keep old-system support and plugins that drop it, and the order to follow when a repository has both an app and plugins.

### UI Migration

- `mui-to-bui-migration`: Migrate Backstage plugins from Material UI (MUI) to Backstage UI (BUI), either by running the `@backstage/mui4-to-bui-migration-recipe` codemod and finishing what it leaves, or with standalone guidance. Covers component mapping, import updates, and styling pattern replacements.

### Instrumentation

- `plugin-analytics-instrumentation`: Instrument a Backstage frontend plugin with analytics events using the Backstage Analytics API. Covers adding, reviewing, and extending event capture, deciding whether an interaction warrants an event, and writing tests for analytics behavior.

### Backend Tooling

- `onboard-to-openapi-server`: Migrate an existing Backstage backend plugin's hand-written Express router to the typed OpenAPI tooling. Optionally covers typed client generation and migrating router tests to the OpenAPI test wrapper.
