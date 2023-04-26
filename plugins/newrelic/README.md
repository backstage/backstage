# New Relic Plugin (Alpha)

Website: [https://newrelic.com](https://newrelic.com)

<img src="./src/assets/img/newrelic-plugin-apm.png" alt="New Relic Plugin APM" />
<img src="./src/assets/img/newrelic-plugin-tools.png" alt="New Relic Plugin Tools" />

## Getting Started

This plugin uses the Backstage proxy to securely communicate with New Relic's
APIs.

1.  Add the following to your `app-config.yaml` to enable this configuration:

    For US region accounts

    ```yaml
    proxy:
      '/newrelic/apm/api':
        target: https://api.newrelic.com/v2
        headers:
          Api-Key: ${NEW_RELIC_API_KEY}
    ```

    For EU region accounts

    ```yaml
    proxy:
      '/newrelic/apm/api':
        target: https://api.eu.newrelic.com/v2
        headers:
          Api-Key: ${NEW_RELIC_API_KEY}
    ```

    There are multiple types of API keys in New Relic. For this plugin, the API key must be of the "User" type.
    In your production deployment of Backstage, you would also need to ensure that
    you've set the `NEW_RELIC_API_KEY` environment variable before starting
    the backend.

    While working locally, you may wish to hard-code your API key in your
    `app-config.local.yaml` like this:

    ```yaml
    # app-config.local.yaml
    proxy:
      '/newrelic/apm/api':
        headers:
          Api-Key: NRRA-YourActualApiKey
    ```

    Read more about how to find or generate this key in
    [New Relic's Documentation](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/).

    See if it's working by visiting the New Relic Plugin Path:
    [/newrelic](http://localhost:3000/newrelic)

2.  Add a dependency to your `packages/app/package.json`:
    ```sh
    # From your Backstage root directory
    yarn add --cwd packages/app @backstage/plugin-newrelic
    ```
3.  Add the `NewRelicPage` to your `packages/app/src/App.tsx`:

    ```tsx
    <FlatRoutes>
      …
      <Route path="/newrelic" element={<NewRelicPage />} />
    </FlatRoutes>
    ```

4.  Add link to New Relic to your sidebar

    ```typescript
    // packages/app/src/components/Root/Root.tsx
     import ExtensionIcon from '@material-ui/icons/ExtensionOutlined';

     ...

     export const Root = ({ children }: PropsWithChildren<{}>) => (
       <SidebarPage>
         <Sidebar>
           ...
           <SidebarItem icon={ExtensionIcon} to="newrelic" text="New Relic" />
           ...
         </Sidebar>
       </SidebarPage>
     );

    ```

5.  Navigate to your.domain.com/newrelic.

    At this step you must be able to see a page like that
    <img src="./src/assets/img/newrelic-plugin-apm.png" alt="New Relic Plugin APM" />

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
- Currently does not support pagination of results from the New Relic API.

---

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
