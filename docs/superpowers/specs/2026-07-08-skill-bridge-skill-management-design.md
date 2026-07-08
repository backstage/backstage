# Skill Bridge — Skill Management & User Profiles Design

**Date**: 2026-07-08  
**Status**: Approved  
**Repo**: `backstage-plugin-skill-bridge` submodule

---

## Overview

Users currently pick their skills from a hardcoded platform catalog. This design adds:

1. **Create & edit skills** — any user can add new skills to the shared catalog or update existing ones, directly inside the existing `EditSkillsDialog` via an inline form.
2. **User profile page** — a dedicated `/skill-bridge/users/:userRef` page showing a user's full skill profile. Viewing your own profile reveals edit controls; viewing another user's shows a read-only layout.
3. **Home page navigation** — `UserCard` tiles in `SkillBridgeHomePage` become clickable links to individual profile pages, plus a "My Profile" shortcut for the logged-in user.

---

## 1. Data Model

### `Skill` type (`skill-bridge-common`)

Add an optional `description` field:

```ts
export interface Skill {
  id: string; // slug, e.g. 'spring-boot'
  name: string;
  category: SkillCategory;
  description?: string; // ← new, nullable
}
```

No breaking change — `description` is optional and all existing consumers continue to work.

### New request types

```ts
export interface CreateSkillRequest {
  name: string;
  category: SkillCategory;
  description?: string;
}

export interface UpdateSkillRequest {
  name?: string;
  category?: SkillCategory;
  description?: string;
}
```

---

## 2. Database

**Migration**: add `description TEXT NULL` column to the `skills` table. The existing seed rows remain valid (description stays null until explicitly set).

```sql
ALTER TABLE skills ADD COLUMN description TEXT;
```

---

## 3. Backend API

Both endpoints require `skillBridgeWritePermission`. No per-row ownership — it is a shared catalog.

| Method  | Path          | Body                 | Response      |
| ------- | ------------- | -------------------- | ------------- |
| `POST`  | `/skills`     | `CreateSkillRequest` | `Skill` (201) |
| `PATCH` | `/skills/:id` | `UpdateSkillRequest` | `Skill` (200) |

**`POST /skills`** behavior:

- Slugify `name` to derive `id` (same logic as the seed: lowercase, `++` → `pp`, `/` → `-`, spaces → `-`).
- If a skill with the same `id` already exists → return `409 Conflict`.

**`PATCH /skills/:id`** behavior:

- If skill not found → `404 NotFoundError`.
- Applies partial updates; name change **does not** change the `id` (id is immutable once created).

### Store methods (`DatabaseSkillBridgeStore`)

```ts
createSkill(req: CreateSkillRequest): Promise<Skill>
updateSkill(id: string, updates: UpdateSkillRequest): Promise<Skill | undefined>
```

---

## 4. API Client (`skill-bridge-react`)

New methods on `SkillBridgeApi` interface and `SkillBridgeClient`:

```ts
createSkill(req: CreateSkillRequest): Promise<Skill>;
updateSkill(id: string, updates: UpdateSkillRequest): Promise<Skill>;
```

`SkillBridgeClient` implements both as `POST /skills` and `PATCH /skills/:id` fetches using the existing `request<T>` helper.

---

## 5. Frontend — Inline Skill Create/Edit in `EditSkillsDialog`

### State

```ts
type SkillFormState =
  | { mode: 'idle' }
  | { mode: 'create'; column: 'can_help' | 'learning'; prefill: string }
  | { mode: 'edit'; skillId: string; column: 'can_help' | 'learning' };
```

`skillFormState` sits alongside the existing `canHelpSkills`/`learningSkills` state.

### Create flow

1. User types in a `SearchAutocomplete`; no skill has an exact name match.
2. A `+ Create "[query]"` item is appended to the dropdown options.
3. Selecting it sets `skillFormState = { mode: 'create', column, prefill: query }`.
4. The `SearchAutocomplete` for that column is replaced by an inline `SkillForm` component (see below).
5. On save → `onCreateSkill(name, description, category)` → parent calls `api.createSkill()` → refreshes `allSkills` → newly created skill is auto-added to the column's tag list → state returns to `idle`.
6. Cancel → state returns to `idle`, search query cleared.

### Edit flow

1. Each selected `Tag` chip renders an `RiEditLine` icon button alongside it.
2. Clicking sets `skillFormState = { mode: 'edit', skillId, column }`.
3. The autocomplete for that column is replaced by `SkillForm` pre-filled with the skill's current data.
4. On save → `onUpdateSkill(id, updates)` → parent calls `api.updateSkill()` → refreshes `allSkills` → state returns to `idle`.

Only one column's form is open at a time. Opening a form in one column closes any open form in the other.

### `SkillForm` component

A new internal component (`SkillForm.tsx` inside `skill-bridge-react`):

```
┌─────────────────────────────────┐
│ Name      [TextField]           │
│ Description [TextField multi]   │
│ Category  [read-only badge]     │
│              [Save] [Cancel]    │
└─────────────────────────────────┘
```

Props: `{ prefill: Partial<Skill>; category: SkillCategory; onSave(data): void; onCancel(): void }`

### New props on `EditSkillsDialog`

```ts
onCreateSkill?: (req: CreateSkillRequest) => Promise<Skill>;
onUpdateSkill?: (id: string, updates: UpdateSkillRequest) => Promise<Skill>;
```

Both are optional; if absent, the "+ Create" item and edit icons are not rendered (backwards compatible).

---

## 6. Frontend — `SkillBridgeUserProfilePage`

New component in `skill-bridge-react`. Lives at `/skill-bridge/users/:userRef`.

### Behaviour

- Reads `userRef` from URL via `useRouteRefParams(userProfileRouteRef)`.
- Fetches `api.getUserSkills(userRef)` and `api.listSkills()`.
- Fetches logged-in identity via `identityApiRef` → `identity.getBackstageIdentity()` → `userEntityRef`.
- If `currentUserRef === profileUserRef`:
  - Shows "Edit Skills" button → opens `EditSkillsDialog` with full create/edit callbacks.
  - After save, re-fetches `getUserSkills` and `listSkills`.
- If viewing another user:
  - Read-only layout; no edit button, no dialog.

### Layout

```
Page
├── Header: [Avatar] [Display Name] [Team(s)] [Email]
│                                     [Edit Skills] ← own profile only
├── Section: "I can help with"
│   └── Skills grouped by category (SkillChip tags)
└── Section: "I am learning"
    └── Skills grouped by category (SkillChip tags)
```

Display name and avatar are fetched via `useApi(catalogApiRef).getEntityByRef(userRef)` directly in the component (catalog is already available as a frontend API). The fetch is best-effort; if the entity is not found, the raw `userRef` string is used as the display name and the avatar is omitted.

---

## 7. Routing

### New route ref (`routes.ts`)

```ts
export const userProfileRouteRef = createSubRouteRef({
  id: 'skill-bridge:user-profile',
  parent: rootRouteRef,
  path: '/users/:userRef',
});
```

### Plugin wiring (`plugin.tsx`)

**NFS:**

```ts
PageBlueprint.make({
  name: 'user-profile',
  params: {
    path: '/skill-bridge/users/:userRef',
    routeRef: userProfileRouteRef,
    loader: () =>
      import('...react').then(m => <m.SkillBridgeUserProfilePage />),
  },
});
```

`userProfileRouteRef` added to the plugin's `routes` map.

**Legacy:**

```ts
legacySkillBridgePlugin.provide(
  createRoutableExtension({
    name: 'SkillBridgeUserProfilePage',
    component: () => import('...react').then(m => m.SkillBridgeUserProfilePage),
    mountPoint: userProfileRouteRef,
  }),
);
```

---

## 8. Home Page Updates (`SkillBridgeHomePage`)

1. `useRouteRef(userProfileRouteRef)` → generates profile URLs.
2. Each `UserCard` receives `onClick={() => navigate(userProfileRoute({ userRef }))}`.
3. A **"My Profile"** `Button` or `Link` in the page header navigates the logged-in user to their own profile page.

---

## 9. Catalog Entity Tab

`SkillBridgeProfileCard` (shown on user entity pages) is unchanged for now. It already provides the edit experience for users navigating via the Backstage catalog. A future iteration could unify this with the standalone profile page.

---

## 10. Persistence

All changes are persisted to the Backstage backend database via Knex. No local storage or session cache is used. After any create/update operation, the frontend re-fetches `listSkills()` and `getUserSkills()` to ensure the UI reflects the server state.

---

## 11. Error Handling

| Scenario                              | Handling                                                  |
| ------------------------------------- | --------------------------------------------------------- |
| Skill name already exists (409)       | Inline error message below the Name field in `SkillForm`  |
| Network/server error on create/update | Toast or inline error; form stays open                    |
| Profile user not found in catalog     | Graceful fallback: show `userRef` as name, empty avatar   |
| Unauthorized (403)                    | Error page / redirect (standard Backstage error boundary) |

---

## 12. Files Changed

| Package                | File                                           | Change                                                                        |
| ---------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| `skill-bridge-common`  | `types.ts`                                     | Add `description?` to `Skill`; add `CreateSkillRequest`, `UpdateSkillRequest` |
| `skill-bridge-backend` | `migrations/YYYYMMDD_add_skill_description.js` | Add `description` column                                                      |
| `skill-bridge-backend` | `DatabaseSkillBridgeStore.ts`                  | `createSkill`, `updateSkill` methods                                          |
| `skill-bridge-backend` | `router.ts`                                    | `POST /skills`, `PATCH /skills/:id` routes                                    |
| `skill-bridge-react`   | `api/types.ts`                                 | Add `createSkill`, `updateSkill` to `SkillBridgeApi`                          |
| `skill-bridge-react`   | `api/SkillBridgeClient.ts`                     | Implement new methods                                                         |
| `skill-bridge-react`   | `components/SkillForm.tsx`                     | New inline create/edit form component                                         |
| `skill-bridge-react`   | `components/EditSkillsDialog.tsx`              | `skillFormState`, `+ Create` item, edit icons on chips                        |
| `skill-bridge-react`   | `components/SkillBridgeUserProfilePage.tsx`    | New standalone profile page                                                   |
| `skill-bridge-react`   | `components/SkillBridgeHomePage.tsx`           | Add profile link on UserCards + My Profile button                             |
| `skill-bridge-react`   | `components/index.ts`                          | Export `SkillBridgeUserProfilePage`                                           |
| `skill-bridge`         | `routes.ts`                                    | Add `userProfileRouteRef`                                                     |
| `skill-bridge`         | `plugin.tsx`                                   | Add NFS `PageBlueprint` + legacy extension for profile page                   |
