# airbrake-backend

The Airbrake backend plugin provides a simple proxy to the Airbrake API while hiding away the secret API key from the frontend.

## How to use

See the [Airbrake plugin instructions](../airbrake/README.md#how-to-use).

## Local Development

1. Set the environment variable `AIRBRAKE_API_KEY` with your API key.
2. Run this plugin in standalone mode by running `yarn start`. The configuration is already setup in the root [`app-config.yaml`](../../app-config.yaml) to pick up your API key from the environment variable above.
3. Access it from [/airbrake-backend](http://localhost:7007/airbrake-backend). Or use the Airbrake plugin which will talk to it automatically when using the real API.

Here is an example endpoint: http://localhost:7007/airbrake-backend/health

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.

It is only meant for local development.
