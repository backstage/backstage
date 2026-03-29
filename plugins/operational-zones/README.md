# @backstage/plugin-operational-zones

Frontend plugin for displaying and consuming operational zones in Backstage.

## Setup

Install the plugin in your Backstage app:

```ts
// packages/app/src/App.tsx (or wherever your plugin setup lives)
import { operationalZonesPlugin } from '@backstage/plugin-operational-zones';
```

The plugin registers its API factory automatically when loaded.

## Components

### ZoneBadge

A standalone colored badge that renders a zone level. No API dependency — pass the level as a prop:

```tsx
import { ZoneBadge } from '@backstage/plugin-operational-zones';

<ZoneBadge level="red" />
<ZoneBadge level="green" label="All clear" />
```

### HomePageOperationalZonesCard

A homepage card showing all registered zones:

```tsx
import { HomePageOperationalZonesCard } from '@backstage/plugin-operational-zones';

<HomePageOperationalZonesCard />;
```

## Hooks

### useOperationalZone

```tsx
import { useOperationalZone } from '@backstage/plugin-operational-zones';

function MyComponent() {
  const { zone, loading, error } = useOperationalZone('deploy-gate');

  if (loading) return <Progress />;
  return <Button disabled={zone?.level === 'red'}>Deploy</Button>;
}
```

## API Reference

Export `operationalZoneApiRef` for consumers to inject or mock:

```tsx
import { operationalZoneApiRef } from '@backstage/plugin-operational-zones';
```
