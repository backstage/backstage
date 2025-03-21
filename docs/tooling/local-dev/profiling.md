---
id: profiling
title: Profiling Backstage
description: Finding performance bottlenecks in your Backstage application
---

Profiling can help you find performance bottlenecks in your code. This guide will show you how to profile
both the backend and frontend of your Backstage application.

## Backend

To profile the backend, start the backend with the `--inspect` flag:

```shell
yarn workspace backend start --inspect
# or `yarn workspace example-backend start --inspect` in this repository
```

Next you can use the Chrome DevTools to profile the backend by navigating to `chrome://inspect` and
clicking the `Open dedicated DevTools for Node` link.

In the `Performance` tab, you can start a new recording by clicking the `Start` button. After you
have recorded some data, you can stop the recording by clicking the `Stop` button. The recording
will show you a flame graph of the backend's execution, which can help you identify performance issues.

You can also use the `Memory` tab to profile the backend's memory usage and find potential memory leaks.

It's recommended to start profiling with short periods of time to avoid too much data being collected.

### Stress testing

To get more out of profiling, you might want to introduce additional load to your application with some tooling.
One such tool is called [AutoCannon](https://www.npmjs.com/package/autocannon) which can be used to stress test the
API endpoints of your application. You can install it globally with `npm install -g autocannon`.

To be able to access the API endpoints, you must configure a static token for the backend. In your
`app-config.yaml` file, add the following configuration:

```yaml
backend:
  auth:
    externalAccess:
      - type: static
        options:
          token: autocannon12345
          subject: autocannon
```

See more information in the [Service to Service Auth](../../auth/service-to-service-auth.md) documentation.
To run the stress test, you can use the following command:

```shell
autocannon -H "Authorization=Bearer autocannon12345" http://localhost:7007/api/catalog/entities
```

See more command options in the AutoCannon documentation.

## Frontend

Profiling the frontend can be done by using the `React DevTools` extension for Chrome or Firefox.
The extension is available for download from the Chrome Web Store or the Firefox Add-ons website.

To start profiling, start the application with `yarn dev` and open inspector in the browser. In the
`Profiler` tab (far to the right), click the `Start profiling` button to start recording. After
you have recorded some data by navigating through the page, click the `Stop profiling` button to stop the recording.
