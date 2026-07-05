# Skill Bridge structure parity design

## Objective

Bring `plugins/backstage-plugin-skill-bridge` to the same **project/repo structure quality bar** used by the TechDocs Editor and Onboarding plugin repos, while keeping Skill Bridge feature behavior intact.

## Scope

1. Root documentation and package-facing structure parity.
2. Frontend/backend/common/node/react package surface consistency (exports, index patterns, metadata/scripts where needed).
3. Demo/sample user seeding in skill-bridge backend so users are visible during local testing.
4. Spec-kit gap check recorded in this spec and reflected in resulting changes.

Out of scope:

- Feature parity with TechDocs Editor workflows.
- Large API redesign of Skill Bridge.

## Current state summary

- Skill Bridge already has a 5-package plugin suite layout similar to TechDocs Editor.
- Frontend package already exposes `./alpha`.
- Backend currently seeds default skills but does not appear to seed sample user records for richer demo views.
- Root README is present but lighter than TechDocs Editor/Onboarding docs patterns.
- No explicit "spec kit" files were found by filename/text search; we will use the superpowers spec workflow as the checklist source.

## Design

### 1. Root structure/doc parity

- Update Skill Bridge root README to mirror proven sections:
  - package matrix clarity
  - consumer installation snippets (backend + frontend/NFS)
  - development commands
  - release/conventional commit behavior
  - troubleshooting note for common runtime dependency pitfalls (where relevant)
- Keep content accurate to Skill Bridge behavior rather than copying feature claims from other plugins.

### 2. Package surface consistency

- Validate and normalize package entry surfaces:
  - `index.ts` remains re-export-only for public surface.
  - `/alpha` export remains the NFS entry in frontend package.
  - package metadata and scripts are aligned to the repo conventions used by sibling plugin repos.
- Apply only targeted changes where drift exists.

### 3. Sample users update (demo seed path)

- Extend skill-bridge backend demo-seed flow to include sample users (config-gated, development-oriented), in addition to default skills.
- Seed content should be realistic and useful for discovery/mentor/hack flows.
- Keep seeding idempotent to avoid duplicates across restarts.

### 4. Error handling and behavior safety

- Reuse existing error handling patterns and explicit failures.
- Avoid silent fallbacks and avoid swallowing backend/store errors.
- Preserve existing API contract unless a structural mismatch requires narrow adjustment.

## Validation plan

- Run targeted checks for touched skill-bridge packages/files (typecheck/tests/format/lint relevant to edited scope).
- Confirm seeded sample users appear through existing plugin flows without regressing current behavior.

## Spec-kit checklist outcome

- Required: architecture/scope documented ✅
- Required: components and data flow documented ✅
- Required: error handling and testing approach documented ✅
- Required: explicit out-of-scope boundaries ✅
- Missing external "spec-kit" source in repository: not found by search; superpowers spec workflow used as canonical baseline ✅

## Implementation handoff

Next step is a writing-plans phase that converts this design into an ordered implementation plan for direct code changes in `plugins/backstage-plugin-skill-bridge`.
