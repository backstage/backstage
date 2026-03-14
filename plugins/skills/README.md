# @backstage/plugin-skills

Frontend plugin for browsing and managing agent skills in Backstage. Built with the new frontend system and BUI components.

## Installation

```bash
yarn --cwd packages/app add @backstage/plugin-skills
```

Then add the plugin to your app in `packages/app/src/App.tsx`:

```typescript
import skillsPlugin from '@backstage/plugin-skills';

// Add to your app's features:
const app = createApp({
  features: [
    // ...other plugins
    skillsPlugin,
  ],
});
```

## Features

- **Skills list page**: Browse all registered skills with search, pagination, and sorting at `/skills`
- **Skill detail page**: View skill details, source, files, and install command at `/skills/:name`
- **New frontend system only**: Uses `@backstage/frontend-plugin-api` and BUI components

## Pages

- `/skills` — Lists all skills with search and pagination
- `/skills/:name` — Shows skill details, license, files, and install command
