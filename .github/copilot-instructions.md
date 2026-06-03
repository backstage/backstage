# Backstage Copilot Instructions

Backstage is an open platform for building developer portals. This is a TypeScript monorepo using Yarn workspaces.

## Commands

Run `yarn install` in the project root before anything else.

| Task                                       | Command                            |
| ------------------------------------------ | ---------------------------------- |
| Run a single test file or dir              | `CI=1 yarn test <path>`            |
| Type check                                 | `yarn tsc` (root only, no options) |
| Format specific files                      | `yarn prettier --write <...paths>` |
| Lint                                       | `yarn lint --fix`                  |
| Generate API reports (before PRs)          | `yarn build:api-reports`           |
| Dev server (frontend :3000, backend :7007) | `yarn start`                       |
| Scaffold new plugin/package                | `yarn new`                         |

**Never run** `yarn build`, `yarn changesets version`, or `yarn release` — those are CI-only.

## Architecture

### Package naming conventions

| Prefix                                              | System                    |
| --------------------------------------------------- | ------------------------- |
| `core-` (e.g. `@backstage/core-plugin-api`)         | Old frontend system       |
| `frontend-` (e.g. `@backstage/frontend-plugin-api`) | New Frontend System (NFS) |
| `backend-` (e.g. `@backstage/backend-plugin-api`)   | Backend system            |

### Key directories

- `/packages` — Core framework packages (`@backstage/`)
- `/plugins` — Plugin packages (`@backstage/plugin-*`)
- `packages/app` — Example app (new frontend system); entry: `packages/app/src/App.tsx`
- `packages/app-legacy` — Example app (old frontend system)
- `packages/backend` — Example backend; entry: `packages/backend/src/index.ts`
- `/.changeset` — Changeset files for versioning

### Custom onboarding plugin (submodule)

`plugins/backstage-plugin-onboarding` is a git submodule → `github.com/Estehsan/backstage-plugin-onboarding`. Three packages under `@estehsaan/`:

- `@estehsaan/backstage-plugin-onboarding` — Frontend (NFS, `/alpha` exports)
- `@estehsaan/backstage-plugin-onboarding-backend` — Backend (Express + Knex + catalog processor)
- `@estehsaan/backstage-plugin-onboarding-common` — Shared types and permissions

Wired in `packages/backend/src/index.ts`; frontend import currently commented out in `packages/app/src/App.tsx`. Update submodule with `git submodule update --remote plugins/backstage-plugin-onboarding`.

## Key Conventions

### TypeScript

- Use `undefined`, never `null`
- No `I` prefix for interfaces
- Type parameters prefixed with `T` (e.g. `Request<TBody>`)
- Error types from `@backstage/errors` (e.g. `throw new NotFoundError(...)`)
- Check error types by name: `if (error.name === 'NotFoundError')`
- Use `ResponseError.fromResponse(res)` for failed fetch responses

### Class design

- Private constructors with static factory methods: `static create()`, `static fromConfig(config, deps)`, `static fromUrl(url)`
- Concrete class names: prefix describing behavior + interface name (e.g. `CachingImageLoader implements ImageLoader`)
- Test-only factory: `/** @internal */ static forTesting()`

### File/export structure

- `index.ts` — re-exports only, no implementation
- Shared types → `types.ts`
- Name files after their main export
- Exported React components: use `function` keyword (not arrow functions) — required for API Extractor docs
- Do not destructure parameters in public function declarations

### API design

- Prefer options objects over many positional args
- Return response objects instead of plain arrays (allows evolving with pagination etc.)
- Prefer common prefixes over suffixes for constants: `WIDGET_LABEL_GITHUB`, not `GITHUB_WIDGET_LABEL`

### Testing

- Prefer fewer thorough tests with multiple assertions over many small tests
- React Testing Library: use `screen` and `.findBy*` queries; avoid `waitFor`
- Do not add test IDs to implementation code

### Changesets

- Required for published packages in `/packages` or `/plugins` when the published version changes
- Create by writing files directly in `/.changeset/` — **never use the changeset CLI**
- Format: frontmatter with package name and bump type, then a description for adopters (not internal details)
- Breaking changes: `minor` for packages `<1.0.0`, `major` for `>=1.0.0`
- Non-breaking new APIs/features: `patch` for `<1.0.0`, `minor` for `>=1.0.0`
- Each changeset targets one package; multi-package changes often need separate changesets

### Commits & PRs

- Commits must have a `Signed-off-by` line (DCO): `git commit -s`
- PR description: use the template at `/.github/PULL_REQUEST_TEMPLATE.md`
- Guideline docs: `/STYLE.md`, `/CONTRIBUTING.md`, `/REVIEWING.md`, `/SECURITY.md`

### Off-limits

- Do not modify ESLint, Prettier, or TypeScript config files unless explicitly asked
- Do not modify `/docs/releases` unless explicitly asked
- Per-package style consistency is more important than cross-repo consistency

## Pre-Push Checklist (MANDATORY)

**You MUST run every step below and confirm it passes before any `git push` or PR creation. Do not skip steps. If any step fails, fix the issue and re-run from the top.**

For the **root Backstage monorepo** (`/Users/.../backstage`):

```bash
# 1. Install / sync dependencies
yarn install

# 2. Type check — must show zero errors
yarn tsc

# 3. Prettier format check — must show zero violations
yarn prettier --check <changed-file-paths>

# 4. Lint — must show zero errors
yarn lint --fix

# 5. Tests for every file/package you touched — must pass
CI=1 yarn test <affected-paths>

# 6. API reports (only if any public package API changed)
yarn build:api-reports

# 7. Immutable install sanity (catches lockfile drift)
yarn install --immutable
```

For **submodule plugin repos** (`backstage-plugin-techdocs-editor`, `backstage-plugin-onboarding`):

```bash
# From the submodule root (e.g. plugins/backstage-plugin-techdocs-editor)

# 1. Immutable install — must succeed with no YN0028 errors
yarn install --immutable

# 2. Type check
yarn tsc

# 3. Prettier check
yarn prettier:check

# 4. Build all packages
yarn build:all

# 5. Build API reports
yarn build:api-reports:only

# 6. Lint
yarn lint

# 7. Tests
yarn test
```

> **Rule:** Never use `git push` or call a PR-creation tool until all seven steps pass with zero errors. Fix failures locally — do not push a "works on CI" shortcut.

## Pull Request Reviews

When reviewing a pull request you MUST calculate a priority score between 0 and 100, where a higher score indicates higher priority. You MUST include the score as an HTML comment at the very beginning of the "PR Overview" section, using the following format: `<!-- priority: <score> -->`.

The score MUST be calculated as a sum of the following:

- **60% Guideline Adherence**: How well does the pull request follow the project guidelines in `/STYLE.md`, `/REVIEWING.md`, `/CONTRIBUTING.md`, and `/SECURITY.md`? A pull request that fully adheres to all guidelines scores 60 points, while one that violates multiple guidelines scores closer to 0.

- **40% Complexity**: How straightforward is the pull request? A simple bug fix or documentation update scores the full 40 points. A complex API change, new feature, or architectural modification scores closer to 0.

Higher priority pull requests (higher scores) are those that are both well-crafted according to project standards AND easy to review and merge quickly.

## graphify

For any question about this repo's architecture, structure, components, or how to add/modify/find
code, your first action should be `graphify query "<question>"` when `graphify-out/graph.json`
exists. Use `graphify path "<A>" "<B>"` for relationship questions and `graphify explain "<concept>"`
for focused-concept questions. These return a scoped subgraph, usually much smaller than the full
report or raw grep output.

Triggers: "how do I…", "where is…", "what does … do", "add/modify a <component>",
"explain the architecture", or anything that depends on how files or classes relate.

**Setup**:

- First time: Run `./scripts/graphify-setup.sh` from repo root (builds the knowledge graph)
- Update after code changes: `graphify update .`
- See `GRAPHIFY_QUICK_REF.md` for common queries or `GRAPHIFY_WORKFLOW.md` for detailed guide

**Query commands**:

- `graphify query "your question"` — Search for architecture/implementation info
- `graphify path "ConceptA" "ConceptB"` — Show relationships between concepts/components
- `graphify explain "symbol"` — Explain a specific concept, class, or function

If `graphify-out/GRAPH_REPORT.md` exists, read it for broad architecture overview. Only read source
files when (a) modifying/debugging specific code, (b) the graph lacks detail, or (c) the graph is stale.

**In Copilot Chat**: Use `/graphify query "..."`, `/graphify path "..."`, or `/graphify explain "..."`
to search the knowledge graph. Type `/graphify` alone to see available commands.
