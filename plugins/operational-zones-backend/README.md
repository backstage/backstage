# @backstage/plugin-operational-zones-backend

Backend plugin for managing operational zones — a composable timing-aware primitive.

## Setup

Add the plugin to your backend in `packages/backend/src/index.ts`:

```ts
backend.add(import('@backstage/plugin-operational-zones-backend'));
```

## Configuration

Add zone schedules to your `app-config.yaml`:

```yaml
operationalZones:
  schedules:
    - operationId: backstage-upgrades
      defaultLevel: green
      windows:
        - level: red
          cron: '0 8 * * 1-5'
          durationMinutes: 600
        - level: green
          cron: '0 2 * * 6'
          durationMinutes: 360
```

## API

The plugin exposes a REST API at `/api/operational-zones`:

- `GET /zones` — list all zones with their current levels
- `GET /zones/:operationId` — resolve a single zone
- `POST /zones` — register a new schedule at runtime

## Backend Integration

Other backend plugins can consume the `OperationalZoneService` to gate their own operations:

```ts
const zone = await zoneService.resolve('my-plugin-upgrades');
if (zone.level === 'red') return; // abort silently
```
