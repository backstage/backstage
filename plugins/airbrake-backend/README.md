# airbrake-backend

The Airbrake backend plugin provides a simple proxy to the Airbrake API while hiding away the secret API key from the frontend.

## How to use

See the [Airbrake plugin instructions](../airbrake/README.md#how-to-use).

## Local Development

This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.

1. Add the required config to your `app-config.local.yaml`:

   ```yaml
   airbrake:
     apiKey: ${AIRBRAKE_API_KEY}
   ```

2. Set the environment variable `AIRBRAKE_API_KEY` with your [API
   key](https://airbrake.io/docs/api/#authentication). You can also write it
   directly into the config file above for convenience - but beware of
   accidentally leaking the key.

3. Go into the plugin's directory and run it in standalone mode by running `yarn start`.

Access it from http://localhost:7007/api/airbrake. Or use the [Airbrake plugin in standalone mode](../airbrake/README.md#local-development) which will talk to it automatically.

Here are some example endpoints:

- http://localhost:7007/api/airbrake/health
- http://localhost:7007/api/airbrake/api/v4/projects
