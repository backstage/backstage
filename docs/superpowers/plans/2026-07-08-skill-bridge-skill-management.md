# Skill Bridge — Skill Management & User Profiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add create/edit skills to the shared catalog via an inline form in `EditSkillsDialog`, and add a standalone user profile page at `/skill-bridge/users/:userRef` that shows full skill profiles — editable for the current user, read-only for others — with navigation from the home page.

**Architecture:** The feature spans three packages: `skill-bridge-common` (types), `skill-bridge-backend` (DB migration + new routes), `skill-bridge-react` (new components + updated dialog), and `skill-bridge` (routing). The inline form renders inside `EditSkillsDialog` using a `skillFormState` discriminated union; the profile page detects identity via `identityApiRef` and reads catalog data via `catalogApiRef`. Navigation uses `react-router-dom`'s `useNavigate`/`useParams`.

**Tech Stack:** TypeScript, Knex (SQLite/Postgres), Express, React 18, BUI (`@backstage/ui`), `@remixicon/react`, `@backstage/core-plugin-api`, `@backstage/plugin-catalog-react`, `react-router-dom`

## Global Constraints

- All files start with `/* Copyright 2026 Estehsan Tariq — Apache-2.0 */`
- No MUI imports (`@material-ui/*`) — use BUI (`@backstage/ui`) and `@remixicon/react` icons
- No `null` — use `undefined`
- No `React` default import — use named imports: `import { useState } from 'react'`
- `onChange` on BUI `TextField` receives a `string`, not a React event
- Run all commands from the **workspace root**: `/Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge/`
- Test command: `CI=1 yarn test <package-dir-name>` (e.g. `CI=1 yarn test plugins/skill-bridge-backend`)
- Type check: `yarn tsc` from workspace root
- Commit with: `git commit -s -m "feat: ..."` (DCO sign-off required)

---

### Task 1: Extend common types

**Files:**

- Modify: `plugins/skill-bridge-common/src/types.ts`

**Interfaces:**

- Produces: `Skill.description?: string`, `CreateSkillRequest`, `UpdateSkillRequest` — consumed by Tasks 3, 4, 5, 6, 7, 8, 9

- [ ] **Step 1: Add `description` to `Skill` and add request types**

Open `plugins/skill-bridge-common/src/types.ts`. Make these changes:

```ts
export interface Skill {
  /** Unique slug, e.g. 'spring-boot' */
  id: string;
  /** Display name, e.g. 'Spring Boot' */
  name: string;
  /** Category grouping */
  category: SkillCategory;
  /** Optional human-readable description */
  description?: string;
}
```

Add after the `Skill` interface (before `UserSkill`):

```ts
/**
 * Request body for creating a new skill in the catalog.
 * @public
 */
export interface CreateSkillRequest {
  name: string;
  category: SkillCategory;
  description?: string;
}

/**
 * Request body for updating an existing skill.
 * @public
 */
export interface UpdateSkillRequest {
  name?: string;
  category?: SkillCategory;
  description?: string;
}
```

- [ ] **Step 2: Export the new types from common index**

Open `plugins/skill-bridge-common/src/index.ts` and verify `types.ts` is re-exported (it should already be `export * from './types'`). If not, add it.

- [ ] **Step 3: Type-check**

```bash
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge
yarn tsc
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge
git add plugins/skill-bridge-common/src/types.ts
git commit -s -m "feat(common): add description field to Skill and CreateSkillRequest/UpdateSkillRequest types"
```

---

### Task 2: DB migration for `description` column

**Files:**

- Create: `plugins/skill-bridge-backend/migrations/002_add_skill_description.js`

**Interfaces:**

- Consumes: nothing
- Produces: `skills.description` nullable column — consumed by Tasks 3, 4

- [ ] **Step 1: Create the migration file**

Create `plugins/skill-bridge-backend/migrations/002_add_skill_description.js`:

```js
/*
 * Copyright 2026 Estehsan Tariq — Apache-2.0
 */

/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('skills', table => {
    table.text('description').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('skills', table => {
    table.dropColumn('description');
  });
};
```

- [ ] **Step 2: Commit**

```bash
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge
git add plugins/skill-bridge-backend/migrations/002_add_skill_description.js
git commit -s -m "feat(backend): migration 002 — add description column to skills table"
```

---

### Task 3: Store `createSkill` and `updateSkill` methods

**Files:**

- Modify: `plugins/skill-bridge-backend/src/service/DatabaseSkillBridgeStore.ts`

**Interfaces:**

- Consumes: `CreateSkillRequest`, `UpdateSkillRequest` from `skill-bridge-common`
- Produces:

  - `store.createSkill(req: CreateSkillRequest): Promise<Skill>`
  - `store.updateSkill(id: string, updates: UpdateSkillRequest): Promise<Skill | undefined>`

- [ ] **Step 1: Add `createSkill` method to `DatabaseSkillBridgeStore`**

In `DatabaseSkillBridgeStore.ts`, import the new types at the top:

```ts
import type {
  Skill,
  SkillCategory,
  UserSkill,
  Post,
  CreatePostRequest,
  PostKind,
  SavedPost,
  CreateSkillRequest,
  UpdateSkillRequest,
} from '@estehsaan/backstage-plugin-skill-bridge-common';
```

After `getSkillById`, add `createSkill`:

```ts
async createSkill(req: CreateSkillRequest): Promise<Skill> {
  const id = slugify(req.name);
  await this.knex('skills').insert({
    id,
    name: req.name,
    category: req.category,
    description: req.description ?? null,
  });
  return (await this.getSkillById(id))!;
}
```

- [ ] **Step 2: Add `updateSkill` method**

After `createSkill`, add:

```ts
async updateSkill(id: string, updates: UpdateSkillRequest): Promise<Skill | undefined> {
  const existing = await this.getSkillById(id);
  if (!existing) return undefined;

  const updateData: Record<string, unknown> = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.description !== undefined) updateData.description = updates.description;

  if (Object.keys(updateData).length > 0) {
    await this.knex('skills').where({ id }).update(updateData);
  }

  return this.getSkillById(id);
}
```

- [ ] **Step 3: Update `listSkills` and `getSkillById` to include `description`**

Update `listSkills`:

```ts
async listSkills(): Promise<Skill[]> {
  const rows = await this.knex('skills').select('id', 'name', 'category', 'description');
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    category: r.category as SkillCategory,
    description: r.description ?? undefined,
  }));
}
```

Update `getSkillById`:

```ts
async getSkillById(id: string): Promise<Skill | undefined> {
  const row = await this.knex('skills').where({ id }).first();
  if (!row) return undefined;
  return {
    id: row.id,
    name: row.name,
    category: row.category as SkillCategory,
    description: row.description ?? undefined,
  };
}
```

- [ ] **Step 4: Type-check**

```bash
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge
yarn tsc
```

Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add plugins/skill-bridge-backend/src/service/DatabaseSkillBridgeStore.ts
git commit -s -m "feat(backend): add createSkill and updateSkill methods to DatabaseSkillBridgeStore"
```

---

### Task 4: Router routes `POST /skills` and `PATCH /skills/:id`

**Files:**

- Modify: `plugins/skill-bridge-backend/src/service/router.ts`
- Modify: `plugins/skill-bridge-backend/src/service/router.test.ts`

**Interfaces:**

- Consumes: `store.createSkill()`, `store.updateSkill()`, `store.getSkillById()` from Task 3
- Produces:

  - `POST /skills` → `201 Skill` or `409 { error: string }`
  - `PATCH /skills/:id` → `200 Skill` or `404 { error: string }`

- [ ] **Step 1: Write failing tests first**

Open `router.test.ts`. Update the `store` mock inside `createTestApp` to include the new methods:

```ts
const store = {
  listSkills: jest.fn().mockResolvedValue([]),
  getSkillById: jest.fn().mockResolvedValue(undefined),
  createSkill: jest.fn(),
  updateSkill: jest.fn(),
  getUserSkills: jest
    .fn()
    .mockResolvedValue([
      { userRef: 'user:default/alice', skillId: 'react', intent: 'learning' },
    ]),
  setUserSkills: jest.fn().mockResolvedValue([]),
  getUsersWithSkills: jest.fn().mockResolvedValue([]),
  listPosts: jest.fn().mockResolvedValue([]),
  createPost: jest.fn(),
  getPostById: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  savePost: jest.fn(),
  unsavePost: jest.fn(),
};
```

Add these test cases at the bottom of the `describe('createRouter')` block:

```ts
describe('POST /skills', () => {
  it('creates a skill and returns 201', async () => {
    const { router, store } = createTestApp();
    const app = express();
    app.use(await router);

    const newSkill = {
      id: 'rust',
      name: 'Rust',
      category: 'language',
      description: 'Systems language',
    };
    store.createSkill.mockResolvedValue(newSkill);

    const response = await request(app)
      .post('/skills')
      .send({
        name: 'Rust',
        category: 'language',
        description: 'Systems language',
      })
      .expect(201);

    expect(response.body).toEqual(newSkill);
    expect(store.createSkill).toHaveBeenCalledWith({
      name: 'Rust',
      category: 'language',
      description: 'Systems language',
    });
  });

  it('returns 400 when name or category is missing', async () => {
    const { router } = createTestApp();
    const app = express();
    app.use(await router);

    await request(app).post('/skills').send({ name: 'Rust' }).expect(400);
  });

  it('returns 400 for unsupported category', async () => {
    const { router } = createTestApp();
    const app = express();
    app.use(await router);

    await request(app)
      .post('/skills')
      .send({ name: 'Rust', category: 'invalid' })
      .expect(400);
  });
});

describe('PATCH /skills/:id', () => {
  it('updates a skill and returns 200', async () => {
    const { router, store } = createTestApp();
    const app = express();
    app.use(await router);

    const updated = {
      id: 'react',
      name: 'React',
      category: 'framework',
      description: 'UI library',
    };
    store.getSkillById.mockResolvedValue({
      id: 'react',
      name: 'React',
      category: 'framework',
    });
    store.updateSkill.mockResolvedValue(updated);

    const response = await request(app)
      .patch('/skills/react')
      .send({ description: 'UI library' })
      .expect(200);

    expect(response.body).toEqual(updated);
    expect(store.updateSkill).toHaveBeenCalledWith('react', {
      description: 'UI library',
    });
  });

  it('returns 404 when skill does not exist', async () => {
    const { router, store } = createTestApp();
    const app = express();
    app.use(await router);

    store.getSkillById.mockResolvedValue(undefined);

    await request(app)
      .patch('/skills/nonexistent')
      .send({ description: 'x' })
      .expect(404);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge
CI=1 yarn test plugins/skill-bridge-backend
```

Expected: new test blocks fail with route-not-found or method-not-allowed errors.

- [ ] **Step 3: Implement the routes in `router.ts`**

Add a helper to validate category (add near the top parse helpers):

```ts
function parseSkillCategory(
  category: unknown,
): import('@estehsaan/backstage-plugin-skill-bridge-common').SkillCategory {
  const valid = [
    'discipline',
    'framework',
    'infrastructure',
    'language',
    'technique',
  ];
  if (typeof category !== 'string' || !valid.includes(category)) {
    throw new InputError(`"category" must be one of: ${valid.join(', ')}`);
  }
  return category as import('@estehsaan/backstage-plugin-skill-bridge-common').SkillCategory;
}
```

Add the routes inside `createRouter`, after the existing `GET /skills` route:

```ts
router.post('/skills', async (req, res) => {
  const credentials = await httpAuth.credentials(req, { allow: ['user'] });
  const decision = (
    await permissions.authorize([{ permission: skillBridgeWritePermission }], {
      credentials,
    })
  )[0];
  if (decision.result !== AuthorizeResult.ALLOW) {
    throw new NotAllowedError('Missing skill-bridge.write permission');
  }

  const { name, category, description } = req.body;
  if (typeof name !== 'string' || !name.trim()) {
    throw new InputError('"name" is required');
  }
  const parsedCategory = parseSkillCategory(category);

  const skill = await store.createSkill({
    name: name.trim(),
    category: parsedCategory,
    description:
      typeof description === 'string' ? description.trim() : undefined,
  });
  res.status(201).json(skill);
});

router.patch('/skills/:id', async (req, res) => {
  const id = req.params.id;
  const credentials = await httpAuth.credentials(req, { allow: ['user'] });
  const decision = (
    await permissions.authorize([{ permission: skillBridgeWritePermission }], {
      credentials,
    })
  )[0];
  if (decision.result !== AuthorizeResult.ALLOW) {
    throw new NotAllowedError('Missing skill-bridge.write permission');
  }

  const existing = await store.getSkillById(id);
  if (!existing) {
    throw new NotFoundError(`Skill '${id}' not found`);
  }

  const { name, category, description } = req.body;
  const updates: import('@estehsaan/backstage-plugin-skill-bridge-common').UpdateSkillRequest =
    {};
  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      throw new InputError('"name" must be a non-empty string');
    }
    updates.name = name.trim();
  }
  if (category !== undefined) {
    updates.category = parseSkillCategory(category);
  }
  if (description !== undefined) {
    updates.description =
      typeof description === 'string' ? description.trim() : undefined;
  }

  const updated = await store.updateSkill(id, updates);
  res.json(updated);
});
```

Also add `UpdateSkillRequest` to the import from `skill-bridge-common` in `router.ts`:

```ts
import {
  skillBridgeReadPermission,
  skillBridgeWritePermission,
  skillBridgeAdminPermission,
  SearchPeopleResponse,
  Skill,
  SkillIntent,
  UserSkill,
  MentorshipKind,
  PostKind,
  PostStatus,
  UpdateSkillRequest,
} from '@estehsaan/backstage-plugin-skill-bridge-common';
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge
CI=1 yarn test plugins/skill-bridge-backend
```

Expected: all tests pass, including the two existing tests.

- [ ] **Step 5: Type-check**

```bash
yarn tsc
```

Expected: zero errors.

- [ ] **Step 6: Commit**

```bash
git add plugins/skill-bridge-backend/src/service/router.ts \
        plugins/skill-bridge-backend/src/service/router.test.ts
git commit -s -m "feat(backend): add POST /skills and PATCH /skills/:id routes"
```

---

### Task 5: API interface and client

**Files:**

- Modify: `plugins/skill-bridge-react/src/api/types.ts`
- Modify: `plugins/skill-bridge-react/src/api/SkillBridgeClient.ts`

**Interfaces:**

- Consumes: `CreateSkillRequest`, `UpdateSkillRequest`, `Skill` from Task 1
- Produces:

  - `SkillBridgeApi.createSkill(req: CreateSkillRequest): Promise<Skill>`
  - `SkillBridgeApi.updateSkill(id: string, updates: UpdateSkillRequest): Promise<Skill>`

- [ ] **Step 1: Add methods to the `SkillBridgeApi` interface**

Open `plugins/skill-bridge-react/src/api/types.ts`. Add the new imports and methods:

```ts
import type {
  Skill,
  UserSkill,
  Post,
  CreatePostRequest,
  PostKind,
  SearchPeopleRequest,
  SearchPeopleResponse,
  CreateSkillRequest,
  UpdateSkillRequest,
} from '@estehsaan/backstage-plugin-skill-bridge-common';
```

Add to the `SkillBridgeApi` interface:

```ts
export interface SkillBridgeApi {
  listSkills(): Promise<{ items: Skill[] }>;
  createSkill(req: CreateSkillRequest): Promise<Skill>;
  updateSkill(id: string, updates: UpdateSkillRequest): Promise<Skill>;
  getUserSkills(userRef: string): Promise<{ items: UserSkill[] }>;
  updateUserSkills(
    userRef: string,
    items: UserSkill[],
  ): Promise<{ items: UserSkill[] }>;
  searchPeople(request: SearchPeopleRequest): Promise<SearchPeopleResponse>;
  listPosts(params: {
    kind?: PostKind;
    authorRef?: string;
    saved?: boolean;
  }): Promise<{ items: Post[] }>;
  createPost(request: CreatePostRequest): Promise<Post>;
  updatePost(id: string, request: Partial<Post>): Promise<Post>;
  deletePost(id: string): Promise<void>;
  savePost(id: string): Promise<void>;
  unsavePost(id: string): Promise<void>;
}
```

- [ ] **Step 2: Implement in `SkillBridgeClient`**

Open `plugins/skill-bridge-react/src/api/SkillBridgeClient.ts`. Add imports and implement the two new methods after `listSkills`:

```ts
import type {
  Skill,
  UserSkill,
  Post,
  CreatePostRequest,
  PostKind,
  SearchPeopleRequest,
  SearchPeopleResponse,
  CreateSkillRequest,
  UpdateSkillRequest,
} from '@estehsaan/backstage-plugin-skill-bridge-common';
```

```ts
async createSkill(req: CreateSkillRequest): Promise<Skill> {
  return this.request<Skill>('/skills', {
    method: 'POST',
    body: JSON.stringify(req),
    headers: { 'Content-Type': 'application/json' },
  });
}

async updateSkill(id: string, updates: UpdateSkillRequest): Promise<Skill> {
  return this.request<Skill>(`/skills/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
    headers: { 'Content-Type': 'application/json' },
  });
}
```

- [ ] **Step 3: Type-check**

```bash
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge
yarn tsc
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add plugins/skill-bridge-react/src/api/types.ts \
        plugins/skill-bridge-react/src/api/SkillBridgeClient.ts
git commit -s -m "feat(react): add createSkill and updateSkill to SkillBridgeApi interface and client"
```

---

### Task 6: `SkillForm` component

**Files:**

- Create: `plugins/skill-bridge-react/src/components/SkillForm.tsx`

**Interfaces:**

- Consumes: `SkillCategory` from common; BUI `TextField`, `Button`, `Flex`, `Text`; `@remixicon/react`
- Produces:

  ```ts
  export interface SkillFormProps {
    prefill: { name: string; description?: string };
    category: SkillCategory;
    onSave: (data: { name: string; description?: string }) => void;
    onCancel: () => void;
    saving?: boolean;
    error?: string;
  }
  export function SkillForm(props: SkillFormProps): JSX.Element;
  ```

- [ ] **Step 1: Create `SkillForm.tsx`**

Create `plugins/skill-bridge-react/src/components/SkillForm.tsx`:

```tsx
/*
 * Copyright 2026 Estehsan Tariq — Apache-2.0
 */

import { useState } from 'react';
import { Flex, TextField, Button, Text } from '@backstage/ui';
import type { SkillCategory } from '@estehsaan/backstage-plugin-skill-bridge-common';

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  discipline: 'Discipline',
  framework: 'Framework',
  infrastructure: 'Infrastructure',
  language: 'Language',
  technique: 'Technique',
};

export interface SkillFormProps {
  prefill: { name: string; description?: string };
  category: SkillCategory;
  onSave: (data: { name: string; description?: string }) => void;
  onCancel: () => void;
  saving?: boolean;
  error?: string;
}

/** Inline create/edit form for a catalog skill. Used inside EditSkillsDialog. @internal */
export function SkillForm(props: SkillFormProps) {
  const { prefill, category, onSave, onCancel, saving, error } = props;
  const [name, setName] = useState(prefill.name);
  const [description, setDescription] = useState(prefill.description ?? '');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim() || undefined });
  };

  return (
    <Flex
      direction="column"
      style={{
        gap: 'var(--bui-space-2)',
        padding: 'var(--bui-space-3)',
        border: '1px solid var(--bui-border-1)',
        borderRadius: 'var(--bui-radius-2)',
        background: 'var(--bui-bg-2)',
      }}
    >
      <Flex
        align="center"
        style={{
          gap: 'var(--bui-space-2)',
          marginBottom: 'var(--bui-space-1)',
        }}
      >
        <Text variant="title-x-small" weight="bold">
          New skill
        </Text>
        <Text
          variant="body-x-small"
          color="secondary"
          style={{
            padding: '2px var(--bui-space-2)',
            borderRadius: 'var(--bui-radius-1)',
            background: 'var(--bui-bg-3)',
          }}
        >
          {CATEGORY_LABELS[category]}
        </Text>
      </Flex>

      <TextField
        label="Name"
        value={name}
        onChange={setName}
        placeholder="e.g. Kotlin"
        aria-label="Skill name"
      />

      <TextField
        label="Description (optional)"
        value={description}
        onChange={setDescription}
        placeholder="Brief description of this skill"
        aria-label="Skill description"
      />

      {error && (
        <Text
          variant="body-x-small"
          style={{ color: 'var(--bui-color-danger)' }}
        >
          {error}
        </Text>
      )}

      <Flex style={{ gap: 'var(--bui-space-2)' }}>
        <Button
          variant="primary"
          onPress={handleSave}
          isDisabled={!name.trim() || saving}
        >
          {saving ? 'Saving…' : 'Save skill'}
        </Button>
        <Button variant="tertiary" onPress={onCancel} isDisabled={saving}>
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge
yarn tsc
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add plugins/skill-bridge-react/src/components/SkillForm.tsx
git commit -s -m "feat(react): add SkillForm inline create/edit component"
```

---

### Task 7: Update `EditSkillsDialog` with inline create/edit

**Files:**

- Modify: `plugins/skill-bridge-react/src/components/EditSkillsDialog.tsx`

**Interfaces:**

- Consumes: `SkillForm` from Task 6; `CreateSkillRequest`, `UpdateSkillRequest`, `Skill` from Task 1
- Produces new props:

  ```ts
  onCreateSkill?: (req: CreateSkillRequest) => Promise<Skill>;
  onUpdateSkill?: (id: string, updates: UpdateSkillRequest) => Promise<Skill>;
  ```

- [ ] **Step 1: Replace `EditSkillsDialog.tsx` with updated implementation**

Replace the entire contents of `plugins/skill-bridge-react/src/components/EditSkillsDialog.tsx`:

```tsx
/*
 * Copyright 2026 Estehsan Tariq — Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Flex,
  Tag,
  TagGroup,
  Text,
  SearchAutocomplete,
  SearchAutocompleteItem,
} from '@backstage/ui';
import { RiEditLine } from '@remixicon/react';
import type {
  Skill,
  SkillCategory,
  SkillIntent,
  UserSkill,
  CreateSkillRequest,
  UpdateSkillRequest,
} from '@estehsaan/backstage-plugin-skill-bridge-common';
import { SkillForm } from './SkillForm';

const CATEGORIES: SkillCategory[] = [
  'discipline',
  'framework',
  'infrastructure',
  'language',
  'technique',
];

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  discipline: 'Discipline',
  framework: 'Frameworks',
  infrastructure: 'Infrastructure',
  language: 'Languages',
  technique: 'Techniques',
};

type SkillFormState =
  | { mode: 'idle' }
  | { mode: 'create'; column: 'can_help' | 'learning'; prefill: string }
  | { mode: 'edit'; skill: Skill; column: 'can_help' | 'learning' };

export interface EditSkillsDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (userSkills: UserSkill[]) => void;
  userRef: string;
  allSkills: Skill[];
  currentUserSkills: UserSkill[];
  onCreateSkill?: (req: CreateSkillRequest) => Promise<Skill>;
  onUpdateSkill?: (id: string, updates: UpdateSkillRequest) => Promise<Skill>;
}

/** @public */
export function EditSkillsDialog(props: EditSkillsDialogProps) {
  const {
    open,
    onClose,
    onSave,
    userRef,
    allSkills,
    currentUserSkills,
    onCreateSkill,
    onUpdateSkill,
  } = props;

  const [activeTab, setActiveTab] = useState<SkillCategory>('discipline');
  const [canHelpSkills, setCanHelpSkills] = useState<Skill[]>([]);
  const [learningSkills, setLearningSkills] = useState<Skill[]>([]);
  const [canHelpSearch, setCanHelpSearch] = useState('');
  const [learningSearch, setLearningSearch] = useState('');
  const [skillFormState, setSkillFormState] = useState<SkillFormState>({
    mode: 'idle',
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();

  useEffect(() => {
    const canHelp: Skill[] = [];
    const learning: Skill[] = [];
    for (const us of currentUserSkills) {
      const skill = allSkills.find(s => s.id === us.skillId);
      if (skill) {
        if (us.intent === 'can_help') canHelp.push(skill);
        else learning.push(skill);
      }
    }
    setCanHelpSkills(canHelp);
    setLearningSkills(learning);
  }, [currentUserSkills, allSkills]);

  const handleSave = () => {
    const userSkills: UserSkill[] = [
      ...canHelpSkills.map(s => ({
        userRef,
        skillId: s.id,
        intent: 'can_help' as SkillIntent,
      })),
      ...learningSkills.map(s => ({
        userRef,
        skillId: s.id,
        intent: 'learning' as SkillIntent,
      })),
    ];
    onSave(userSkills);
    onClose();
  };

  const closeForm = () => {
    setSkillFormState({ mode: 'idle' });
    setFormError(undefined);
    setCanHelpSearch('');
    setLearningSearch('');
  };

  const handleFormSave = async (
    column: 'can_help' | 'learning',
    data: { name: string; description?: string },
  ) => {
    setFormSaving(true);
    setFormError(undefined);
    try {
      if (skillFormState.mode === 'create' && onCreateSkill) {
        const newSkill = await onCreateSkill({
          name: data.name,
          category: activeTab,
          description: data.description,
        });
        if (column === 'can_help') {
          setCanHelpSkills(prev => [...prev, newSkill]);
        } else {
          setLearningSkills(prev => [...prev, newSkill]);
        }
      } else if (skillFormState.mode === 'edit' && onUpdateSkill) {
        await onUpdateSkill(skillFormState.skill.id, {
          name: data.name,
          description: data.description,
        });
      }
      closeForm();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save skill');
    } finally {
      setFormSaving(false);
    }
  };

  const skillsInCategory = allSkills.filter(s => s.category === activeTab);
  const currentCanHelp = canHelpSkills.filter(s => s.category === activeTab);
  const currentLearning = learningSkills.filter(s => s.category === activeTab);

  const CREATE_ITEM_ID = '__create__';

  const canHelpOptions = skillsInCategory.filter(
    s =>
      !canHelpSkills.find(c => c.id === s.id) &&
      s.name.toLowerCase().includes(canHelpSearch.toLowerCase()),
  );
  const learningOptions = skillsInCategory.filter(
    s =>
      !learningSkills.find(c => c.id === s.id) &&
      s.name.toLowerCase().includes(learningSearch.toLowerCase()),
  );

  const showCreateInCanHelp =
    onCreateSkill &&
    canHelpSearch.trim() &&
    !skillsInCategory.find(
      s => s.name.toLowerCase() === canHelpSearch.trim().toLowerCase(),
    );

  const showCreateInLearning =
    onCreateSkill &&
    learningSearch.trim() &&
    !skillsInCategory.find(
      s => s.name.toLowerCase() === learningSearch.trim().toLowerCase(),
    );

  const renderColumn = (
    column: 'can_help' | 'learning',
    label: string,
    currentSkills: Skill[],
    options: Skill[],
    searchValue: string,
    setSearch: (v: string) => void,
    showCreate: boolean | undefined,
  ) => {
    const isFormActive =
      skillFormState.mode !== 'idle' && skillFormState.column === column;
    const formPrefill =
      skillFormState.mode === 'create'
        ? { name: skillFormState.prefill }
        : skillFormState.mode === 'edit'
        ? {
            name: skillFormState.skill.name,
            description: skillFormState.skill.description,
          }
        : { name: '' };

    return (
      <Flex direction="column">
        <Text
          variant="title-x-small"
          weight="bold"
          style={{ marginBottom: 'var(--bui-space-2)' }}
        >
          {label}
        </Text>

        {currentSkills.length > 0 && (
          <Flex
            style={{
              flexWrap: 'wrap',
              gap: 'var(--bui-space-1)',
              marginBottom: 'var(--bui-space-2)',
            }}
          >
            {currentSkills.map(skill => (
              <Flex key={skill.id} align="center" style={{ gap: 4 }}>
                <TagGroup
                  aria-label={`${label} skill ${skill.name}`}
                  onRemove={() => {
                    if (column === 'can_help') {
                      setCanHelpSkills(prev =>
                        prev.filter(s => s.id !== skill.id),
                      );
                    } else {
                      setLearningSkills(prev =>
                        prev.filter(s => s.id !== skill.id),
                      );
                    }
                  }}
                >
                  <Tag key={skill.id} id={skill.id} size="small">
                    {skill.name}
                  </Tag>
                </TagGroup>
                {onUpdateSkill && (
                  <Button
                    variant="tertiary"
                    onPress={() => {
                      setSkillFormState({ mode: 'edit', skill, column });
                      setFormError(undefined);
                    }}
                    aria-label={`Edit ${skill.name}`}
                    style={{ padding: '2px', minWidth: 0 }}
                  >
                    <RiEditLine size={12} />
                  </Button>
                )}
              </Flex>
            ))}
          </Flex>
        )}

        {isFormActive ? (
          <SkillForm
            prefill={formPrefill}
            category={activeTab}
            onSave={data => handleFormSave(column, data)}
            onCancel={closeForm}
            saving={formSaving}
            error={formError}
          />
        ) : (
          <SearchAutocomplete
            aria-label={`Add a skill — ${label}`}
            placeholder="Add a skill..."
            inputValue={searchValue}
            onInputChange={setSearch}
          >
            {[
              ...options.map(skill => (
                <SearchAutocompleteItem
                  key={skill.id}
                  id={skill.id}
                  textValue={skill.name}
                  onAction={() => {
                    if (column === 'can_help') {
                      setCanHelpSkills(prev => [...prev, skill]);
                      setCanHelpSearch('');
                    } else {
                      setLearningSkills(prev => [...prev, skill]);
                      setLearningSearch('');
                    }
                  }}
                >
                  {skill.name}
                </SearchAutocompleteItem>
              )),
              ...(showCreate
                ? [
                    <SearchAutocompleteItem
                      key={CREATE_ITEM_ID}
                      id={CREATE_ITEM_ID}
                      textValue={`+ Create "${searchValue.trim()}"`}
                      onAction={() => {
                        setSkillFormState({
                          mode: 'create',
                          column,
                          prefill: searchValue.trim(),
                        });
                        setFormError(undefined);
                      }}
                    >
                      + Create &ldquo;{searchValue.trim()}&rdquo;
                    </SearchAutocompleteItem>,
                  ]
                : []),
            ]}
          </SearchAutocomplete>
        )}
      </Flex>
    );
  };

  return (
    <DialogTrigger
      isOpen={open}
      onOpenChange={isOpen => {
        if (!isOpen) onClose();
      }}
    >
      <Dialog>
        <DialogHeader>Edit Your Skills</DialogHeader>
        <DialogBody>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={key => {
              setActiveTab(key as SkillCategory);
              closeForm();
            }}
          >
            <TabList>
              {CATEGORIES.map(cat => (
                <Tab key={cat} id={cat}>
                  {CATEGORY_LABELS[cat]}
                </Tab>
              ))}
            </TabList>

            {CATEGORIES.map(cat => (
              <TabPanel key={cat} id={cat}>
                <Flex direction="column" style={{ gap: 'var(--bui-space-4)' }}>
                  {renderColumn(
                    'can_help',
                    'I can help with',
                    currentCanHelp,
                    canHelpOptions,
                    canHelpSearch,
                    setCanHelpSearch,
                    showCreateInCanHelp,
                  )}
                  {renderColumn(
                    'learning',
                    'I am learning',
                    currentLearning,
                    learningOptions,
                    learningSearch,
                    setLearningSearch,
                    showCreateInLearning,
                  )}
                </Flex>
              </TabPanel>
            ))}
          </Tabs>
        </DialogBody>
        <DialogFooter>
          <Button variant="primary" onPress={handleSave}>
            Save
          </Button>
          <Button variant="secondary" slot="close" onPress={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </DialogTrigger>
  );
}
```

> **Note on `TagGroup` per-chip removal:** The existing pattern uses `onRemove` on a `TagGroup` wrapping multiple chips. The updated pattern wraps each chip in its own `TagGroup` so that the remove handler has direct access to the individual skill. The edit `Button` sits beside the `TagGroup`, outside it.

- [ ] **Step 2: Type-check**

```bash
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge
yarn tsc
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add plugins/skill-bridge-react/src/components/EditSkillsDialog.tsx
git commit -s -m "feat(react): add inline create/edit skill form to EditSkillsDialog"
```

---

### Task 8: Wire create/edit to `SkillBridgeProfileCard`

**Files:**

- Modify: `plugins/skill-bridge-react/src/components/SkillBridgeProfileCard.tsx`

**Interfaces:**

- Consumes: `api.createSkill`, `api.updateSkill` from Task 5; updated `EditSkillsDialogProps` from Task 7
- Produces: working inline create/edit flow on the entity profile card

- [ ] **Step 1: Update `SkillBridgeProfileCard` to make `allSkills` stateful and wire the callbacks**

Replace the entire contents of `plugins/skill-bridge-react/src/components/SkillBridgeProfileCard.tsx`:

```tsx
/*
 * Copyright 2026 Estehsan Tariq — Apache-2.0
 */

import { useState } from 'react';
import {
  Card,
  CardBody,
  Text,
  Flex,
  Avatar,
  Button,
  Link,
} from '@backstage/ui';
import { RiEditLine, RiMailLine } from '@remixicon/react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import type {
  Skill,
  UserSkill,
  SkillCategory,
  CreateSkillRequest,
  UpdateSkillRequest,
} from '@estehsaan/backstage-plugin-skill-bridge-common';
import { skillBridgeApiRef } from '../api/types';
import { SkillChip } from './SkillChip';
import { EditSkillsDialog } from './EditSkillsDialog';

const CATEGORY_ORDER: SkillCategory[] = [
  'discipline',
  'framework',
  'infrastructure',
  'language',
  'technique',
];

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  discipline: 'Discipline',
  framework: 'Frameworks',
  infrastructure: 'Infrastructure',
  language: 'Languages',
  technique: 'Techniques',
};

function groupSkillsByCategory(
  userSkills: UserSkill[],
  allSkills: Skill[],
  intent: UserSkill['intent'],
): Map<SkillCategory, Skill[]> {
  const map = new Map<SkillCategory, Skill[]>();
  for (const us of userSkills) {
    if (us.intent !== intent) continue;
    const skill = allSkills.find(s => s.id === us.skillId);
    if (!skill) continue;
    if (!map.has(skill.category)) {
      map.set(skill.category, []);
    }
    map.get(skill.category)!.push(skill);
  }
  return map;
}

/** @public */
export function SkillBridgeProfileCard() {
  const { entity } = useEntity();
  const api = useApi(skillBridgeApiRef);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  const userRef = `user:${entity.metadata.namespace || 'default'}/${
    entity.metadata.name
  }`;
  const profile = (entity.spec?.profile as Record<string, unknown>) || {};
  const displayName = (profile.displayName as string) || entity.metadata.name;
  const avatarUrl = profile.picture as string | undefined;
  const email = profile.email as string | undefined;

  useAsync(async () => {
    const result = await api.listSkills();
    setAllSkills(result.items);
  }, [api]);

  useAsync(async () => {
    const result = await api.getUserSkills(userRef);
    setUserSkills(result.items);
  }, [api, userRef]);

  const handleSaveSkills = async (skills: UserSkill[]) => {
    const result = await api.updateUserSkills(userRef, skills);
    setUserSkills(result.items);
  };

  const handleCreateSkill = async (req: CreateSkillRequest): Promise<Skill> => {
    const skill = await api.createSkill(req);
    const refreshed = await api.listSkills();
    setAllSkills(refreshed.items);
    return skill;
  };

  const handleUpdateSkill = async (
    id: string,
    updates: UpdateSkillRequest,
  ): Promise<Skill> => {
    const skill = await api.updateSkill(id, updates);
    const refreshed = await api.listSkills();
    setAllSkills(refreshed.items);
    return skill;
  };

  const canHelpGroups = groupSkillsByCategory(
    userSkills,
    allSkills,
    'can_help',
  );
  const learningGroups = groupSkillsByCategory(
    userSkills,
    allSkills,
    'learning',
  );

  const renderSkillGroups = (groups: Map<SkillCategory, Skill[]>) => {
    const hasAny = Array.from(groups.values()).some(arr => arr.length > 0);
    if (!hasAny) {
      return (
        <Text
          variant="body-small"
          color="secondary"
          style={{ fontStyle: 'italic' }}
        >
          No skills added yet
        </Text>
      );
    }
    return CATEGORY_ORDER.map(cat => {
      const skills = groups.get(cat) || [];
      if (skills.length === 0) return null;
      return (
        <Flex
          key={cat}
          direction="column"
          style={{ marginBottom: 'var(--bui-space-2)' }}
        >
          <Text
            variant="body-x-small"
            color="secondary"
            style={{
              textTransform: 'uppercase',
              marginBottom: 'var(--bui-space-1)',
            }}
          >
            {CATEGORY_LABELS[cat]}
          </Text>
          <Flex style={{ flexWrap: 'wrap', gap: 'var(--bui-space-1)' }}>
            {skills.map(skill => (
              <SkillChip
                key={skill.id}
                label={skill.name}
                category={skill.category}
              />
            ))}
          </Flex>
        </Flex>
      );
    });
  };

  return (
    <Card>
      <CardBody style={{ padding: 'var(--bui-space-4)' }}>
        {/* Header */}
        <Flex
          style={{
            gap: 'var(--bui-space-4)',
            marginBottom: 'var(--bui-space-4)',
          }}
        >
          <Avatar
            src={avatarUrl ?? ''}
            name={displayName}
            size="x-large"
            purpose="decoration"
          />
          <Flex direction="column" style={{ flex: 1 }}>
            <Text
              variant="title-medium"
              weight="bold"
              style={{ marginBottom: 'var(--bui-space-1)' }}
            >
              {displayName}
            </Text>
            {(entity.spec?.memberOf as string[])?.length > 0 && (
              <Text variant="body-small" color="secondary">
                {(entity.spec?.memberOf as string[]).join(', ')}
              </Text>
            )}
            <Flex
              style={{
                gap: 'var(--bui-space-4)',
                marginTop: 'var(--bui-space-2)',
                alignItems: 'center',
              }}
            >
              {email && (
                <Link
                  href={`mailto:${email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--bui-space-1)',
                  }}
                >
                  <RiMailLine size={14} />
                  {email}
                </Link>
              )}
            </Flex>
          </Flex>
        </Flex>

        <hr
          style={{
            border: 'none',
            borderTop: '1px solid var(--bui-border-1)',
            margin: 'var(--bui-space-4) 0',
          }}
        />

        {/* Can help with */}
        <Flex direction="column" style={{ marginTop: 'var(--bui-space-4)' }}>
          <Flex
            align="center"
            justify="between"
            style={{ marginBottom: 'var(--bui-space-2)' }}
          >
            <Text variant="title-small" weight="bold">
              I can help with
            </Text>
            <Button variant="tertiary" onPress={() => setDialogOpen(true)}>
              <RiEditLine size={14} />
              Edit Skills
            </Button>
          </Flex>
          {renderSkillGroups(canHelpGroups)}
        </Flex>

        {/* Learning */}
        <Flex direction="column" style={{ marginTop: 'var(--bui-space-4)' }}>
          <Text
            variant="title-small"
            weight="bold"
            style={{ marginBottom: 'var(--bui-space-2)' }}
          >
            I am learning
          </Text>
          {renderSkillGroups(learningGroups)}
        </Flex>
      </CardBody>

      <EditSkillsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveSkills}
        userRef={userRef}
        allSkills={allSkills}
        currentUserSkills={userSkills}
        onCreateSkill={handleCreateSkill}
        onUpdateSkill={handleUpdateSkill}
      />
    </Card>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge
yarn tsc
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add plugins/skill-bridge-react/src/components/SkillBridgeProfileCard.tsx
git commit -s -m "feat(react): wire createSkill and updateSkill callbacks to SkillBridgeProfileCard"
```

---

### Task 9: `SkillBridgeUserProfilePage`

**Files:**

- Create: `plugins/skill-bridge-react/src/components/SkillBridgeUserProfilePage.tsx`
- Modify: `plugins/skill-bridge-react/src/components/index.ts`
- Modify: `plugins/skill-bridge-react/src/index.ts`

**Interfaces:**

- Consumes: `api.getUserSkills`, `api.listSkills`, `api.createSkill`, `api.updateSkill`; `identityApiRef` from `@backstage/core-plugin-api`; `catalogApiRef` from `@backstage/plugin-catalog-react`; `useParams` from `react-router-dom`; `EditSkillsDialog` from Task 7
- Produces: `SkillBridgeUserProfilePage` — routable page component exported from the package

- [ ] **Step 1: Create `SkillBridgeUserProfilePage.tsx`**

Create `plugins/skill-bridge-react/src/components/SkillBridgeUserProfilePage.tsx`:

```tsx
/*
 * Copyright 2026 Estehsan Tariq — Apache-2.0
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page, Header, Content, HeaderLabel } from '@backstage/core-components';
import {
  Card,
  CardBody,
  Text,
  Flex,
  Avatar,
  Button,
  Link,
} from '@backstage/ui';
import { RiEditLine, RiMailLine } from '@remixicon/react';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useAsync } from 'react-use';
import type {
  Skill,
  UserSkill,
  SkillCategory,
  CreateSkillRequest,
  UpdateSkillRequest,
} from '@estehsaan/backstage-plugin-skill-bridge-common';
import { skillBridgeApiRef } from '../api/types';
import { SkillChip } from './SkillChip';
import { EditSkillsDialog } from './EditSkillsDialog';

const CATEGORY_ORDER: SkillCategory[] = [
  'discipline',
  'framework',
  'infrastructure',
  'language',
  'technique',
];

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  discipline: 'Discipline',
  framework: 'Frameworks',
  infrastructure: 'Infrastructure',
  language: 'Languages',
  technique: 'Techniques',
};

function groupSkillsByCategory(
  userSkills: UserSkill[],
  allSkills: Skill[],
  intent: UserSkill['intent'],
): Map<SkillCategory, Skill[]> {
  const map = new Map<SkillCategory, Skill[]>();
  for (const us of userSkills) {
    if (us.intent !== intent) continue;
    const skill = allSkills.find(s => s.id === us.skillId);
    if (!skill) continue;
    if (!map.has(skill.category)) map.set(skill.category, []);
    map.get(skill.category)!.push(skill);
  }
  return map;
}

/** @public */
export function SkillBridgeUserProfilePage() {
  const { userRef: rawUserRef } = useParams<{ userRef: string }>();
  const userRef = decodeURIComponent(rawUserRef ?? '');

  const api = useApi(skillBridgeApiRef);
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  // Logged-in user identity
  const { value: identity } = useAsync(
    () => identityApi.getBackstageIdentity(),
    [identityApi],
  );
  const currentUserRef = identity?.userEntityRef;
  const isOwnProfile = !!currentUserRef && currentUserRef === userRef;

  // Catalog entity for display info (best-effort)
  const { value: entity } = useAsync(
    async () => catalogApi.getEntityByRef(userRef),
    [catalogApi, userRef],
  );
  const profile = (entity?.spec?.profile as Record<string, unknown>) || {};
  const displayName =
    (profile.displayName as string) || entity?.metadata.name || userRef;
  const avatarUrl = profile.picture as string | undefined;
  const email = profile.email as string | undefined;
  const memberOf = (entity?.spec?.memberOf as string[]) || [];

  // Skills
  useAsync(async () => {
    const [skillsResult, userSkillsResult] = await Promise.all([
      api.listSkills(),
      api.getUserSkills(userRef),
    ]);
    setAllSkills(skillsResult.items);
    setUserSkills(userSkillsResult.items);
  }, [api, userRef]);

  const handleSaveSkills = async (skills: UserSkill[]) => {
    const result = await api.updateUserSkills(userRef, skills);
    setUserSkills(result.items);
  };

  const handleCreateSkill = async (req: CreateSkillRequest): Promise<Skill> => {
    const skill = await api.createSkill(req);
    const refreshed = await api.listSkills();
    setAllSkills(refreshed.items);
    return skill;
  };

  const handleUpdateSkill = async (
    id: string,
    updates: UpdateSkillRequest,
  ): Promise<Skill> => {
    const skill = await api.updateSkill(id, updates);
    const refreshed = await api.listSkills();
    setAllSkills(refreshed.items);
    return skill;
  };

  const canHelpGroups = groupSkillsByCategory(
    userSkills,
    allSkills,
    'can_help',
  );
  const learningGroups = groupSkillsByCategory(
    userSkills,
    allSkills,
    'learning',
  );

  const renderSkillGroups = (groups: Map<SkillCategory, Skill[]>) => {
    const hasAny = Array.from(groups.values()).some(arr => arr.length > 0);
    if (!hasAny) {
      return (
        <Text
          variant="body-small"
          color="secondary"
          style={{ fontStyle: 'italic' }}
        >
          No skills added yet
        </Text>
      );
    }
    return CATEGORY_ORDER.map(cat => {
      const skills = groups.get(cat) || [];
      if (skills.length === 0) return null;
      return (
        <Flex
          key={cat}
          direction="column"
          style={{ marginBottom: 'var(--bui-space-2)' }}
        >
          <Text
            variant="body-x-small"
            color="secondary"
            style={{
              textTransform: 'uppercase',
              marginBottom: 'var(--bui-space-1)',
            }}
          >
            {CATEGORY_LABELS[cat]}
          </Text>
          <Flex style={{ flexWrap: 'wrap', gap: 'var(--bui-space-1)' }}>
            {skills.map(skill => (
              <SkillChip
                key={skill.id}
                label={skill.name}
                category={skill.category}
              />
            ))}
          </Flex>
        </Flex>
      );
    });
  };

  return (
    <Page themeId="tool">
      <Header title={displayName} subtitle="Skill Bridge Profile">
        <HeaderLabel label="Platform" value="Internal" />
      </Header>
      <Content>
        <Card style={{ maxWidth: 700 }}>
          <CardBody style={{ padding: 'var(--bui-space-4)' }}>
            {/* Header row */}
            <Flex
              style={{
                gap: 'var(--bui-space-4)',
                marginBottom: 'var(--bui-space-4)',
              }}
            >
              <Avatar
                src={avatarUrl ?? ''}
                name={displayName}
                size="x-large"
                purpose="decoration"
              />
              <Flex direction="column" style={{ flex: 1 }}>
                <Text
                  variant="title-medium"
                  weight="bold"
                  style={{ marginBottom: 'var(--bui-space-1)' }}
                >
                  {displayName}
                </Text>
                {memberOf.length > 0 && (
                  <Text variant="body-small" color="secondary">
                    {memberOf.join(', ')}
                  </Text>
                )}
                {email && (
                  <Flex style={{ marginTop: 'var(--bui-space-2)' }}>
                    <Link
                      href={`mailto:${email}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--bui-space-1)',
                      }}
                    >
                      <RiMailLine size={14} />
                      {email}
                    </Link>
                  </Flex>
                )}
              </Flex>
              {isOwnProfile && (
                <Button variant="tertiary" onPress={() => setDialogOpen(true)}>
                  <RiEditLine size={14} />
                  Edit Skills
                </Button>
              )}
            </Flex>

            <hr
              style={{
                border: 'none',
                borderTop: '1px solid var(--bui-border-1)',
                margin: 'var(--bui-space-4) 0',
              }}
            />

            {/* Skills */}
            <Flex direction="column" style={{ gap: 'var(--bui-space-4)' }}>
              <Flex direction="column">
                <Text
                  variant="title-small"
                  weight="bold"
                  style={{ marginBottom: 'var(--bui-space-2)' }}
                >
                  I can help with
                </Text>
                {renderSkillGroups(canHelpGroups)}
              </Flex>
              <Flex direction="column">
                <Text
                  variant="title-small"
                  weight="bold"
                  style={{ marginBottom: 'var(--bui-space-2)' }}
                >
                  I am learning
                </Text>
                {renderSkillGroups(learningGroups)}
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        {isOwnProfile && (
          <EditSkillsDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSave={handleSaveSkills}
            userRef={userRef}
            allSkills={allSkills}
            currentUserSkills={userSkills}
            onCreateSkill={handleCreateSkill}
            onUpdateSkill={handleUpdateSkill}
          />
        )}
      </Content>
    </Page>
  );
}
```

- [ ] **Step 2: Export from `components/index.ts`**

Add to `plugins/skill-bridge-react/src/components/index.ts`:

```ts
export { SkillBridgeUserProfilePage } from './SkillBridgeUserProfilePage';
```

- [ ] **Step 3: Export from package `index.ts`**

Add to `plugins/skill-bridge-react/src/index.ts`:

```ts
export {
  SkillChip,
  SkillSearchBar,
  UserCard,
  PostCard,
  EditSkillsDialog,
  CreatePostDialog,
  SkillBridgeProfileCard,
  SkillBridgeHomePage,
  SkillBridgeUserProfilePage, // ← new
  MentorPage,
  HackPage,
} from './components';
```

- [ ] **Step 4: Type-check**

```bash
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge
yarn tsc
```

Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add plugins/skill-bridge-react/src/components/SkillBridgeUserProfilePage.tsx \
        plugins/skill-bridge-react/src/components/index.ts \
        plugins/skill-bridge-react/src/index.ts
git commit -s -m "feat(react): add SkillBridgeUserProfilePage standalone profile page"
```

---

### Task 10: Route wiring, plugin extensions, and home page navigation

**Files:**

- Modify: `plugins/skill-bridge/src/routes.ts`
- Modify: `plugins/skill-bridge/src/plugin.tsx`
- Modify: `plugins/skill-bridge-react/src/components/SkillBridgeHomePage.tsx`

**Interfaces:**

- Consumes: `SkillBridgeUserProfilePage` exported in Task 9; `rootRouteRef` from existing `routes.ts`
- Produces:

  - New route `/skill-bridge/users/:userRef`
  - Clickable `UserCard`s in home page navigating to profile
  - "My Profile" button in home page header

- [ ] **Step 1: Add `userProfileRouteRef` to `routes.ts`**

Open `plugins/skill-bridge/src/routes.ts`. Replace with:

```ts
/*
 * Copyright 2026 Estehsan Tariq — Apache-2.0
 */

import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

/** @public */
export const rootRouteRef = createRouteRef({
  id: 'skill-bridge',
});

/** @public */
export const mentorRouteRef = createRouteRef({
  id: 'skill-bridge:mentor',
});

/** @public */
export const hackRouteRef = createRouteRef({
  id: 'skill-bridge:hack',
});

/** @public */
export const userProfileRouteRef = createSubRouteRef({
  id: 'skill-bridge:user-profile',
  parent: rootRouteRef,
  path: '/users/:userRef',
});
```

- [ ] **Step 2: Register the profile page in `plugin.tsx`**

Open `plugins/skill-bridge/src/plugin.tsx`. Add the new page extension (NFS) inside the `extensions` array, and add `userProfile` to the `routes` map. Also add a legacy routable extension.

Add this import at the top (it already has JSX imports):

```ts
import { userProfileRouteRef } from './routes';
```

Add the NFS page extension after `SkillBridgeHackPageExtension`:

```ts
/**
 * User profile page extension.
 * @public
 */
export const SkillBridgeUserProfilePageExtension = PageBlueprint.make({
  name: 'user-profile',
  params: {
    path: '/skill-bridge/users/:userRef',
    routeRef: userProfileRouteRef,
    loader: () =>
      import('@estehsaan/backstage-plugin-skill-bridge-react').then(m => (
        <m.SkillBridgeUserProfilePage />
      )),
  },
});
```

Update `skillBridgePlugin` routes and extensions:

```ts
export const skillBridgePlugin: ReturnType<typeof createFrontendPlugin> =
  createFrontendPlugin({
    pluginId: 'skill-bridge',
    info: { packageJson: () => import('../package.json') },
    routes: {
      root: rootRouteRef,
      mentor: mentorRouteRef,
      hack: hackRouteRef,
      userProfile: userProfileRouteRef, // ← new
    },
    extensions: [
      SkillBridgeApi,
      SkillBridgeHomePageExtension,
      SkillBridgeMentorPageExtension,
      SkillBridgeHackPageExtension,
      SkillBridgeUserProfilePageExtension, // ← new
      SkillBridgeNavItem,
      EntityUserSkillBridgeContent,
    ],
  });
```

Add legacy extension after the existing `EntityUserSkillBridgeCard`:

```ts
/**
 * Routable extension for the user profile page (legacy).
 * @public
 */
export const SkillBridgeUserProfilePage = legacySkillBridgePlugin.provide(
  createRoutableExtension({
    name: 'SkillBridgeUserProfilePage',
    component: () =>
      import('@estehsaan/backstage-plugin-skill-bridge-react').then(
        m => m.SkillBridgeUserProfilePage,
      ),
    mountPoint: userProfileRouteRef,
  }),
);
```

Also update the legacy plugin's routes:

```ts
export const legacySkillBridgePlugin = createPlugin({
  id: 'skill-bridge',
  routes: {
    root: rootRouteRef,
    mentor: mentorRouteRef,
    hack: hackRouteRef,
    userProfile: userProfileRouteRef, // ← new
  },
  // ... apis unchanged
});
```

- [ ] **Step 3: Add profile navigation to `SkillBridgeHomePage`**

Replace the entire contents of `plugins/skill-bridge-react/src/components/SkillBridgeHomePage.tsx`:

```tsx
/*
 * Copyright 2026 Estehsan Tariq — Apache-2.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, Header, Page, HeaderLabel } from '@backstage/core-components';
import { Grid, Text, Flex, Button } from '@backstage/ui';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import type { Skill } from '@estehsaan/backstage-plugin-skill-bridge-common';
import { skillBridgeApiRef } from '../api/types';
import { SkillSearchBar } from './SkillSearchBar';
import { UserCard } from './UserCard';

/** @public */
export function SkillBridgeHomePage() {
  const api = useApi(skillBridgeApiRef);
  const identityApi = useApi(identityApiRef);
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const { value: allSkills = [], loading: skillsLoading } = useAsync(
    async () => (await api.listSkills()).items,
    [api],
  );

  const { value: searchResults, loading: searchLoading } =
    useAsync(async () => {
      const skillIds = selectedSkills.map(s => s.id);
      return api.searchPeople({
        skillIds: skillIds.length > 0 ? skillIds : undefined,
      });
    }, [api, selectedSkills]);

  const { value: identity } = useAsync(
    () => identityApi.getBackstageIdentity(),
    [identityApi],
  );

  const people = searchResults?.items || [];

  const navigateToProfile = (userRef: string) => {
    navigate(`/skill-bridge/users/${encodeURIComponent(userRef)}`);
  };

  return (
    <Page themeId="tool">
      <Header title="Skill Bridge" subtitle="Find people who can help">
        <HeaderLabel label="Platform" value="Internal" />
        {identity?.userEntityRef && (
          <Button
            variant="tertiary"
            onPress={() => navigateToProfile(identity.userEntityRef)}
          >
            My Profile
          </Button>
        )}
      </Header>
      <Content>
        <Flex
          direction="column"
          style={{ maxWidth: 600, marginBottom: 'var(--bui-space-6)' }}
        >
          <SkillSearchBar
            skills={allSkills}
            selectedSkills={selectedSkills}
            onChange={setSelectedSkills}
            loading={skillsLoading}
            placeholder="Search by skills..."
          />
        </Flex>

        <Text
          variant="title-small"
          weight="bold"
          style={{ marginBottom: 'var(--bui-space-4)' }}
        >
          {selectedSkills.length > 0
            ? `People with matching skills (${people.length})`
            : `All people with skills (${people.length})`}
        </Text>

        {people.length === 0 && !searchLoading ? (
          <Text
            variant="body-medium"
            color="secondary"
            style={{ textAlign: 'center', padding: 'var(--bui-space-8)' }}
          >
            No people found matching your criteria
          </Text>
        ) : (
          <Grid.Root columns={{ sm: '12' }} gap="4">
            {people.map(person => (
              <Grid.Item
                colSpan={{ sm: '12', md: '6', lg: '3' }}
                key={person.userRef}
              >
                <UserCard
                  userRef={person.userRef}
                  displayName={person.displayName}
                  avatarUrl={person.avatarUrl}
                  matchedSkills={person.matchedSkills}
                  onClick={() => navigateToProfile(person.userRef)}
                />
              </Grid.Item>
            ))}
          </Grid.Root>
        )}
      </Content>
    </Page>
  );
}
```

- [ ] **Step 4: Type-check**

```bash
cd /Users/estehsan/Documents/Coders/SAS/Back/backstage/plugins/backstage-plugin-skill-bridge/workspaces/skill-bridge
yarn tsc
```

Expected: zero errors.

- [ ] **Step 5: Run all backend tests one final time**

```bash
CI=1 yarn test plugins/skill-bridge-backend
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add plugins/skill-bridge/src/routes.ts \
        plugins/skill-bridge/src/plugin.tsx \
        plugins/skill-bridge-react/src/components/SkillBridgeHomePage.tsx
git commit -s -m "feat: wire userProfileRouteRef, profile page extension, and home page navigation"
```

---

## Summary of all changed files

| Package                | File                                            | Change                                                           |
| ---------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| `skill-bridge-common`  | `src/types.ts`                                  | `Skill.description?`, `CreateSkillRequest`, `UpdateSkillRequest` |
| `skill-bridge-backend` | `migrations/002_add_skill_description.js`       | New migration                                                    |
| `skill-bridge-backend` | `src/service/DatabaseSkillBridgeStore.ts`       | `createSkill`, `updateSkill`, description in list/get            |
| `skill-bridge-backend` | `src/service/router.ts`                         | `POST /skills`, `PATCH /skills/:id`                              |
| `skill-bridge-backend` | `src/service/router.test.ts`                    | Tests for new routes                                             |
| `skill-bridge-react`   | `src/api/types.ts`                              | `createSkill`, `updateSkill` on interface                        |
| `skill-bridge-react`   | `src/api/SkillBridgeClient.ts`                  | Implement new methods                                            |
| `skill-bridge-react`   | `src/components/SkillForm.tsx`                  | **New** inline form component                                    |
| `skill-bridge-react`   | `src/components/EditSkillsDialog.tsx`           | `skillFormState`, `+ Create`, edit icons                         |
| `skill-bridge-react`   | `src/components/SkillBridgeProfileCard.tsx`     | Stateful `allSkills`, wire callbacks                             |
| `skill-bridge-react`   | `src/components/SkillBridgeUserProfilePage.tsx` | **New** profile page                                             |
| `skill-bridge-react`   | `src/components/index.ts`                       | Export new page                                                  |
| `skill-bridge-react`   | `src/index.ts`                                  | Export new page                                                  |
| `skill-bridge-react`   | `src/components/SkillBridgeHomePage.tsx`        | Navigate on card click, My Profile button                        |
| `skill-bridge`         | `src/routes.ts`                                 | `userProfileRouteRef`                                            |
| `skill-bridge`         | `src/plugin.tsx`                                | NFS page blueprint + legacy extension                            |
