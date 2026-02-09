---
'@backstage/ui': minor
---

**BREAKING**: Replaced `Surface` / `onSurface` system with new `ContainerBg` background system

The old `Surface` type (`'0'`–`'3'`, `'auto'`) and its associated props (`surface`, `onSurface`) have been replaced by a new `ContainerBg` type with semantic neutral levels (`'neutral-1'` through `'neutral-3'`) and intents (`'danger'`, `'warning'`, `'success'`). Containers are capped at `neutral-3`; the `neutral-4` level is reserved for leaf component CSS only. Leaf components like Button no longer need an explicit prop — they receive a `data-on-bg` attribute matching the parent container's bg, and CSS handles the visual step-up.

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

Remove `onSurface` from leaf components — it is now fully automatic:

```diff
- <Button onSurface="1" variant="secondary">
+ <Button variant="secondary">

- <ButtonIcon onSurface="2" variant="secondary" />
+ <ButtonIcon variant="secondary" />

- <ToggleButton onSurface="1">
+ <ToggleButton>
```

Alert no longer accepts a `surface` prop (its background is driven by `status`):

```diff
- <Alert surface="1" status="info" />
+ <Alert status="info" />
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

- [data-on-surface='2'] { ... }
+ [data-on-bg='neutral-1'] { ... }
```

Note: Container components use `data-bg` for their own background level. Leaf components now use `data-on-bg` which reflects the parent container's bg (not an auto-incremented value).

**Affected components:** Box, Button, ButtonIcon, ButtonLink, ToggleButton, Card, Alert, Flex, Grid
