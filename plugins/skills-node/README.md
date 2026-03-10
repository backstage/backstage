# @backstage/plugin-skills-node

Node.js library for the Backstage Skills plugin, providing a service interface for registering skills programmatically from backend services.

## Installation

```bash
yarn --cwd packages/backend add @backstage/plugin-skills-node
```

## Usage

Use the `skillsRegistryServiceRef` to register skills from other backend services:

```typescript
import { skillsRegistryServiceRef } from '@backstage/plugin-skills-node';
import {
  createBackendPlugin,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';

export default createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: {
        skillsRegistry: skillsRegistryServiceRef,
      },
      async init({ skillsRegistry }) {
        await skillsRegistry.registerSkills([
          {
            skill: resolvePackagePath(
              '@backstage/plugin-my-plugin-backend',
              'src/skills/code-review/SKILL.md',
            ),
            additionalFiles: [
              resolvePackagePath(
                '@backstage/plugin-my-plugin-backend',
                'src/skills/code-review/prompts/review.md',
              ),
              resolvePackagePath(
                '@backstage/plugin-my-plugin-backend',
                'src/skills/code-review/scripts/run.py',
              ),
            ],
          },
        ]);
      },
    });
  },
});
```

Filesystem sources can be absolute paths or relative paths. Relative paths are resolved from the current working directory of the backend process, so for files that belong to your plugin package, prefer `resolvePackagePath(...)` instead of `./relative-path`.

If you register local skill files from your package, you must also include them in the package `files` list so they are available after publishing. A common layout is to keep skills under `src/skills/**/*`:

```json
{
  "files": ["dist", "src/skills/**/*"]
}
```

If your package also ships other top-level files that must be published, include those alongside the skills glob.

You can also register skills directly from SCM-backed URLs:

```typescript
await skillsRegistry.registerSkills([
  {
    skill:
      'https://github.com/backstage/community-plugins/blob/main/workspaces/example/skills/code-review/SKILL.md',
    additionalFiles: [
      'https://github.com/backstage/community-plugins/blob/main/workspaces/example/skills/code-review/prompts/review.md',
      'https://github.com/backstage/community-plugins/blob/main/workspaces/example/skills/code-review/scripts/run.py',
    ],
  },
]);
```

When files are read from disk or fetched from URLs, additional files are uploaded using paths relative to the directory that contains `SKILL.md`. Additional files must use the same source type as `SKILL.md`, and URL-based files must come from the same origin and remain within the same skill directory.

If a `SKILL.md` source cannot be processed, the registry service logs a warning that includes the original error and skips that skill. If an additional file cannot be processed, the service logs a warning that includes the original error and registers the skill without that file.

## Service Interface

### `SkillsRegistryService`

- `registerSkills(sources: SkillSource[])`: Replaces all skills previously registered by the calling service subject with the provided batch.
