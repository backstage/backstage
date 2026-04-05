# @backstage/plugin-operational-zones-common

Common types and a pure zone resolver for the `operational-zones` plugin family.

## Types

- `ZoneLevel` — `'green' | 'yellow' | 'red'`
- `Zone` — A resolved zone with `id`, `level`, `label`, and optional `activeUntil`
- `ZoneSchedule` — Defines cron-based windows that activate zone levels
- `OperationalZoneService` — Service interface for resolving and registering zones

## Usage

```ts
import {
  resolveZoneFromSchedule,
  ZoneSchedule,
} from '@backstage/plugin-operational-zones-common';

const schedule: ZoneSchedule = {
  operationId: 'deploy-gate',
  defaultLevel: 'green',
  windows: [{ level: 'red', cron: '0 8 * * 1-5', durationMinutes: 600 }],
};

const zone = resolveZoneFromSchedule(schedule);
// => { id: 'deploy-gate', level: 'red', label: 'Operations blocked', activeUntil: ... }
```

## Integration Pattern

### Backend — gate an operation

```ts
const zone = await zoneService.resolve('my-plugin-upgrades');
if (zone.level === 'red') return; // abort silently
```

### Frontend — disable a button

```tsx
const { zone } = useOperationalZone('my-plugin-upgrades');
<Button disabled={zone?.level === 'red'}>Run Upgrade</Button>;
```
