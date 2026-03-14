# @backstage/plugin-skills-backend

Backend plugin for managing agent skills in Backstage. Provides a REST API and well-known endpoints compatible with the [Agent Skills specification](https://agentskills.io).

## Installation

```bash
yarn --cwd packages/backend add @backstage/plugin-skills-backend
```

Then add the plugin to your backend in `packages/backend/src/index.ts`:

```typescript
backend.add(import('@backstage/plugin-skills-backend'));
```

## Features

- **Skills read API**: List and read agent skills over authenticated endpoints
- **Batch registration API**: Service callers replace all skills previously registered under their own service subject in one request
- **Well-known endpoints**: Serves `/.well-known/skills/index.json` and skill files, compatible with the `skills install` CLI
- **Database storage**: Persists skills and their files using the Backstage database service
- **Source tracking**: Each skill stores the full caller service subject as its `source`, for example `plugin:catalog` or `external:ci-bot`
- **Service registration**: Other backend services can register skills via the `skillsRegistryServiceRef` from `@backstage/plugin-skills-node`

## API

| Method | Path                             | Auth    | Description                                                             |
| ------ | -------------------------------- | ------- | ----------------------------------------------------------------------- |
| GET    | `/skills`                        | Yes     | List skills with search, pagination, ordering                           |
| GET    | `/skills/:name`                  | Yes     | Get a single skill                                                      |
| GET    | `/skills/:name/files`            | Yes     | Get files for a skill                                                   |
| PUT    | `/skills`                        | Service | Replace all skills previously registered by the calling service subject |
| GET    | `/.well-known/skills/index.json` | No      | Well-known skills index                                                 |
| GET    | `/.well-known/skills/:name/*`    | No      | Serve individual skill files                                            |

The `PUT /skills` request body has the following shape:

```json
{
  "skills": [
    {
      "files": [
        { "path": "SKILL.md", "content": "..." },
        { "path": "prompts/review.md", "content": "..." }
      ]
    }
  ]
}
```
