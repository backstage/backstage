# Onboarding Plugin: Restricted Assignment, Manual Buddy Assignment & Team/Buddy Views

Status: Approved (pending user review of this document)
Date: 2026-07-01
Package: `@estehsaan/backstage-plugin-onboarding` (+ `-backend`, `-common`)

## Background

Two pieces of work for the onboarding plugin (`plugins/backstage-plugin-onboarding` submodule):

1. **Bug fix (already implemented and verified)**: `@backstage/ui`'s `Tag` component
   is a react-aria-components collection item and must be rendered inside a
   `TagGroup`/`TagList`. `TaskDetailPanel.tsx` rendered resource `Tag`s standalone,
   which threw "cannot be rendered outside a collection" whenever a user expanded
   a task that had learning resources attached. Fixed by wrapping the resource
   tags in a `TagGroup`, matching the pattern already used in `TaskItem.tsx`. A
   regression test (`TaskDetailPanel.test.tsx`) was added.

2. **New feature work (this design)**:
   - Restrict who can assign onboarding templates to a configured catalog group.
   - Allow manually assigning (and changing) a "buddy" for a joiner, independent
     of the existing `buddy.autoAssign` config.
   - Give team leads a scoped "Team View" (only their own team(s), auto-detected
     — no free-text team name entry) and give buddies a lightweight "My Buddies"
     view of just the joiners they're supporting.
   - Redesign the Templates page cards (current layout has no spacing between
     title/description/tags and a bare text link for the primary action).

## Goals

- Only members of a configured catalog group ("assigners") can assign templates,
  assign/change buddies, or view team-wide onboarding stats.
- A buddy can be set manually on any onboarding record, overriding/replacing
  whatever auto-assignment produced, editable at any time.
- Leads see a scoped Team View without typing a team name; if they lead more
  than one team, they get a simple selector.
- Buddies (who are not assigners) see a "My Buddies" view listing just the
  joiners they're the buddy for, read-only.
- Users who are neither assigners nor buddies for anyone don't see a Team View
  tab or a Templates tab at all.
- Templates page card design is visually cleaned up (spacing, badge placement,
  full-width primary button) consistently across loaded/empty states.

## Non-goals

- Multiple buddies per joiner (out of scope; one buddy per onboarding record).
- Per-template assigner group overrides (one global config list for now).
- Building out Backstage's full conditional-decision / permission-rule
  framework for resource-scoped permissions. Group membership is enforced as an
  additional backend check layered on top of the existing binary
  `permissions.authorize()` calls, not as a custom `PermissionRule`. This keeps
  the implementation consistent with the plugin's existing simple
  authorization style, while still letting operators tighten access further
  via their own permission policy (DENY at the policy level always wins).

## Data model & config changes

### Config (`onboarding-backend/config.d.ts`)

```ts
onboarding: {
  defaults: {
    // Existing: activeJoinerWindowDays, buddy.autoAssign
    assignerGroups?: string[]; // catalog group refs, e.g. ["group:default/team-leads"]
                                // Empty/unset = no restriction (everyone allowed),
                                // preserving current behavior for existing deployments.
  }
}
```

### Database

New migration `2026XXXX_add_buddy_user_id.js` adding a nullable
`buddy_user_id` column to `onboarding_progress`. `DatabaseOnboardingStore` gets
a `setBuddy(userId, buddyUserId)` method plus updates to `rowToProgress` /
`upsertProgress` to carry the field through.

### Types (`onboarding-common/src/types.ts`)

- `OnboardingProgress.buddyUserId?: string`
- `TeamOnboardingStats.activeJoiners[].buddyUserId?: string` and
  `buddyDisplayName?: string`

## Backend changes

### Group membership helper

```ts
async function isMemberOfAssignerGroup(
  catalogApi: CatalogApi,
  callerRef: string,
  config: RootConfigService,
): Promise<boolean>;
```

Reads `onboarding.defaults.assignerGroups`. Returns `true` immediately if the
list is empty/unset (no restriction configured). Otherwise resolves the
caller's `User` entity and checks its `memberOf` relations against the
configured group refs.

This check is layered **in addition to** the existing
`permissions.authorize([{ permission: onboardingTemplateAssignPermission }])`
/ `onboardingTeamReadPermission` calls — both must pass. A custom permission
policy can still independently DENY.

### Buddy read access

`assertUserAccess` (used by `/progress/:userId` and the task-update route)
gains a third allow path: if the caller is recorded as `buddyUserId` on that
specific progress record, treat as authorized even without
`onboardingTeamReadPermission` / assigner-group membership. Owner and elevated
(assigner) paths are unchanged.

### New/changed routes

- `POST /progress/:userId/buddy` — body `{ buddyUserId: string | null }`.
  Requires `onboardingTemplateAssignPermission` + assigner-group membership.
  Validates `buddyUserId` is an existing catalog `User` (or `null` to clear).
- `GET /teams/mine` — returns the bare catalog group names (e.g. `"platform"`,
  matching the existing `:teamName` route param format used by
  `/team/:teamName/stats`, i.e. `group:default/<name>` with the default
  namespace stripped) that the caller both belongs to and holds
  assigner-group membership for. Empty array if caller isn't an assigner.
- `GET /buddies/mine` — returns progress summaries (same shape as
  `activeJoiners`) for every record where `buddyUserId` matches the caller.
  No special permission beyond authentication — inherently self-scoped.
- `GET /team/:teamName/stats` — unchanged shape, but now also requires the
  caller to be a member of the `teamName` group itself (in addition to holding
  `onboardingTeamReadPermission` + assigner-group membership), so a lead can't
  query an arbitrary team name they don't belong to.
- `POST /templates/:templateName/assign/:userId` — body gains optional
  `buddyUserId`, persisted atomically with the initial assignment.

## Frontend changes

### Templates page redesign

Card layout: role badge in the header row, description with proper spacing
below the title, a tag row for task/phase counts, and a full-width primary
"Use Template" button anchoring the footer. Applied to loading and empty
states for consistency. The Templates tab itself is hidden entirely (via
`usePermission(onboardingTemplateAssignPermission)`, combined with an
assigner-group check surfaced from the backend) for users without assign
access.

### Assign dialog

Existing catalog user search / manual entity-ref picker for the joiner is
unchanged. A second, optional "Add a buddy" picker (same search component,
parameterized) is added below it. Submitting the dialog assigns the template
and buddy together in one call.

### Team View tab

On load, fetches `/teams/mine` and `/buddies/mine`:

- If `teams.length > 0` (caller is a lead): render the existing roster table,
  adding a team selector (only shown when `teams.length > 1`) and a "Buddy"
  column with an inline "Assign/change buddy" action per row.
- Else if `buddies.length > 0`: render a read-only "My Buddies" list (name,
  role, progress bar, blocked count) — no team selector, no assign actions.
- Else: the Team View tab is not rendered at all.

## Testing plan

- Backend: unit tests for `isMemberOfAssignerGroup` (member / non-member /
  unset config); route tests for `/teams/mine`, `/buddies/mine`, buddy
  assign/clear, and the tightened `/team/:teamName/stats` (expect 403 when a
  lead queries a team they don't belong to).
- Frontend: `usePermission`-based visibility tests for the Templates and Team
  View tabs; TeamView tests covering lead-mode, buddy-mode, and hidden states;
  assign dialog test covering the buddy picker.
- Existing regression test `TaskDetailPanel.test.tsx` continues to guard the
  bug fix.

## Error handling

- `NotAllowedError` (403) for permission or group-membership failures.
- `InputError` (400) for an invalid/non-existent `buddyUserId`.
- `NotFoundError` (404) unchanged for missing progress/template/user records.

## Changesets

Separate changesets (each `minor`, per pre-1.0 convention) for:

- `@estehsaan/backstage-plugin-onboarding-common` (new types)
- `@estehsaan/backstage-plugin-onboarding-backend` (config, migration, routes)
- `@estehsaan/backstage-plugin-onboarding` (frontend UI/UX changes, bug fix)
