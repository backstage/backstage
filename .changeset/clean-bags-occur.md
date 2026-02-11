---
'@backstage/ui': minor
---

**BREAKING**: Replaced `Surface` / `onSurface` system with new provider/consumer background system

The old `Surface` type (`'0'`–`'3'`, `'auto'`) and its associated props (`surface`, `onSurface`) have been replaced by a provider/consumer `bg` architecture.

**Types:**

- `ContainerBg` — `'neutral-1'` | `'neutral-2'` | `'neutral-3'` | `'danger'` | `'warning'` | `'success'`
- `ProviderBg` — `ContainerBg | 'neutral-auto'`

Consumer components (e.g. Button) inherit the parent's `bg` via `data-on-bg`, and CSS handles the visual step-up. See "Neutral level capping" below for details on how levels are bounded.

**Hooks:**

- `useBgProvider(bg?)` — for provider components. Returns `{ bg: undefined }` when no `bg` is given (transparent). Supports `'neutral-auto'` to auto-increment from the parent context.
- `useBgConsumer()` — for consumer components. Returns the parent container's `bg` unchanged.

**Component roles:**

- **Provider-only** (Box, Flex, Grid): set `data-bg`, wrap children in `BgProvider`. **Transparent by default** — they do _not_ auto-increment; pass `bg="neutral-auto"` explicitly if you want automatic neutral stepping.
- **Consumer-only** (Button, ButtonIcon, ButtonLink): set `data-on-bg`, inherit the parent container's `bg` unchanged.
- **Provider + Consumer** (Card): sets both `data-bg` and `data-on-bg`, wraps children. Card passes `bg="neutral-auto"` to its inner Box, so it auto-increments from the parent context.

**Neutral level capping:**

Provider components cap at `neutral-3`. There is no `neutral-4` prop value. The `neutral-4` level exists only in consumer component CSS — for example, a Button sitting on a `neutral-3` surface uses `neutral-4` tokens internally via `data-on-bg`.

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

Note: Provider components use `data-bg` (values: `neutral-1` through `neutral-3`, plus intent values). Consumer components use `data-on-bg`, which reflects the parent container's `bg` directly. The `neutral-4` level never appears as a prop or `data-bg` value — it is used only in consumer CSS.

**Affected components:** Box, Button, ButtonIcon, ButtonLink, ToggleButton, Card, Flex, Grid
