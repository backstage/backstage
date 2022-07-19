# Apache Airflow Plugin

Welcome to the apache-airflow plugin!

This plugin serves as frontend to the REST API exposed by Apache Airflow.  
Note only [Airflow v2 (and later)](https://airflow.apache.org/docs/apache-airflow/stable/deprecated-rest-api-ref.html) integrate with the plugin.

## Feature Requests & Ideas

- [ ] Add support for running multiple instances of Airflow for monitoring
      various deployment stages or business domains. ([Suggested by @JGoldman110](https://github.com/backstage/backstage/issues/735#issuecomment-985063468))
- [ ] Make owner chips in the DAG table clickable, resolving to a user or group
      in the entity catalog. ([Suggested by @julioz](https://github.com/backstage/backstage/pull/8348#discussion_r764766295))

## Installation

1. Install the plugin with `yarn` in the root of your Backstage directory

```sh
yarn --cwd packages/app add @backstage/plugin-apache-airflow
```

2. Import and use the plugin extension in `spp/src/App.tsx`

```diff
--- a/packages/app/src/App.tsx
+++ b/packages/app/src/App.tsx
@@ -86,6 +86,7 @@ import { providers } from './identityProviders';
 import * as plugins from './plugins';

 import { techDocsPage } from './components/techdocs/TechDocsPage';
+import { ApacheAirflowPage } from '@backstage/plugin-apache-airflow';

 const app = createApp({
   apis,
@@ -203,6 +204,7 @@ const routes = (
       element={<CostInsightsLabelDataflowInstructionsPage />}
     />
     <Route path="/settings" element={<UserSettingsPage />} />
+    <Route path="/apache-airflow" element={<ApacheAirflowPage />} />
   </FlatRoutes>
 );
```

If you just want to embed the DAGs into an existing page, you can use the `ApacheAirflowDagTable`

```tsx
import { ApacheAirflowDagTable } from '@backstage/plugin-apache-airflow';

export function SomeEntityPage(): JSX.Element {
  return (
    <Grid item md={6} xs={12}>
      <ApacheAirflowDagTable
        dagIds={[
          'example_bash_operator',
          'example_branch_datetime_operator_2',
          'example_branch_labels',
        ]}
      />
    </Grid>
  );
}
```

## Configuration

For links to the Airflow instance, the `baseUrl` must be defined in
`app-config.yaml`.

```yaml
apacheAirflow:
  baseUrl: https://your.airflow.instance.com
```

This plugin uses the Backstage proxy to securely communicate with the Apache
Airflow API. Add the following to your `app-config.yaml` to enable this
configuration:

```yaml
proxy:
  '/airflow':
    target: https://your.airflow.instance.com/api/v1
    headers:
      Authorization: ${AIRFLOW_BASIC_AUTH_HEADER}
```

In your production deployment of Backstage, you would also need to ensure that
you've set the `AIRFLOW_BASIC_AUTH_HEADER` environment variable before starting
the backend.

While working locally, you may wish to hard-code your API key in your
`app-config.local.yaml` like this:

```yaml
# app-config.local.yaml
proxy:
  '/airflow':
    target: http://localhost:8080/api/v1
    headers:
      Authorization: Basic YWlyZmxvdzphaXJmbG93
```

Where the basic authorization token is the base64 encoding of the username and
password of your instance.

```sh
echo -n "airflow:airflow" | base64 -w0
```

## Development

For local development, you can setup a local Airflow instance for development
purposes by [running Airflow with Docker Compose][2].

To verify that Airflow is running, and the API is functioning as expected, you
can run the following `curl` command:

```sh
curl -X GET \
    --user "airflow:airflow" \
    localhost:8080/api/v1/dags
```

To run the Backstage proxy, you will have to run start the `example-backend`
plugin.

```sh
yarn workspace example-backend start
```

To verify that the proxy is configured correctly, you can curl the Backstage
proxy endpoint. If using basic authentication, you will have to base64 encode
the username and password:

```sh
curl http://localhost:7007/api/proxy/airflow/dags
```

And finally, to run an instance of this plugin, you can run:

```sh
yarn start
```

[1]: https://airflow.apache.org/docs/apache-airflow/stable/security/api.html
[2]: https://airflow.apache.org/docs/apache-airflow/stable/start/docker.html
[3]: https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html
