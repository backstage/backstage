# New Relic Plugin (Alpha)

Website: [https://newrelic.com](https://newrelic.com)

<img src="./src/assets/img/newrelic-plugin-apm.png" alt="New Relic Plugin APM" />
<img src="./src/assets/img/newrelic-plugin-tools.png" alt="New Relic Plugin Tools" />

## Getting Started

Add New Relic REST API Key to `app-config.yaml`

```yaml
newrelic:
  api:
    baseUrl: 'https://api.newrelic.com/v2'
    key: <NEW_RELIC_REST_API_KEY>
```

New Relic Plugin Path: [/newrelic](http://localhost:3000/newrelic)

## Features

- View New Relic Application Performance Monitoring (APM) data such as:
  - Application Name
  - Response Time (ms)
  - Throughput (rpm)
  - Error Rate
  - Instance Count
  - Apdex Score

## Limitations

- Currently only supports New Relic APM data

---

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
