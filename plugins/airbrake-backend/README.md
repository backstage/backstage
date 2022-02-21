# airbrake-backend

The Airbrake backend plugin provides a simple proxy to the Airbrake API while hiding away the secret API key from the frontend.

## How to use

See the [Airbrake plugin instructions](../airbrake/README.md#how-to-use).

## Local Development

This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.

1. Set the environment variable `AIRBRAKE_API_KEY` with your [API key](https://airbrake.io/docs/api/#authentication).
2. Run this plugin in standalone mode by running `yarn start`. The configuration is already setup in the root [`app-config.yaml`](../../app-config.yaml) to pick up your API key from the environment variable above.

Access it from http://localhost:7007/api/airbrake. Or use the Airbrake plugin which will talk to it automatically.

Here are some example endpoints:

- http://localhost:7007/api/airbrake/health
- http://localhost:7007/api/airbrake/api/v4/projects
