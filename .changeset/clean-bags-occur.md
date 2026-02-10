---
'@backstage/ui': minor
---

**BREAKING**: Replaced `Surface` / `onSurface` system with new provider/consumer background system

The old `Surface` type (`'0'`–`'3'`, `'auto'`) and its associated props (`surface`, `onSurface`) have been replaced by a provider/consumer `bg` architecture.

**Types:**

- `ContainerBg` — `'neutral-1'` | `'neutral-2'` | `'neutral-3'` | `'danger'` | `'warning'` | `'success'`
- `ProviderBg` — `ContainerBg | 'neutral-auto'`

There is no `neutral-4` prop value; containers are capped at `neutral-3`. Consumer components (e.g. Button) inherit the parent's `bg` via `data-on-bg`, and CSS handles the visual step-up.

**Hooks:**

- `useBgProvider(bg?)` — for provider components. Returns `{ bg: undefined }` when no `bg` is given (transparent). Supports `'neutral-auto'` to auto-increment from the parent context.
- `useBgConsumer()` — for consumer components. Returns the parent container's `bg` unchanged.
- The old `useBg` hook and `UseBgOptions` interface have been removed.

**Component roles:**

- **Provider-only** (Box, Flex, Grid): set `data-bg`, wrap children in `BgProvider`. Transparent by default.
- **Consumer-only** (Button, ButtonIcon, ButtonLink): set `data-on-bg`, inherit from parent.
- **Provider + Consumer** (Card): sets both `data-bg` and `data-on-bg`, wraps children. Defaults to `neutral-auto`.

**Migration:**

Rename the `surface` prop to `bg` on provider components and update values:

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

Remove `onSurface` from consumer components — they now always inherit from the parent container:

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
+ import type { ContainerBg, ProviderBg } from '@backstage/ui';
```

Replace hook usage in custom components:

```diff
- import { useSurface, SurfaceProvider } from '@backstage/ui';
+ import { useBgProvider, useBgConsumer, BgProvider } from '@backstage/ui';

- const { surface } = useSurface({ surface: props.surface });
+ const { bg } = useBgProvider(props.bg);

- const { surface } = useSurface({ onSurface: props.onSurface });
+ const { bg } = useBgConsumer();
```

Update CSS selectors targeting surface data attributes:

```diff
- [data-surface='1'] { ... }
+ [data-bg='neutral-1'] { ... }

- [data-on-surface='1'] { ... }
+ [data-on-bg='neutral-1'] { ... }
```

Note: Provider components use `data-bg` (values: `neutral-1` through `neutral-3`, plus intents). Consumer components use `data-on-bg`, which reflects the parent container's bg directly (no auto-increment).

**Affected components:** Box, Button, ButtonIcon, ButtonLink, ToggleButton, Card, Flex, Grid
