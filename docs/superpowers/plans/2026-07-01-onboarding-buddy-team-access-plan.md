# Onboarding Buddy & Team Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restrict onboarding template assignment and Team View access to members of a configured catalog group ("assigner group"), add manual buddy assignment to onboarding progress records, expose a scoped "My Buddies" view for non-lead buddies, and redesign the Templates page cards.

**Architecture:** Backend adds a new `authz.ts` helper module (catalog-group-membership checks layered on top of existing permission framework), a `buddy_user_id` column + migration, new `OnboardingStore` methods, and four new/modified Express routes in `router.ts`. Frontend adds new `OnboardingApi` client methods, a buddy picker in the assign dialog, tab-visibility logic in `OnboardingPage.tsx`, a lead/buddy dual-mode `TeamView.tsx`, and a Templates card redesign.

**Tech Stack:** TypeScript, Express, Knex (SQLite/Postgres via `@backstage/backend-defaults`), `@backstage/catalog-client`, `@backstage/plugin-permission-node`/`-react`, Jest + supertest (backend), React Testing Library (frontend), CSS Modules.

---

## Task 1: Config schema — `assignerGroups`

**Files:**

- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-backend/config.d.ts`

- [ ] **Step 1: Add the config field**

Find the existing `defaults` block (which already has `activeJoinerWindowDays` and `buddy.autoAssign`) and add a sibling field:

```typescript
      /**
       * Catalog group refs (or bare names, assumed group:default/<name>) whose
       * members are allowed to assign onboarding templates and see full team
       * rosters in Team View. Leave unset/empty to disable the restriction
       * (backward compatible - everyone with the base permission can assign).
       * @visibility backend
       */
      assignerGroups?: string[];
```

Place it directly after the `buddy` block inside `defaults`.

- [ ] **Step 2: Verify types compile**

Run: `yarn tsc` (from repo root of the submodule: `plugins/backstage-plugin-onboarding`)
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
cd plugins/backstage-plugin-onboarding
git add workspaces/onboarding/plugins/onboarding-backend/config.d.ts
git commit -s -m "feat(onboarding-backend): add assignerGroups config schema"
```

---

## Task 2: Common types — `buddyUserId` + `TeamJoinerSummary`

**Files:**

- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-common/src/types.ts`

- [ ] **Step 1: Add `buddyUserId` to `OnboardingProgress`**

Find the `OnboardingProgress` interface and add the field:

```typescript
export interface OnboardingProgress {
  userId: string;
  templateName: string;
  startDate: string;
  tasks: TaskProgress[];
  // ... existing fields unchanged above/below ...
  buddyUserId?: string;
}
```

(Add `buddyUserId?: string;` as the last field in the existing interface, keeping all current fields untouched.)

- [ ] **Step 2: Add `TeamJoinerSummary` and update `TeamOnboardingStats`**

Find `TeamOnboardingStats` (which currently has an inline anonymous array type for its joiners). Add a new named interface above it and reuse it:

```typescript
export interface TeamJoinerSummary {
  userId: string;
  displayName: string;
  role: string;
  startDate: string;
  completionPercent: number;
  blockedTaskCount: number;
  buddyUserId?: string;
  buddyDisplayName?: string;
}

export interface TeamOnboardingStats {
  teamName: string;
  totalJoiners: number;
  activeJoiners: TeamJoinerSummary[];
  // ... keep any other existing fields on TeamOnboardingStats unchanged ...
}
```

Replace the previous inline array element type on `activeJoiners` with `TeamJoinerSummary[]`, keeping any other existing fields on `TeamOnboardingStats` (e.g. counts) as they are.

- [ ] **Step 3: Verify types compile**

Run: `yarn tsc`
Expected: errors will appear in `router.ts` / frontend files that construct `TeamOnboardingStats` objects without `buddyUserId`/`buddyDisplayName` — that's expected since `buddyUserId`/`buddyDisplayName` are optional; only genuinely broken usages (e.g. missing required fields) should show. If `role`/`displayName` etc. field names don't match the existing anonymous type exactly, adjust field names in this task to match what `router.ts` already produces (read the current anonymous type at the call site before finalizing) rather than requiring a rename in Task 7.

- [ ] **Step 4: Commit**

```bash
cd plugins/backstage-plugin-onboarding
git add workspaces/onboarding/plugins/onboarding-common/src/types.ts
git commit -s -m "feat(onboarding-common): add buddyUserId and TeamJoinerSummary types"
```

---

## Task 3: Backend row type — `buddy_user_id`

**Files:**

- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-backend/src/types.ts`

- [ ] **Step 1: Add the column field**

Find `OnboardingProgressRow` and add:

```typescript
export interface OnboardingProgressRow {
  user_id: string;
  template_name: string;
  start_date: string;
  tasks_json: string;
  // ... keep existing fields ...
  buddy_user_id: string | null;
}
```

- [ ] **Step 2: Verify types compile**

Run: `yarn tsc`
Expected: errors in `OnboardingStore.ts`'s `rowToProgress`/insert calls (expected, fixed in Task 5).

- [ ] **Step 3: Commit**

```bash
cd plugins/backstage-plugin-onboarding
git add workspaces/onboarding/plugins/onboarding-backend/src/types.ts
git commit -s -m "feat(onboarding-backend): add buddy_user_id to OnboardingProgressRow"
```

---

## Task 4: DB migration — `buddy_user_id` column

**Files:**

- Create: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-backend/migrations/20260701000000_add_buddy_user_id.js`

- [ ] **Step 1: Write the migration**

Match the exact style of `20260402_add_user_id_unique.js` (read it first for the header comment style used in this package). Create:

```javascript
/**
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('onboarding_progress', table => {
    table.string('buddy_user_id').nullable();
    table.index('buddy_user_id');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('onboarding_progress', table => {
    table.dropIndex('buddy_user_id');
    table.dropColumn('buddy_user_id');
  });
};
```

Note: verify the actual table name used in `20260318_init.js` (it should be `onboarding_progress` — confirm exact name before finalizing and adjust if different).

- [ ] **Step 2: Commit**

```bash
cd plugins/backstage-plugin-onboarding
git add workspaces/onboarding/plugins/onboarding-backend/migrations/20260701000000_add_buddy_user_id.js
git commit -s -m "feat(onboarding-backend): add buddy_user_id migration"
```

---

## Task 5: `OnboardingStore` — buddy methods + tests

**Files:**

- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-backend/src/service/OnboardingStore.ts`
- Create: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-backend/src/service/OnboardingStore.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { DatabaseOnboardingStore } from './OnboardingStore';

describe('DatabaseOnboardingStore buddy support', () => {
  const databases = TestDatabases.create({
    ids: ['SQLITE_3'],
    disableDocker: true,
  });

  it.each(databases.eachSupportedId())(
    'sets and retrieves a buddy for a user, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      const store = await DatabaseOnboardingStore.create({
        database: mockServices.database.mock({ getClient: async () => knex }),
      });

      await store.upsertProgress({
        userId: 'user:default/joiner',
        templateName: 'engineer-onboarding',
        startDate: '2026-07-01',
        tasks: [],
      } as any);

      const updated = await store.setBuddy(
        'user:default/joiner',
        'user:default/buddy',
      );
      expect(updated).toBe(true);

      const progress = await store.getProgress('user:default/joiner');
      expect(progress?.buddyUserId).toBe('user:default/buddy');

      const buddyProgress = await store.getBuddyProgress('user:default/buddy');
      expect(buddyProgress).toHaveLength(1);
      expect(buddyProgress[0].userId).toBe('user:default/joiner');

      const clearedUpdated = await store.setBuddy(
        'user:default/joiner',
        undefined,
      );
      expect(clearedUpdated).toBe(true);
      const clearedProgress = await store.getProgress('user:default/joiner');
      expect(clearedProgress?.buddyUserId).toBeUndefined();
    },
  );

  it.each(databases.eachSupportedId())(
    'setBuddy returns false for an unknown user, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      const store = await DatabaseOnboardingStore.create({
        database: mockServices.database.mock({ getClient: async () => knex }),
      });

      const updated = await store.setBuddy(
        'user:default/unknown',
        'user:default/buddy',
      );
      expect(updated).toBe(false);
    },
  );
});
```

Note: `mockServices.database.mock({ getClient: async () => knex })` must match the exact `DatabaseService` mock shape this package's other tests use for wrapping a raw Knex instance — check `router.test.ts`'s imports and, if the package version of `@backstage/backend-test-utils` exposes a different helper name (e.g. `mockServices.database({ knex })` as a factory instead of `.mock`), use that form instead. Confirm by running `grep -rn "mockServices.database" plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-backend/src` before finalizing this step.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding-backend/src/service/OnboardingStore.test.ts`
Expected: FAIL — `store.setBuddy is not a function`.

- [ ] **Step 3: Implement `setBuddy` and `getBuddyProgress`**

In `OnboardingStore.ts`, add to the `DatabaseOnboardingStore` class (adjacent to existing methods like `getProgress`/`upsertProgress`):

```typescript
  async setBuddy(
    userId: string,
    buddyUserId: string | undefined,
  ): Promise<boolean> {
    const updated = await this.db<OnboardingProgressRow>('onboarding_progress')
      .where({ user_id: userId })
      .update({ buddy_user_id: buddyUserId ?? null });
    return updated > 0;
  }

  async getBuddyProgress(buddyUserId: string): Promise<OnboardingProgress[]> {
    const rows = await this.db<OnboardingProgressRow>('onboarding_progress')
      .where({ buddy_user_id: buddyUserId })
      .select();
    return rows.map(row => this.rowToProgress(row));
  }
```

Adjust table name (`onboarding_progress`) and the private db handle name (`this.db`) to match what's actually used elsewhere in this file — read the surrounding code for the exact property/table names before inserting.

Then update `rowToProgress` to map the new column:

```typescript
  private rowToProgress(row: OnboardingProgressRow): OnboardingProgress {
    return {
      userId: row.user_id,
      templateName: row.template_name,
      startDate: row.start_date,
      tasks: JSON.parse(row.tasks_json),
      // ...keep all existing mapped fields...
      buddyUserId: row.buddy_user_id ?? undefined,
    };
  }
```

Finally, confirm `upsertProgress`'s `.merge()` column list explicitly excludes `buddy_user_id` (the same way it already excludes `start_date`) so that repeated task-status upserts never overwrite a previously set buddy. If `.merge()` is called without an explicit column list (merges all columns), change it to pass an explicit list excluding `start_date` and `buddy_user_id`, matching the existing exclusion pattern for `start_date`.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding-backend/src/service/OnboardingStore.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
cd plugins/backstage-plugin-onboarding
git add workspaces/onboarding/plugins/onboarding-backend/src/service/OnboardingStore.ts workspaces/onboarding/plugins/onboarding-backend/src/service/OnboardingStore.test.ts
git commit -s -m "feat(onboarding-backend): add setBuddy/getBuddyProgress to OnboardingStore"
```

---

## Task 6: Backend authz helpers — `authz.ts`

**Files:**

- Create: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-backend/src/service/authz.ts`
- Create: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-backend/src/service/authz.test.ts`
- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-backend/src/service/router.ts:93-151` (extraction only in this task — full route wiring happens in Task 7)

- [ ] **Step 1: Write the failing tests**

```typescript
/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ConfigReader } from '@backstage/config';
import {
  getAssignerGroupRefs,
  isMemberOfAssignerGroup,
  isSameUser,
} from './authz';

describe('authz', () => {
  describe('isSameUser', () => {
    it('matches identical refs', () => {
      expect(isSameUser('user:default/jane', 'user:default/jane')).toBe(true);
    });

    it('matches case-insensitively', () => {
      expect(isSameUser('user:default/Jane', 'user:default/jane')).toBe(true);
    });

    it('does not match different users', () => {
      expect(isSameUser('user:default/jane', 'user:default/john')).toBe(false);
    });
  });

  describe('getAssignerGroupRefs', () => {
    it('returns an empty set when unset', () => {
      const config = new ConfigReader({});
      expect(getAssignerGroupRefs(config).size).toBe(0);
    });

    it('normalizes bare group names to group:default/<name> refs', () => {
      const config = new ConfigReader({
        onboarding: { defaults: { assignerGroups: ['platform-team'] } },
      });
      const refs = getAssignerGroupRefs(config);
      expect(refs.has('group:default/platform-team')).toBe(true);
    });

    it('passes through fully qualified refs unchanged', () => {
      const config = new ConfigReader({
        onboarding: {
          defaults: { assignerGroups: ['group:custom/platform-team'] },
        },
      });
      const refs = getAssignerGroupRefs(config);
      expect(refs.has('group:custom/platform-team')).toBe(true);
    });
  });

  describe('isMemberOfAssignerGroup', () => {
    it('returns true when assignerGroups is unset (backward compatible)', async () => {
      const config = new ConfigReader({});
      const catalogApi = {
        getEntityByRef: jest.fn().mockResolvedValue({
          relations: [],
        }),
      } as any;
      const result = await isMemberOfAssignerGroup(
        catalogApi,
        'user:default/jane',
        config,
      );
      expect(result).toBe(true);
    });

    it('returns true when caller is a member of a configured group', async () => {
      const config = new ConfigReader({
        onboarding: { defaults: { assignerGroups: ['platform-team'] } },
      });
      const catalogApi = {
        getEntityByRef: jest.fn().mockResolvedValue({
          relations: [
            {
              type: 'memberOf',
              targetRef: 'group:default/platform-team',
            },
          ],
        }),
      } as any;
      const result = await isMemberOfAssignerGroup(
        catalogApi,
        'user:default/jane',
        config,
      );
      expect(result).toBe(true);
    });

    it('returns false when caller is not a member of any configured group', async () => {
      const config = new ConfigReader({
        onboarding: { defaults: { assignerGroups: ['platform-team'] } },
      });
      const catalogApi = {
        getEntityByRef: jest.fn().mockResolvedValue({
          relations: [
            { type: 'memberOf', targetRef: 'group:default/other-team' },
          ],
        }),
      } as any;
      const result = await isMemberOfAssignerGroup(
        catalogApi,
        'user:default/jane',
        config,
      );
      expect(result).toBe(false);
    });

    it('returns false when the caller entity is not found', async () => {
      const config = new ConfigReader({
        onboarding: { defaults: { assignerGroups: ['platform-team'] } },
      });
      const catalogApi = {
        getEntityByRef: jest.fn().mockResolvedValue(undefined),
      } as any;
      const result = await isMemberOfAssignerGroup(
        catalogApi,
        'user:default/jane',
        config,
      );
      expect(result).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding-backend/src/service/authz.test.ts`
Expected: FAIL — cannot find module `./authz`.

- [ ] **Step 3: Extract and implement `authz.ts`**

First, open `router.ts` and locate the current `isSameUser` and `assertUserAccess` functions (around lines 93-151). Copy them verbatim into the new file, then add the new helpers:

```typescript
/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CatalogApi } from '@backstage/catalog-client';
import { RELATION_MEMBER_OF, parseEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { NotAllowedError } from '@backstage/errors';

// --- Verbatim extraction from router.ts (do not change behavior) ---
// Paste the existing `isSameUser` function body from router.ts here unchanged.
export function isSameUser(refA: string, refB: string): boolean {
  const normalize = (ref: string) => ref.trim().toLowerCase();
  if (normalize(refA) === normalize(refB)) {
    return true;
  }
  const shortName = (ref: string) => normalize(ref).split('/').pop() ?? '';
  return shortName(refA) === shortName(refB);
}

// Paste the existing `assertUserAccess` function body from router.ts here,
// then extend it with the optional `getBuddyUserId` fallback described below.
export async function assertUserAccess(options: {
  callerRef: string;
  targetUserId: string;
  hasElevatedAccess: () => Promise<boolean>;
  getBuddyUserId?: () => Promise<string | undefined>;
}): Promise<void> {
  const { callerRef, targetUserId, hasElevatedAccess, getBuddyUserId } =
    options;

  if (isSameUser(callerRef, targetUserId)) {
    return;
  }

  if (await hasElevatedAccess()) {
    return;
  }

  if (getBuddyUserId) {
    const buddyUserId = await getBuddyUserId();
    if (buddyUserId && isSameUser(callerRef, buddyUserId)) {
      return;
    }
  }

  throw new NotAllowedError('Not authorized to access this resource');
}
// --- End verbatim extraction ---

export function getAssignerGroupRefs(config: Config): Set<string> {
  const names = config.getOptionalStringArray(
    'onboarding.defaults.assignerGroups',
  );
  if (!names || names.length === 0) {
    return new Set();
  }
  return new Set(
    names.map(name => (name.includes(':') ? name : `group:default/${name}`)),
  );
}

export async function getCallerGroupRefs(
  catalogApi: CatalogApi,
  callerRef: string,
): Promise<Set<string>> {
  const entity = await catalogApi.getEntityByRef(callerRef);
  if (!entity?.relations) {
    return new Set();
  }
  return new Set(
    entity.relations
      .filter(relation => relation.type === RELATION_MEMBER_OF)
      .map(relation => relation.targetRef),
  );
}

export async function isMemberOfAssignerGroup(
  catalogApi: CatalogApi,
  callerRef: string,
  config: Config,
): Promise<boolean> {
  const assignerGroups = getAssignerGroupRefs(config);
  if (assignerGroups.size === 0) {
    return true;
  }
  const callerGroups = await getCallerGroupRefs(catalogApi, callerRef);
  for (const group of callerGroups) {
    if (assignerGroups.has(group)) {
      return true;
    }
  }
  return false;
}
```

Important: when copying `isSameUser`/`assertUserAccess` verbatim from `router.ts`, replace the placeholder bodies shown above with the ACTUAL current implementation from `router.ts:93-151` — do not assume the placeholder logic above is correct; it is illustrative only and must be reconciled against the real code (in particular, check whether the existing `NotAllowedError` import path and thrown message text already exist and match exactly, since `router.test.ts` may assert on the exact error message).

Also confirm `parseEntityRef` is actually used (remove the import if unused after reconciling with real code) and that `RELATION_MEMBER_OF` is the correct exported constant name in the installed `@backstage/catalog-model` version (`grep -rn "RELATION_MEMBER_OF" node_modules/@backstage/catalog-model/dist/index.d.ts` from the submodule root to confirm).

- [ ] **Step 4: Remove the now-duplicated functions from `router.ts` and import from `authz.ts`**

In `router.ts`, delete the original `isSameUser`/`assertUserAccess` function bodies (lines ~93-151) and add:

```typescript
import {
  assertUserAccess,
  getAssignerGroupRefs,
  getCallerGroupRefs,
  isMemberOfAssignerGroup,
  isSameUser,
} from './authz';
```

Do not change any call sites yet — this task only relocates the functions with identical behavior. Route-level wiring of the new group checks happens in Task 7.

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding-backend/src/service/authz.test.ts workspaces/onboarding/plugins/onboarding-backend/src/service/router.test.ts`
Expected: PASS — `authz.test.ts` (12 tests) and all pre-existing `router.test.ts` tests unchanged (extraction must be behavior-preserving).

- [ ] **Step 6: Commit**

```bash
cd plugins/backstage-plugin-onboarding
git add workspaces/onboarding/plugins/onboarding-backend/src/service/authz.ts workspaces/onboarding/plugins/onboarding-backend/src/service/authz.test.ts workspaces/onboarding/plugins/onboarding-backend/src/service/router.ts
git commit -s -m "refactor(onboarding-backend): extract authz helpers into authz.ts"
```

---

## Task 7: Backend routes — buddy, teams/mine, assigner/me, buddies/mine, tightened team stats

**Files:**

- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-backend/src/service/router.ts`
- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding-backend/src/service/router.test.ts`

- [ ] **Step 1: Add `getEntitiesByRefs` to the test mock catalog API and `setBuddy`/`getBuddyProgress` to the mock store**

In `router.test.ts`, find `mockCatalogApi` and add:

```typescript
    getEntitiesByRefs: jest.fn().mockResolvedValue({ items: [] }),
```

Find `mockStore` (typed `jest.Mocked<DatabaseOnboardingStore>`) and add:

```typescript
    setBuddy: jest.fn().mockResolvedValue(true),
    getBuddyProgress: jest.fn().mockResolvedValue([]),
```

- [ ] **Step 2: Write failing tests for the new routes**

Add to `router.test.ts` (adjust `createApp`/`mockCredentials` usage to match the exact existing helper signatures already in the file):

```typescript
describe('POST /progress/:userId/buddy', () => {
  it('sets the buddy for a user when caller has assign permission', async () => {
    mockPermissions.authorize.mockResolvedValueOnce([
      { result: AuthorizeResult.ALLOW },
    ]);
    const app = createApp('user:default/lead');

    const response = await request(app)
      .post('/progress/user:default/joiner/buddy')
      .send({ buddyUserId: 'user:default/buddy' });

    expect(response.status).toBe(200);
    expect(mockStore.setBuddy).toHaveBeenCalledWith(
      'user:default/joiner',
      'user:default/buddy',
    );
  });

  it('rejects when caller lacks assign permission', async () => {
    mockPermissions.authorize.mockResolvedValueOnce([
      { result: AuthorizeResult.DENY },
    ]);
    const app = createApp('user:default/rando');

    const response = await request(app)
      .post('/progress/user:default/joiner/buddy')
      .send({ buddyUserId: 'user:default/buddy' });

    expect(response.status).toBe(403);
  });
});

describe('GET /teams/mine', () => {
  it('returns matching assigner groups the caller belongs to', async () => {
    mockCatalogApi.getEntityByRef.mockResolvedValueOnce({
      relations: [
        { type: 'memberOf', targetRef: 'group:default/platform-team' },
      ],
    } as any);
    const app = createApp('user:default/lead', {
      onboarding: {
        defaults: { assignerGroups: ['platform-team'] },
      },
    });

    const response = await request(app).get('/teams/mine');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ teams: ['platform-team'] });
  });

  it('returns an empty list when assignerGroups is unset', async () => {
    const app = createApp('user:default/lead');
    const response = await request(app).get('/teams/mine');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ teams: [] });
  });
});

describe('GET /assigner/me', () => {
  it('returns isAssigner true when permission allows and group matches', async () => {
    mockPermissions.authorize.mockResolvedValueOnce([
      { result: AuthorizeResult.ALLOW },
    ]);
    mockCatalogApi.getEntityByRef.mockResolvedValueOnce({
      relations: [
        { type: 'memberOf', targetRef: 'group:default/platform-team' },
      ],
    } as any);
    const app = createApp('user:default/lead', {
      onboarding: {
        defaults: { assignerGroups: ['platform-team'] },
      },
    });

    const response = await request(app).get('/assigner/me');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ isAssigner: true });
  });

  it('returns isAssigner false when permission denies', async () => {
    mockPermissions.authorize.mockResolvedValueOnce([
      { result: AuthorizeResult.DENY },
    ]);
    const app = createApp('user:default/rando');

    const response = await request(app).get('/assigner/me');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ isAssigner: false });
  });
});

describe('GET /buddies/mine', () => {
  it('returns joiner summaries for the caller as buddy', async () => {
    mockStore.getBuddyProgress.mockResolvedValueOnce([
      {
        userId: 'user:default/joiner',
        templateName: 'engineer-onboarding',
        startDate: '2026-07-01',
        tasks: [],
        buddyUserId: 'user:default/buddy',
      } as any,
    ]);
    mockCatalogApi.getEntitiesByRefs.mockResolvedValueOnce({
      items: [
        {
          metadata: { name: 'joiner' },
          spec: { profile: { displayName: 'Joiner Name' } },
        },
      ],
    } as any);
    const app = createApp('user:default/buddy');

    const response = await request(app).get('/buddies/mine');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].userId).toBe('user:default/joiner');
  });
});
```

Note: the exact shape of `createApp` (whether it accepts a second `config` override argument) must be checked against the real helper in the file before finalizing these tests — if `createApp` doesn't currently accept a config override, add that capability to `createApp` itself as part of this task (it likely already builds a `ConfigReader` inline per the earlier research, so add an optional parameter that merges into that inline config object).

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding-backend/src/service/router.test.ts`
Expected: FAIL — 404s for the new routes.

- [ ] **Step 4: Implement the new routes in `router.ts`**

Add near the other route registrations (after existing `/progress/:userId` routes):

```typescript
  router.post('/progress/:userId/buddy', async (req, res) => {
    const callerRef = await httpAuth.credentials(req).then(/* existing pattern for extracting callerRef, reuse whatever helper the file already uses */);
    const { userId } = req.params;
    const { buddyUserId } = req.body as { buddyUserId?: string | null };

    const decision = (
      await permissions.authorize(
        [{ permission: onboardingTemplateAssignPermission }],
        { credentials: await httpAuth.credentials(req) },
      )
    )[0];

    if (decision.result !== AuthorizeResult.ALLOW) {
      throw new NotAllowedError('Not authorized to assign a buddy');
    }

    const updated = await store.setBuddy(userId, buddyUserId ?? undefined);
    if (!updated) {
      throw new NotFoundError(`No onboarding progress found for ${userId}`);
    }
    res.status(200).json({ userId, buddyUserId: buddyUserId ?? undefined });
  });

  router.get('/teams/mine', async (req, res) => {
    const callerRef = /* extract via existing pattern */;
    const assignerGroups = getAssignerGroupRefs(config);
    if (assignerGroups.size === 0) {
      res.status(200).json({ teams: [] });
      return;
    }
    const callerGroups = await getCallerGroupRefs(catalogApi, callerRef);
    const teams = [...callerGroups]
      .filter(group => assignerGroups.has(group))
      .map(group => parseEntityRef(group).name)
      .sort();
    res.status(200).json({ teams });
  });

  router.get('/assigner/me', async (req, res) => {
    const callerRef = /* extract via existing pattern */;
    const decision = (
      await permissions.authorize(
        [{ permission: onboardingTemplateAssignPermission }],
        { credentials: await httpAuth.credentials(req) },
      )
    )[0];
    const hasPermission = decision.result === AuthorizeResult.ALLOW;
    const isGroupMember = hasPermission
      ? await isMemberOfAssignerGroup(catalogApi, callerRef, config)
      : false;
    res.status(200).json({ isAssigner: hasPermission && isGroupMember });
  });

  router.get('/buddies/mine', async (req, res) => {
    const callerRef = /* extract via existing pattern */;
    const progressList = await store.getBuddyProgress(callerRef);
    const displayNames = await getDisplayNamesByRef(
      catalogApi,
      progressList.map(p => p.userId),
    );
    res.status(200).json(toJoinerSummaries(progressList, displayNames));
  });
```

Then implement the two new shared helpers (place near the other route-adjacent helper functions like `getEntityDisplayName`):

```typescript
async function getDisplayNamesByRef(
  catalogApi: CatalogApi,
  refs: string[],
): Promise<Map<string, string>> {
  if (refs.length === 0) {
    return new Map();
  }
  const { items } = await catalogApi.getEntitiesByRefs({
    entityRefs: refs,
    fields: ['metadata.name', 'spec.profile.displayName'],
  });
  const result = new Map<string, string>();
  refs.forEach((ref, index) => {
    const entity = items[index];
    const displayName =
      (entity?.spec as { profile?: { displayName?: string } } | undefined)
        ?.profile?.displayName ??
      entity?.metadata.name ??
      ref;
    result.set(ref, displayName);
  });
  return result;
}

function toJoinerSummaries(
  progressList: OnboardingProgress[],
  displayNames: Map<string, string>,
): TeamJoinerSummary[] {
  return progressList.map(progress => {
    const completed = progress.tasks.filter(
      task => task.status === 'completed',
    ).length;
    const blocked = progress.tasks.filter(
      task => task.status === 'blocked',
    ).length;
    return {
      userId: progress.userId,
      displayName: displayNames.get(progress.userId) ?? progress.userId,
      role: progress.templateName,
      startDate: progress.startDate,
      completionPercent:
        progress.tasks.length === 0
          ? 0
          : Math.round((completed / progress.tasks.length) * 100),
      blockedTaskCount: blocked,
      buddyUserId: progress.buddyUserId,
      buddyDisplayName: progress.buddyUserId
        ? displayNames.get(progress.buddyUserId)
        : undefined,
    };
  });
}
```

IMPORTANT: the placeholder `role`/`completionPercent`/`blockedTaskCount` computation logic above is illustrative — before finalizing, find and reuse the EXACT existing joiner-mapping logic currently inline inside the `/team/:teamName/stats` handler (it already computes equivalent fields) and refactor it into `toJoinerSummaries` rather than reimplementing from scratch, to guarantee identical output for that route (see Step 5 below). Also replace every `/* extract via existing pattern */` placeholder above with the actual caller-ref-extraction code already used by other routes in this file (e.g. however `httpAuth.credentials(req)` is turned into a user entity ref elsewhere in `router.ts` — copy that exact snippet).

- [ ] **Step 5: Refactor `/team/:teamName/stats` to use `toJoinerSummaries` and tighten group membership**

Locate the existing `/team/:teamName/stats` handler. Replace its inline joiner-mapping loop with a call to `toJoinerSummaries(progressList, displayNames)` (using `getDisplayNamesByRef` for the lookup instead of whatever one-off lookup it currently does), preserving the exact same permission check it already has, and add the new group-membership check:

```typescript
  router.get('/team/:teamName/stats', async (req, res) => {
    const callerRef = /* extract via existing pattern, same as before */;
    const { teamName } = req.params;

    // ...existing permission decision check stays exactly as-is...

    const callerGroups = await getCallerGroupRefs(catalogApi, callerRef);
    if (!callerGroups.has(`group:default/${teamName}`)) {
      throw new NotAllowedError(
        `Not a member of team ${teamName}`,
      );
    }

    // ...existing progress-fetching logic stays the same...
    const displayNames = await getDisplayNamesByRef(
      catalogApi,
      progressList.map(p => p.userId),
    );
    const activeJoiners = toJoinerSummaries(progressList, displayNames);

    res.status(200).json({
      teamName,
      totalJoiners: progressList.length,
      activeJoiners,
    });
  });
```

Update existing `router.test.ts` tests for `/team/:teamName/stats` that don't currently set up `mockCatalogApi.getEntityByRef` group membership — add `mockCatalogApi.getEntityByRef.mockResolvedValueOnce({ relations: [{ type: 'memberOf', targetRef: 'group:default/<teamName-used-in-that-test>' }] })` to each existing passing-case test, and add one new test asserting a 403/`NotAllowedError` when the caller is not a member of that group.

- [ ] **Step 6: Extend the assign route to accept `buddyUserId`**

Locate `POST /templates/:templateName/assign/:userId`. Extend its body destructuring:

```typescript
const { buddyUserId } = req.body as { buddyUserId?: string };
```

After the existing `initializeProgress`/`store.upsertProgress` call succeeds, add:

```typescript
if (buddyUserId) {
  await store.setBuddy(userId, buddyUserId);
}
```

Add a test in `router.test.ts` asserting that when `buddyUserId` is included in the request body, `mockStore.setBuddy` is called with the right arguments; and an existing-behavior test confirming that omitting it does not call `setBuddy`.

- [ ] **Step 7: Run all router tests to verify they pass**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding-backend/src/service/router.test.ts`
Expected: PASS — all existing tests plus new ones.

- [ ] **Step 8: Full backend package check**

Run: `cd plugins/backstage-plugin-onboarding && yarn tsc && yarn lint workspaces/onboarding/plugins/onboarding-backend`
Expected: no errors.

- [ ] **Step 9: Commit**

```bash
cd plugins/backstage-plugin-onboarding
git add workspaces/onboarding/plugins/onboarding-backend/src/service/router.ts workspaces/onboarding/plugins/onboarding-backend/src/service/router.test.ts
git commit -s -m "feat(onboarding-backend): add buddy, teams/mine, assigner/me, buddies/mine routes"
```

---

## Task 8: Frontend dependency — `@backstage/plugin-permission-react`

**Files:**

- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding/package.json`

- [ ] **Step 1: Add the dependency**

In the `dependencies` block, add (matching the pinned-version style of sibling deps like `"@backstage/core-components": "^0.18.7"`):

```json
    "@backstage/plugin-permission-react": "^0.5.0",
```

Check the installed version actually available/compatible by running `yarn info @backstage/plugin-permission-react versions` if uncertain, and use the latest version already used by other plugins in the main monorepo (search `plugins/**/package.json` for the version other Backstage plugins pin) rather than assuming `^0.5.0` is current.

- [ ] **Step 2: Install**

Run: `cd plugins/backstage-plugin-onboarding && yarn install --immutable`
Expected: succeeds (drop `--immutable` and re-run plain `yarn install` first if the lockfile needs updating, then re-run `--immutable` to confirm).

- [ ] **Step 3: Commit**

```bash
cd plugins/backstage-plugin-onboarding
git add workspaces/onboarding/plugins/onboarding/package.json yarn.lock
git commit -s -m "chore(onboarding): add plugin-permission-react dependency"
```

---

## Task 9: Frontend API client — buddy/teams/assigner methods

**Files:**

- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding/src/api/OnboardingApi.ts`
- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding/src/api/OnboardingClient.ts`
- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding/src/api/OnboardingClient.test.ts`

- [ ] **Step 1: Update the `OnboardingApi` interface**

In `OnboardingApi.ts`, add the following method signatures to the interface, and change `assignTemplate`'s signature:

```typescript
  assignTemplate(
    templateName: string,
    userId: string,
    buddyUserId?: string,
  ): Promise<OnboardingProgress>;

  setBuddy(userId: string, buddyUserId: string | undefined): Promise<void>;

  getMyTeams(): Promise<{ teams: string[] }>;

  getMyBuddies(): Promise<TeamJoinerSummary[]>;

  getIsAssigner(): Promise<{ isAssigner: boolean }>;
```

Add `TeamJoinerSummary` to the existing import from `@estehsaan/backstage-plugin-onboarding-common` at the top of the file.

- [ ] **Step 2: Write failing tests in `OnboardingClient.test.ts`**

Find the existing `assignTemplate` test block and update/add tests (match the file's existing `fetchApi`-mocking pattern exactly — read a passing test in the file first to copy its mock-setup style):

```typescript
describe('assignTemplate', () => {
  it('sends buddyUserId when provided', async () => {
    mockFetchApi.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ userId: 'user:default/joiner' }),
    } as Response);

    await client.assignTemplate(
      'engineer-onboarding',
      'user:default/joiner',
      'user:default/buddy',
    );

    const [, requestInit] = mockFetchApi.fetch.mock.calls[0];
    expect(JSON.parse(requestInit!.body as string)).toEqual({
      buddyUserId: 'user:default/buddy',
    });
  });
});

describe('setBuddy', () => {
  it('posts the buddy user id', async () => {
    mockFetchApi.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await client.setBuddy('user:default/joiner', 'user:default/buddy');

    expect(mockFetchApi.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/progress/user:default/joiner/buddy'),
      expect.objectContaining({ method: 'POST' }),
    );
  });
});

describe('getMyTeams', () => {
  it('fetches teams/mine', async () => {
    mockFetchApi.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ teams: ['platform-team'] }),
    } as Response);

    const result = await client.getMyTeams();

    expect(result).toEqual({ teams: ['platform-team'] });
    expect(mockFetchApi.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/teams/mine'),
      expect.anything(),
    );
  });
});

describe('getIsAssigner', () => {
  it('fetches assigner/me', async () => {
    mockFetchApi.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAssigner: true }),
    } as Response);

    const result = await client.getIsAssigner();

    expect(result).toEqual({ isAssigner: true });
  });
});

describe('getMyBuddies', () => {
  it('fetches buddies/mine', async () => {
    mockFetchApi.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    const result = await client.getMyBuddies();

    expect(result).toEqual([]);
  });
});
```

Adjust the exact assertion shape (whether `client` is constructed via a factory, whether `mockFetchApi.fetch` is the right mock name) to match the file's real existing conventions before finalizing.

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding/src/api/OnboardingClient.test.ts`
Expected: FAIL — methods not defined / `assignTemplate` called with wrong arg count.

- [ ] **Step 4: Implement in `OnboardingClient.ts`**

Find the existing `assignTemplate` implementation and change its signature and body to include `buddyUserId` in the POST body:

```typescript
  async assignTemplate(
    templateName: string,
    userId: string,
    buddyUserId?: string,
  ): Promise<OnboardingProgress> {
    const response = await this.fetchApi.fetch(
      `${await this.getBaseUrl()}/templates/${encodeURIComponent(
        templateName,
      )}/assign/${encodeURIComponent(userId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buddyUserId }),
      },
    );
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }

  async setBuddy(
    userId: string,
    buddyUserId: string | undefined,
  ): Promise<void> {
    const response = await this.fetchApi.fetch(
      `${await this.getBaseUrl()}/progress/${encodeURIComponent(
        userId,
      )}/buddy`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buddyUserId: buddyUserId ?? null }),
      },
    );
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
  }

  async getMyTeams(): Promise<{ teams: string[] }> {
    const response = await this.fetchApi.fetch(
      `${await this.getBaseUrl()}/teams/mine`,
    );
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }

  async getIsAssigner(): Promise<{ isAssigner: boolean }> {
    const response = await this.fetchApi.fetch(
      `${await this.getBaseUrl()}/assigner/me`,
    );
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }

  async getMyBuddies(): Promise<TeamJoinerSummary[]> {
    const response = await this.fetchApi.fetch(
      `${await this.getBaseUrl()}/buddies/mine`,
    );
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }
```

Match `getBaseUrl()`/`ResponseError` usage exactly to what the existing methods in this file already do (these are illustrative based on common Backstage client patterns — reconcile against the real file, which was already fully read during planning, before finalizing). Add `TeamJoinerSummary` to the import from `@estehsaan/backstage-plugin-onboarding-common`.

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding/src/api/OnboardingClient.test.ts`
Expected: PASS.

- [ ] **Step 6: Fix any call sites broken by the `assignTemplate` signature change**

Run: `cd plugins/backstage-plugin-onboarding && yarn tsc`
Expected: errors, if any, appear at `TemplatesView.tsx`'s call to `assignTemplate` — these are resolved in Task 10, so it's fine if `tsc` still fails after this step; just confirm the only failures are in `TemplatesView.tsx`.

- [ ] **Step 7: Commit**

```bash
cd plugins/backstage-plugin-onboarding
git add workspaces/onboarding/plugins/onboarding/src/api/OnboardingApi.ts workspaces/onboarding/plugins/onboarding/src/api/OnboardingClient.ts workspaces/onboarding/plugins/onboarding/src/api/OnboardingClient.test.ts
git commit -s -m "feat(onboarding): add buddy/teams/assigner API client methods"
```

---

## Task 10: Templates page redesign + buddy picker

**Files:**

- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding/src/components/TemplatesView/TemplatesView.tsx`
- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding/src/components/TemplatesView/TemplatesView.module.css`
- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding/src/components/TemplatesView/TemplatesView.test.tsx`

- [ ] **Step 1: Re-diagnose the exact visual issue**

Before writing any code, re-read the current `TemplatesView.tsx` render output alongside `TemplatesView.module.css` and compare against the user's screenshot description (cards look cramped/misaligned, role badges blend into text, footer button not full-width, spacing inconsistent). Since `.card`/`.cardBody` already have `display:flex;flex-direction:column`/`flex:1`, identify the actual remaining issues, likely candidates to check line-by-line:

- Missing `gap`/`padding` consistency between `.card` header, body, and footer sections.
- Role badge (if rendered as plain text instead of a styled `<span>`/pill).
- Footer button width (`width: 100%` missing, or button not pinned to the bottom via `margin-top: auto`).
- Card grid gap/columns (check the container's CSS grid/flex-wrap rules for uneven card heights).

Document your findings inline as comments in the diff description before editing (not committed, just to guide the edit).

- [ ] **Step 2: Update `TemplatesView.module.css`**

Apply the Option A redesign: role badge as a styled pill, consistent spacing in the description area, and a full-width footer button pinned to the bottom of the card regardless of description length. Add/adjust these rules (merge with existing rules rather than duplicating selectors — read the current file first and edit the existing `.card`, `.cardBody`, `.cardFooter`, and any role/badge-related class in place):

```css
.roleBadge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  background: var(--bui-bg-surface-2, #eef2f6);
  color: var(--bui-fg-secondary, #445);
  width: fit-content;
}

.cardDescription {
  margin: 8px 0 16px;
  color: var(--bui-fg-secondary, #667085);
  font-size: 0.875rem;
  line-height: 1.4;
  flex: 1;
}

.cardFooter {
  margin-top: auto;
}

.assignButton {
  width: 100%;
}
```

Adjust variable names (`--bui-bg-surface-2` etc.) to whatever design tokens the rest of this CSS module (and the BUI migration work already done elsewhere in the plugin) actually uses — check other already-migrated component CSS modules in this plugin (e.g. `TaskDetailPanel`'s styling or any BUI token usage) for the correct token names instead of inventing new ones.

- [ ] **Step 3: Update `TemplatesView.tsx` JSX to use the new classes**

Locate the card-rendering JSX (the `.map` over templates). Ensure the role text is wrapped in a `<span className={styles.roleBadge}>`, the description in `<p className={styles.cardDescription}>`, and the assign button's container has `className={styles.cardFooter}` with the button itself getting `className={styles.assignButton}` (composed alongside any existing BUI `Button` className prop, not replacing it).

- [ ] **Step 4: Write/extend a test asserting the redesigned structure renders**

In `TemplatesView.test.tsx`, add or extend an existing render test:

```typescript
it('renders the role badge and full-width assign action for each template', async () => {
  renderInTestApp(
    <TemplatesView
      api={createOnboardingApiMock({ templates: [sampleTemplate] })}
    />,
  );
  expect(await screen.findByText(sampleTemplate.role)).toHaveClass('roleBadge');
});
```

Match `sampleTemplate`/`createOnboardingApiMock` to whatever fixtures already exist in this test file (read it first) rather than inventing new fixture shapes. CSS module class names are typically hashed in test environments — if `toHaveClass('roleBadge')` fails due to CSS module hashing, use `expect(...).toHaveClass(expect.stringContaining('roleBadge'))` pattern only if the project's jest config supports it, otherwise assert on the element's presence/text content only and skip strict class assertions.

- [ ] **Step 5: Add the buddy picker to the assign dialog**

Locate the assign dialog (the modal/dialog opened when clicking "Assign" on a card, which currently has a user search `Autocomplete`). Add a second, optional `Autocomplete`/manual-entry field below the user picker, reusing the exact same search/autocomplete component and catalog-user-search API call the existing user picker uses (do not introduce a new search mechanism):

```tsx
<Autocomplete
  /* mirror all props used by the existing user-search Autocomplete above,
               but bind to buddyUserId state instead of userId state */
  options={userSearchResults}
  value={selectedBuddy}
  onChange={(_event, value) => setSelectedBuddy(value)}
  renderInput={params => (
    <TextField
      {...params}
      label="Buddy (optional)"
      placeholder="Search for a buddy..."
    />
  )}
/>
```

Wire `selectedBuddy` state (`useState<UserOption | null>(null)`) alongside the existing `selectedUser` state, and pass `selectedBuddy?.userId` as the third argument to `api.assignTemplate(templateName, selectedUser.userId, selectedBuddy?.userId)` in the existing submit handler.

- [ ] **Step 6: Add a test for buddy selection in the assign flow**

Add to `TemplatesView.test.tsx`, matching the existing assign-flow test's interaction pattern (open dialog, select user, click assign) but also selecting a buddy:

```typescript
it('includes the selected buddy when assigning a template', async () => {
  const api = createOnboardingApiMock({ templates: [sampleTemplate] });
  renderInTestApp(<TemplatesView api={api} />);
  const user = userEvent.setup();

  await user.click(await screen.findByText('Assign'));
  await user.type(screen.getByLabelText(/search for a user/i), 'jane');
  await user.click(await screen.findByText('Jane Doe'));
  await user.type(screen.getByLabelText(/buddy/i), 'sam');
  await user.click(await screen.findByText('Sam Buddy'));
  await user.click(screen.getByRole('button', { name: /confirm/i }));

  expect(api.assignTemplate).toHaveBeenCalledWith(
    sampleTemplate.name,
    'user:default/jane',
    'user:default/sam',
  );
});
```

Match labels/button text/mock user list exactly to what already exists in this test file's fixtures (read the existing assign-flow test before finalizing, since label text like "search for a user" is illustrative).

- [ ] **Step 7: Run tests to verify they pass**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding/src/components/TemplatesView`
Expected: PASS.

- [ ] **Step 8: Prettier + lint check**

Run: `cd plugins/backstage-plugin-onboarding && yarn prettier:check workspaces/onboarding/plugins/onboarding/src/components/TemplatesView && yarn lint workspaces/onboarding/plugins/onboarding`
Expected: no violations.

- [ ] **Step 9: Commit**

```bash
cd plugins/backstage-plugin-onboarding
git add workspaces/onboarding/plugins/onboarding/src/components/TemplatesView
git commit -s -m "feat(onboarding): redesign templates cards and add buddy picker"
```

---

## Task 11: `OnboardingPage.tsx` — tab visibility

**Files:**

- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding/src/components/OnboardingPage/OnboardingPage.tsx`
- Modify (or create): `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding/src/components/OnboardingPage/OnboardingPage.test.tsx`

- [ ] **Step 1: Write failing tests**

Add to (or create) `OnboardingPage.test.tsx`, matching whatever existing test setup pattern this component already has (or the sibling `TemplatesView.test.tsx`'s `renderInTestApp` + api-mock-factory pattern if this is a new file):

```typescript
it('hides the Templates tab for non-assigners', async () => {
  const api = createOnboardingApiMock({
    isAssigner: false,
    myBuddies: [],
  });
  renderInTestApp(<OnboardingPage api={api} />);
  expect(
    screen.queryByRole('tab', { name: /templates/i }),
  ).not.toBeInTheDocument();
});

it('shows the Templates tab for assigners', async () => {
  const api = createOnboardingApiMock({ isAssigner: true });
  renderInTestApp(<OnboardingPage api={api} />);
  expect(
    await screen.findByRole('tab', { name: /templates/i }),
  ).toBeInTheDocument();
});

it('shows the Team View tab for a buddy with assigned joiners even if not an assigner', async () => {
  const api = createOnboardingApiMock({
    isAssigner: false,
    myBuddies: [{ userId: 'user:default/joiner' } as any],
  });
  renderInTestApp(<OnboardingPage api={api} />);
  expect(
    await screen.findByRole('tab', { name: /team view/i }),
  ).toBeInTheDocument();
});

it('hides the Team View tab for a non-assigner with no buddies', async () => {
  const api = createOnboardingApiMock({ isAssigner: false, myBuddies: [] });
  renderInTestApp(<OnboardingPage api={api} />);
  expect(
    screen.queryByRole('tab', { name: /team view/i }),
  ).not.toBeInTheDocument();
});
```

Extend `createOnboardingApiMock` (shared test fixture factory, wherever it's currently defined - check if it's local to `TemplatesView.test.tsx` or in a shared test-utils file) to accept `isAssigner`/`myBuddies` and wire `getIsAssigner`/`getMyBuddies` mock implementations accordingly. If it's currently local to `TemplatesView.test.tsx` only, extract it into a shared `src/test-utils/createOnboardingApiMock.ts` used by both test files (small refactor, keep behavior identical for existing callers).

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding/src/components/OnboardingPage`
Expected: FAIL — tabs not conditionally rendered yet.

- [ ] **Step 3: Implement tab visibility logic**

In `OnboardingPage.tsx`, add state and effects to fetch assigner/buddy status on mount (mirroring whatever data-fetching pattern the component already uses for its existing tabs — likely `useAsync` from `react-use` given Backstage conventions; check the file for the existing pattern before introducing a new one):

```tsx
const { value: isAssigner } = useAsync(async () => {
  const result = await api.getIsAssigner();
  return result.isAssigner;
}, [api]);

const { value: myBuddies } = useAsync(async () => {
  return api.getMyBuddies();
}, [api]);

const showTemplatesTab = Boolean(isAssigner);
const showTeamViewTab = Boolean(isAssigner) || (myBuddies?.length ?? 0) > 0;
```

Then wrap the existing `<TabbedLayout.Route path="/templates" ...>` (or equivalent tab-registration JSX, matching whatever tab component this file actually uses) in a conditional:

```tsx
{
  showTemplatesTab && (
    <TabbedLayout.Route path="/templates" title="Templates">
      <TemplatesView api={api} />
    </TabbedLayout.Route>
  );
}
{
  showTeamViewTab && (
    <TabbedLayout.Route path="/team" title="Team View">
      <TeamView api={api} isAssigner={Boolean(isAssigner)} />
    </TabbedLayout.Route>
  );
}
```

Reconcile the exact tab component name/props (`TabbedLayout.Route` is illustrative) against what `OnboardingPage.tsx` actually imports and uses today before finalizing — this file was already fully read during planning, use that exact structure.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding/src/components/OnboardingPage`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd plugins/backstage-plugin-onboarding
git add workspaces/onboarding/plugins/onboarding/src/components/OnboardingPage
git commit -s -m "feat(onboarding): scope Templates/Team View tabs to assigners and buddies"
```

---

## Task 12: `TeamView.tsx` — lead mode, buddy mode, team selector, buddy assignment

**Files:**

- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding/src/components/TeamView/TeamView.tsx`
- Modify: `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/onboarding/src/components/TeamView/TeamView.test.tsx`

- [ ] **Step 1: Write failing tests for lead mode with team selector**

```typescript
it('shows a team selector when the lead belongs to more than one team', async () => {
  const api = createOnboardingApiMock({
    myTeams: { teams: ['platform-team', 'growth-team'] },
    teamStats: {
      teamName: 'platform-team',
      totalJoiners: 1,
      activeJoiners: [],
    },
  });
  renderInTestApp(<TeamView api={api} isAssigner />);

  expect(await screen.findByLabelText(/team/i)).toBeInTheDocument();
  expect(screen.getByText('platform-team')).toBeInTheDocument();
});

it('does not show a team selector when the lead belongs to exactly one team', async () => {
  const api = createOnboardingApiMock({
    myTeams: { teams: ['platform-team'] },
    teamStats: {
      teamName: 'platform-team',
      totalJoiners: 0,
      activeJoiners: [],
    },
  });
  renderInTestApp(<TeamView api={api} isAssigner />);

  expect(await screen.findByText(/platform-team/i)).toBeInTheDocument();
  expect(screen.queryByLabelText(/team/i)).not.toBeInTheDocument();
});

it('shows a read-only My Buddies view for a non-lead buddy', async () => {
  const api = createOnboardingApiMock({
    myTeams: { teams: [] },
    myBuddies: [
      {
        userId: 'user:default/joiner',
        displayName: 'Joiner Name',
        role: 'engineer-onboarding',
        startDate: '2026-07-01',
        completionPercent: 40,
        blockedTaskCount: 0,
      },
    ],
  });
  renderInTestApp(<TeamView api={api} isAssigner={false} />);

  expect(await screen.findByText('Joiner Name')).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: /assign buddy/i }),
  ).not.toBeInTheDocument();
});

it('lets a lead assign a buddy from the roster', async () => {
  const api = createOnboardingApiMock({
    myTeams: { teams: ['platform-team'] },
    teamStats: {
      teamName: 'platform-team',
      totalJoiners: 1,
      activeJoiners: [
        {
          userId: 'user:default/joiner',
          displayName: 'Joiner Name',
          role: 'engineer-onboarding',
          startDate: '2026-07-01',
          completionPercent: 10,
          blockedTaskCount: 0,
        },
      ],
    },
  });
  renderInTestApp(<TeamView api={api} isAssigner />);
  const user = userEvent.setup();

  await user.click(
    await screen.findByRole('button', { name: /assign buddy/i }),
  );
  await user.type(screen.getByLabelText(/buddy/i), 'sam');
  await user.click(await screen.findByText('Sam Buddy'));
  await user.click(screen.getByRole('button', { name: /confirm/i }));

  expect(api.setBuddy).toHaveBeenCalledWith(
    'user:default/joiner',
    'user:default/sam',
  );
});
```

Extend `createOnboardingApiMock` to accept `myTeams`, `teamStats`, `myBuddies` and wire `getMyTeams`/`getTeamStats` (existing method, confirm its real name in `OnboardingApi.ts`)/`getMyBuddies`/`setBuddy` accordingly.

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding/src/components/TeamView`
Expected: FAIL.

- [ ] **Step 3: Implement the dual-mode `TeamView.tsx`**

Replace the current free-text `teamName` search input with team-selection driven by `getMyTeams()`. Sketch (reconcile fully against the already-read current file structure, preserving its existing loading/error-state handling patterns):

```tsx
export function TeamView({
  api,
  isAssigner,
}: {
  api: OnboardingApi;
  isAssigner: boolean;
}) {
  const { value: myTeamsResult } = useAsync(() => api.getMyTeams(), [api]);
  const teams = myTeamsResult?.teams ?? [];
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!selectedTeam && teams.length > 0) {
      setSelectedTeam(teams[0]);
    }
  }, [teams, selectedTeam]);

  const { value: myBuddies } = useAsync(() => api.getMyBuddies(), [api]);

  if (isAssigner && teams.length > 0) {
    return (
      <TeamRoster
        api={api}
        teams={teams}
        selectedTeam={selectedTeam}
        onSelectTeam={setSelectedTeam}
      />
    );
  }

  return <MyBuddiesView api={api} buddies={myBuddies ?? []} />;
}
```

Implement `TeamRoster` (leads: team `<Select>` shown only when `teams.length > 1`, roster table with a "Buddy" column and an "Assign Buddy" button per row opening a small dialog with the same buddy-search `Autocomplete` pattern used in Task 10, calling `api.setBuddy(userId, buddyUserId)` then refetching stats) and `MyBuddiesView` (read-only table of `TeamJoinerSummary[]` from `myBuddies`, no assign controls) as either sub-components in the same file or separate files in the same directory (`TeamRoster.tsx`, `MyBuddiesView.tsx`) if the resulting file would exceed roughly 200-250 lines — follow the codebase's existing convention on file size by checking how large other component files in this plugin already are.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd plugins/backstage-plugin-onboarding && CI=1 yarn test workspaces/onboarding/plugins/onboarding/src/components/TeamView`
Expected: PASS.

- [ ] **Step 5: Prettier + lint + tsc check**

Run: `cd plugins/backstage-plugin-onboarding && yarn tsc && yarn prettier:check workspaces/onboarding/plugins/onboarding/src/components/TeamView && yarn lint workspaces/onboarding/plugins/onboarding`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
cd plugins/backstage-plugin-onboarding
git add workspaces/onboarding/plugins/onboarding/src/components/TeamView
git commit -s -m "feat(onboarding): add lead/buddy dual-mode Team View with team selector"
```

---

## Task 13: Final integration pass

**Files:** none new — validation only.

- [ ] **Step 1: Immutable install**

Run: `cd plugins/backstage-plugin-onboarding && yarn install --immutable`
Expected: succeeds, no YN0028 errors.

- [ ] **Step 2: Type check**

Run: `cd plugins/backstage-plugin-onboarding && yarn tsc`
Expected: zero errors.

- [ ] **Step 3: Prettier check**

Run: `cd plugins/backstage-plugin-onboarding && yarn prettier:check`
Expected: zero violations.

- [ ] **Step 4: Build all packages**

Run: `cd plugins/backstage-plugin-onboarding && yarn build:all`
Expected: succeeds.

- [ ] **Step 5: Build API reports**

Run: `cd plugins/backstage-plugin-onboarding && yarn build:api-reports:only`
Expected: succeeds; review the generated `.api.md` diffs for the three packages to confirm only intended new exports appear.

- [ ] **Step 6: Lint**

Run: `cd plugins/backstage-plugin-onboarding && yarn lint`
Expected: zero errors.

- [ ] **Step 7: Full test suite**

Run: `cd plugins/backstage-plugin-onboarding && yarn test`
Expected: all tests pass.

- [ ] **Step 8: Changesets**

Create three changeset files (one per changed published package) directly in `plugins/backstage-plugin-onboarding/.changeset/` (do not use the changeset CLI):

`plugins/backstage-plugin-onboarding/.changeset/onboarding-buddy-team-access.md`:

```markdown
---
'@estehsaan/backstage-plugin-onboarding': minor
'@estehsaan/backstage-plugin-onboarding-backend': minor
'@estehsaan/backstage-plugin-onboarding-common': minor
---

Add manual buddy assignment for onboarding joiners, restrict template assignment and Team View access to a configurable catalog group via `onboarding.defaults.assignerGroups`, add a scoped "My Buddies" view for assigned buddies, and redesign the Templates page cards.
```

Adjust the bump type (`minor`/`patch`) per package based on each package's current version in its `package.json` (per this repo's changeset rules: `<1.0.0` uses `minor` for new features, `>=1.0.0` uses the same `minor` for non-breaking additions) — verify each package's current version before finalizing.

- [ ] **Step 9: Root monorepo checks (if this submodule is vendored into the parent repo's workspace)**

From the Backstage monorepo root:

```bash
yarn install
yarn tsc
yarn prettier --check plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/**/*.{ts,tsx,css}
yarn lint --fix
CI=1 yarn test plugins/backstage-plugin-onboarding
```

Expected: zero errors across all steps.

- [ ] **Step 10: Final commit**

```bash
cd plugins/backstage-plugin-onboarding
git add .changeset
git commit -s -m "chore(onboarding): add changesets for buddy/team-access feature"
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage
git add plugins/backstage-plugin-onboarding
git commit -s -m "chore: update onboarding submodule pointer for buddy/team-access feature"
```
