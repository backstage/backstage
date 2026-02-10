---
'@backstage/ui': minor
---

**BREAKING**: Replaced `Surface` / `onSurface` system with new `ContainerBg` background system

The old `Surface` type (`'0'`–`'3'`, `'auto'`) and its associated props (`surface`, `onSurface`) have been replaced by `ContainerBg` — a union of `'neutral-1'` | `'neutral-2'` | `'neutral-3'` | `'danger'` | `'warning'` | `'success'`. There is no `neutral-4` value; containers are capped at `neutral-3`. Leaf components like Button no longer accept a `bg` prop — they inherit the parent container's `bg` via a `data-on-bg` attribute, and CSS handles the visual step-up to the next neutral level.

New `useBg` hook and `BgProvider` replace the deleted `useSurface` hook and `SurfaceProvider`.

**Migration:**

Rename the `surface` prop to `bg` on container components and update values:

```diff
- <Box surface="1">
+ <Box bg="neutral-1">

- <Card surface="2">
+ <Card bg="neutral-2">

- <Flex surface="0">
+ <Flex bg="neutral-1">

- <Grid.Root surface="1">
+ <Grid.Root bg="neutral-1">
```

Remove `onSurface` from leaf components — they now always inherit from the parent container and can no longer override the value:

```diff
- <Button onSurface="1" variant="secondary">
+ <Button variant="secondary">

- <ButtonIcon onSurface="2" variant="secondary" />
+ <ButtonIcon variant="secondary" />

- <ToggleButton onSurface="1">
+ <ToggleButton>
```

Update type imports:

```diff
- import type { Surface, LeafSurfaceProps, ContainerSurfaceProps } from '@backstage/ui';
+ import type { ContainerBg } from '@backstage/ui';
```

Replace hook usage in custom components:

```diff
- import { useSurface, SurfaceProvider } from '@backstage/ui';
+ import { useBg, BgProvider } from '@backstage/ui';

- const { surface } = useSurface({ surface: props.surface });
+ const { bg } = useBg({ mode: 'container', bg: props.bg });

- const { surface } = useSurface({ onSurface: props.onSurface });
+ const { bg } = useBg({ mode: 'leaf' });
```

Update CSS selectors targeting surface data attributes:

```diff
- [data-surface='1'] { ... }
+ [data-bg='neutral-1'] { ... }

- [data-on-surface='1'] { ... }
+ [data-on-bg='neutral-1'] { ... }
```

Note: Container components use `data-bg` (values: `neutral-1` through `neutral-3`, plus intents). Leaf components use `data-on-bg`, which reflects the parent container's bg directly (no auto-increment).

**Affected components:** Box, Button, ButtonIcon, ButtonLink, ToggleButton, Card, Flex, Grid
