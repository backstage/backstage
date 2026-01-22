# Backstage UI Changeset Creator

Interactive CLI tool for creating Backstage UI changesets with automatic documentation.

## Quick Start

```bash
yarn changeset-ui
```

This creates **two things** simultaneously:

1. **Standard changeset** in `.changeset/` - For the release workflow
2. **Entry in `changelogs/next.ts`** - For unreleased changes documentation

All pending changes accumulate in `next.ts` until release, when it's renamed to a versioned file.

## How It Works

### Step 1: Run the Tool

```bash
$ yarn changeset-ui

🎨 Backstage UI Changeset Creator
```

### Step 2: Select Bump Type

```
📊 What type of change is this?
(Use ↑/↓ arrows to navigate, Enter to confirm)

 ❯ patch - Bug fixes, small improvements
   minor - New features, breaking changes (for 0.x)
   major - Breaking changes (for 1.x+)

Selected: patch
```

### Step 3: Select Components

```
📦 Select the components affected by this change:
(Use ↑/↓ arrows to navigate, Space to select, Enter to confirm)

 ❯ ◉ button
   ○ avatar
   ○ card
   ...

Selected: button
```

**Controls:**

- `↑/↓` arrows to navigate
- `Space` to toggle selection
- `Enter` to confirm

### Step 4: Enter Description

```
📝 Enter a brief description of the change:
   Fixed button hover state in dark mode
```

### Step 5: Add Migration Notes (Optional)

````
📋 Does this change require migration notes? (y/N): y

✍️  Enter migration notes:
(Type "done" on a new line when finished, or "skip" to skip)

Update your Button imports:
```diff
- import { OldButton } from '@backstage/ui';
+ import { Button } from '@backstage/ui';
````

done

```

### Step 6: Files Created/Updated

```

✅ Changeset created successfully!
Changeset: .changeset/happy-dogs-jump.md
Changelog: docs-ui/src/utils/changelogs/next.ts
Type: patch
Components: button
Migration notes: Added inline

💡 Tip: Review both files before committing.

````

## Output Files

### 1. Changeset File (`.changeset/happy-dogs-jump.md`)

Standard changeset format:

```yaml
---
'@backstage/ui': patch
---

Fixed button hover state in dark mode

## Migration

Update your Button imports:
```diff
- import { OldButton } from '@backstage/ui';
+ import { Button } from '@backstage/ui';
````

````

### 2. Next Changelog (`docs-ui/src/utils/changelogs/next.ts`)

Accumulates all unreleased changes:

```typescript
import type { ChangelogProps } from '../types';

export const changelogNext: ChangelogProps[] = [
  {
    components: ['button'],
    version: 'next',
    description: `Fixed button hover state in dark mode

## Migration

Update your Button imports:
\`\`\`diff
- import { OldButton } from '@backstage/ui';
+ import { Button } from '@backstage/ui';
\`\`\``,
    type: 'fix',
  },
  // More entries appended here as developers create changesets
];
````

## Complete Workflow

### Development Phase (Developers)

1. Make changes to UI components
2. Run `yarn changeset-ui`
3. Follow interactive prompts
4. Commit generated/updated files:
   ```bash
   git add .changeset/happy-dogs-jump.md
   git add docs-ui/src/utils/changelogs/next.ts
   git add docs-ui/src/utils/changelog.ts  # If this is the first entry
   git commit -m "Add changeset for button hover fix"
   ```
5. Push PR

Multiple developers can add to `next.ts` in parallel - Git will handle merges.

### Release Phase (Maintainer)

When releasing version 0.12.0, use the helper command:

```bash
$ yarn changeset-ui:release

📦 Release Unreleased Changes

Found 5 entries in next.ts

Enter the version to release (e.g., 0.12.0): 0.12.0

✅ Created v0.12.0.ts with 5 entries
   Deleted next.ts
   Updated changelog.ts

📝 Next steps:
   1. Review the files
   2. Optionally add PR numbers to entries in v0.12.0.ts
   3. Commit the changes
```

**What it does:**

1. Renames `next.ts` → `v0.12.0.ts`
2. Updates export name: `changelogNext` → `changelog_0_12_0`
3. Updates all `version: 'next'` → `version: '0.12.0'`
4. Updates `changelog.ts` import and spread
5. Deletes `next.ts`

Then commit the changes. The next developer who runs `yarn changeset-ui` will create a fresh `next.ts`.

## Benefits

1. **Single unreleased file** - All pending changes in one place
2. **Easy to review** - See all upcoming changes at a glance
3. **Git-friendly** - Merge conflicts are manageable
4. **Simple release** - Just rename and update version numbers
5. **No manual imports** - First changeset sets up next.ts import automatically
6. **Clean changesets** - Standard format, works with changesets CLI

## Type Inference

The tool automatically sets the `type` field:

- **breaking**: major or minor bump
- **new**: Description starts with "New", "Add", or "Added"
- **fix**: patch bump
- **undefined**: Everything else

## Multiple Developers

If multiple PRs add entries to `next.ts`, Git will merge them automatically since they're appending to the same array. Just resolve any conflicts if they occur.

## Valid Component Names

```
avatar, box, button, button-link, button-icon, heading, text, icon,
tabs, menu, textfield, datatable, select, collapsible, accordion,
checkbox, container, link, tooltip, scrollarea, flex, switch, grid,
searchfield, radio-group, card, skeleton, header, header-page,
password-field, table, visually-hidden, dialog, tag-group
```

## Architecture

```
yarn changeset-ui
    ↓
Interactive prompts
    ↓
Create changeset: .changeset/happy-dogs-jump.md
    ↓
Append to: changelogs/next.ts
    ↓
Ensure next.ts imported in changelog.ts
    ↓
Ready to commit!

... Multiple developers add more entries ...

At release:
    Rename next.ts → v0.12.0.ts
    Update export name and version fields
    Update changelog.ts import
    Commit
```

## Commands

### Create Changeset

```bash
yarn changeset-ui
```

Interactive tool to create changesets and add to next.ts

### Release Changes

```bash
yarn changeset-ui:release
```

Helper to convert next.ts into a versioned file

## Files

- `index.js` - Main CLI script
- `organize-next.js` - Release helper script
- `get-valid-components.js` - Extracts component names from types.ts
- `README.md` - This file

## Tips

- **Review before committing** - Check both the changeset and next.ts
- **Migration notes** - Added inline in description with `## Migration` heading
- **Multiple changesets** - Each run appends to next.ts
- **PR numbers** - Add manually during release if desired
- **Merge conflicts** - Easy to resolve since entries are independent

## Troubleshooting

**Error: "Could not find Component type definition"**

- Make sure `docs-ui/src/utils/types.ts` exists

**Can't select components**

- Use `Space` to toggle, not `Enter`
- `Enter` confirms your selection

**Need to cancel**

- Press `Ctrl+C` at any time

## Manual Release Process (Alternative)

If you prefer to convert manually instead of using `yarn changeset-ui:release`:

```bash
# 1. Rename and edit
mv docs-ui/src/utils/changelogs/next.ts docs-ui/src/utils/changelogs/v0.12.0.ts
# Edit v0.12.0.ts: changelogNext → changelog_0_12_0, version: 'next' → '0.12.0'

# 2. Update changelog.ts imports

# 3. Commit
git add docs-ui/src/utils/changelogs/v0.12.0.ts
git add docs-ui/src/utils/changelog.ts
git commit -m "Release UI v0.12.0"
```
