---
name: backstage-plugin-dev
description: Backstage Plugin Development Orchestrator — use for any plugin development work including adding features, fixing bugs, extending APIs, implementing VCS providers, or building components for the techdocs-editor and onboarding plugins. Triggers on requests like "add a feature", "modify plugin", "add endpoint", "implement component", "frontend", "backend", "extension point", "add provider", "re-run", "update", "partial fix".
---

# Backstage Plugin Development Orchestrator

This skill coordinates Backstage plugin development work across 4 specialist agents: `plugin-architect`, `frontend-dev`, `backend-dev`, and `plugin-qa`.

**Execution mode:** Hybrid

- Phase 1 (Design): single subagent (`plugin-architect`)
- Phase 2 (Implementation): parallel subagents (`frontend-dev` + `backend-dev`, `run_in_background: true`)
- Phase 3 (QA): single subagent (`plugin-qa`)

---

## Phase 0: Context Check

Check whether a `_workspace/` directory already exists to decide the run mode:

- `_workspace/` does not exist → **Fresh run** (execute all phases)
- `_workspace/` exists + user requests a partial fix → **Partial re-run** (run only the relevant phase)
- `_workspace/` exists + user provides a new request → **New run** (rename `_workspace/` to `_workspace_prev/`, then run all phases)

```bash
ls _workspace/ 2>/dev/null && echo "EXISTS" || echo "NEW"
```

---

## Phase 1: Architecture Design

Run the `plugin-architect` agent to produce the API design document.

```
Agent(
  subagent_type: "plugin-architect",
  model: "opus",
  description: "Plugin architecture design",
  prompt: """
  [forward the user's request here]

  Tasks:
  1. Determine which plugin the request targets (techdocs-editor or onboarding)
  2. Read the relevant plugin source files to understand the current structure
  3. Write the design document to `_workspace/01_architect_design.md`

  Plugin locations (both are git submodules with @estehsaan/ npm scope):

  techdocs-editor:
    plugins/backstage-plugin-techdocs-editor/workspaces/techdocs-editor/plugins/techdocs-editor-common/src/
    plugins/backstage-plugin-techdocs-editor/workspaces/techdocs-editor/plugins/techdocs-editor-backend/src/
    plugins/backstage-plugin-techdocs-editor/workspaces/techdocs-editor/plugins/techdocs-editor-react/src/
    plugins/backstage-plugin-techdocs-editor/workspaces/techdocs-editor/plugins/techdocs-editor/src/
    plugins/backstage-plugin-techdocs-editor/workspaces/techdocs-editor/plugins/techdocs-editor-node/src/

  onboarding:
    plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-common/src/
    plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-backend/src/
    plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding/src/
  """
)
```

After the agent completes, read `_workspace/01_architect_design.md`. If there are any "Open Questions", present them to the user and wait for a decision before proceeding to Phase 2.

---

## Phase 2: Parallel Implementation

Launch `frontend-dev` and `backend-dev` at the same time (two Agent calls in the same message). Both agents use only the types the architect defined — no local redefinitions.

```
# Launch both agents simultaneously

Agent(
  subagent_type: "frontend-dev",
  model: "opus",
  description: "Frontend implementation",
  run_in_background: true,
  prompt: """
  Read `_workspace/01_architect_design.md` and implement the frontend changes.
  When done, record a summary of all changes in `_workspace/02_frontend_changes.md`.
  """
)

Agent(
  subagent_type: "backend-dev",
  model: "opus",
  description: "Backend implementation",
  run_in_background: true,
  prompt: """
  Read `_workspace/01_architect_design.md` and implement the backend changes.
  When done, record a summary of all changes in `_workspace/03_backend_changes.md`.
  """
)
```

Wait for both agents to complete. Check each agent's "Blockers" section before moving on.

**Frontend-only changes:** run `frontend-dev` only  
**Backend-only changes:** run `backend-dev` only

---

## Phase 3: QA and Contribution Prep

Run the `plugin-qa` agent.

```
Agent(
  subagent_type: "plugin-qa",
  model: "opus",
  description: "Cross-package QA and changeset",
  prompt: """
  Read the following files and run validation:
  - `_workspace/01_architect_design.md`
  - `_workspace/02_frontend_changes.md` (if it exists)
  - `_workspace/03_backend_changes.md` (if it exists)

  Steps:
  1. Validate cross-package type consistency
  2. Run `yarn tsc`
  3. Run `CI=1 yarn test <changed package paths>`
  4. Create any missing changesets
  5. Determine whether `yarn build:api-reports` is needed

  Record results in `_workspace/04_qa_report.md` and issue a VERDICT.
  """
)
```

**Handling the VERDICT:**

- `PASS`: Report a summary to the user and finish
- `FAIL`: Analyse the BLOCKER, re-run the relevant agent(s), then re-run QA
- `PARTIAL`: Clearly report what passed and what did not to the user

---

## Phase 3.5: Pre-Push Gate (MANDATORY — never skip)

**This gate runs BEFORE any `git push`, `gh pr create`, or commit to an open PR. Every step must pass with zero errors. If any step fails, fix it and re-run from step 1.**

Determine which repo is being pushed:

### Submodule repos (`backstage-plugin-techdocs-editor`, `backstage-plugin-onboarding`)

Run from the **submodule root** (e.g. `plugins/backstage-plugin-techdocs-editor`):

```bash
# 1. Immutable install — must succeed with no YN0028 errors
yarn install --immutable

# 2. Type check — zero errors required
yarn tsc

# 3. Prettier check — zero violations required
yarn prettier:check

# 4. Build all packages
yarn build:all

# 5. Build API reports
yarn build:api-reports:only

# 6. Lint — zero errors required
yarn lint

# 7. Tests — must pass
yarn test
```

### Root Backstage monorepo

Run from the **repo root**:

```bash
# 1. Sync dependencies
yarn install

# 2. Type check — zero errors required
yarn tsc

# 3. Prettier check on changed files — zero violations required
yarn prettier --check <changed-file-paths>

# 4. Lint — zero errors required
yarn lint --fix

# 5. Tests for affected paths — must pass
CI=1 yarn test <affected-paths>

# 6. API reports (if any public API changed)
yarn build:api-reports

# 7. Lockfile sanity — must succeed
yarn install --immutable
```

**Iron law:** `git push` is forbidden until all seven steps produce zero errors. No exceptions.

---

## Phase 4: Completion Report

```markdown
## Summary

### Changed Files

[gathered from _workspace/02_frontend_changes.md and 03_backend_changes.md]

### Changesets Created

[gathered from _workspace/04_qa_report.md]

### Next Steps

- [ ] Run `yarn build:api-reports` (if QA report says YES)
- [ ] Create a PR (use `/.github/PULL_REQUEST_TEMPLATE.md`)
```

---

## Error Handling

| Situation                           | Response                                                |
| ----------------------------------- | ------------------------------------------------------- |
| Architect design has Open Questions | Ask the user, then continue                             |
| Implementation agent has a Blocker  | Orchestrator analyses directly; re-runs agent if needed |
| QA FAIL                             | Re-run only the failing agent(s), then re-run QA        |
| tsc error repeats 2+ times          | Report the situation to the user and ask for a decision |

---

## Test Scenarios

**Happy path:** "Add a file rename feature to techdocs-editor"

1. architect: designs common types + REST endpoint
2. frontend-dev: implements UI component + API client (parallel)
3. backend-dev: implements PATCH /file endpoint (parallel)
4. plugin-qa: tsc passes, tests pass, changeset created → PASS

**Error path:** backend-dev has a wrong import path for a common type

1. backend-dev: records BLOCKER
2. plugin-qa: tsc FAIL → cross-package mismatch detected
3. orchestrator: fixes the import path directly, re-runs QA → PASS

---

## Reference

**Package paths — techdocs-editor (submodule):**

```
plugins/backstage-plugin-techdocs-editor/workspaces/techdocs-editor/plugins/
├── techdocs-editor-common/src/     # shared types, permissions
├── techdocs-editor-backend/src/    # backend plugin, router, providers
├── techdocs-editor-node/src/       # extension points (VcsProvider)
├── techdocs-editor-react/src/      # React components, API client
└── techdocs-editor/src/            # frontend plugin, blueprints
```

**Package paths — onboarding (submodule):**

```
plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/
├── onboarding-common/src/          # shared types, permissions
├── onboarding-backend/src/         # backend plugin, Knex DB, catalog processor
└── onboarding/src/                 # frontend plugin, NFS extensions
```

**npm scopes:** Both use `@estehsaan/` scope on npm.

**Backstage development commands:**

```bash
yarn tsc                            # Type check (from repo root)
CI=1 yarn test <path>               # Run tests
yarn prettier --write <paths>       # Format
yarn lint --fix                     # Lint
yarn build:api-reports              # Generate API reports (when public API changes)
```

**Detailed references:** See `references/` folder:

- `package-paths.md` — full file tree for both plugins
- `backstage-patterns.md` — NFS, changesets, testing conventions
- `new-plugin-guide.md` — step-by-step for creating a new plugin from scratch
