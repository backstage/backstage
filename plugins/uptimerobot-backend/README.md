# UptimeRobot Plugin Backend

A Backstage backend plugin that provides integration with UptimeRobot monitoring service.

## Features

- REST API endpoints for UptimeRobot data
- Health check endpoint
- Secure API key configuration
- Error handling and logging

## API Endpoints

### GET /api/uptimerobot/health

Returns the health status of the plugin.

**Response:**
```json
{
  "status": "ok"
}
```

### GET /api/uptimerobot/monitors

Fetches all monitors from UptimeRobot API.

**Response:** Returns the UptimeRobot API response as-is.

Example response:
```json
{
  "stat": "ok",
  "pagination": {
    "offset": 0,
    "limit": 50,
    "total": 10
  },
  "monitors": [
    {
      "id": 12345,
      "friendly_name": "My Website",
      "url": "https://example.com",
      "type": 1,
      "status": 2,
      "interval": 300
    }
  ]
}
```

## Configuration

Configure the plugin in your `app-config.yaml`:

```yaml
uptimerobot:
  apiKey: ${UPTIMEROBOT_API_KEY}
```

## Error Handling

The plugin handles the following error scenarios:

1. **Missing API Key**: Returns 500 with configuration error message
2. **UptimeRobot API Errors**: Returns the same status code with error details
3. **Network Errors**: Returns 500 with generic error message

## Security

- API key is stored securely using Backstage configuration system
- API key is marked as secret in the config schema
- No API key information is logged or exposed in responses

## Development

To test the backend plugin locally:

```bash
cd plugins/uptimerobot-backend
yarn start
```

The plugin will be available at `http://localhost:7007/api/uptimerobot`