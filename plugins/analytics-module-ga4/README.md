# Analytics Module: Google Analytics 4

This plugin provides an opinionated implementation of the Backstage Analytics
API for Google Analytics 4. Once installed and configured, analytics events will
be sent to GA as your users navigate and use your Backstage instance.

This plugin contains no other functionality.

## Installation

1. Install the plugin package in your Backstage app:

```sh
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-analytics-module-ga4
```

2. Wire up the API implementation to your App:

```tsx
// packages/app/src/apis.ts
import {
  analyticsApiRef,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { GoogleAnalytics4 } from '@backstage/plugin-analytics-module-ga4';

export const apis: AnyApiFactory[] = [
  // Instantiate and register the GA Analytics API Implementation.
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef, identityApi: identityApiRef },
    factory: ({ configApi, identityApi }) =>
      GoogleAnalytics4.fromConfig(configApi, {
        identityApi,
      }),
  }),
];
```

3. Configure the plugin in your `app-config.yaml`:

The following is the minimum configuration required to start sending analytics
events to GA. All that's needed is your GA4 measurement ID:

```yaml
# app-config.yaml
app:
  analytics:
    ga4:
      measurementId: G-0000000-0
```

4. Update CSP in your `app-config.yaml`:

The following is the minimal content security policy required to load scripts from GA.

```yaml
backend:
  csp:
    connect-src: ["'self'", 'http:', 'https:']
    # Add these two lines below
    script-src:
      [
        "'self'",
        "'unsafe-eval'",
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
      ]
    img-src: ["'self'", 'data:', 'https://www.google-analytics.com']
```

## Configuration

In order to be able to analyze usage of your Backstage instance by plugin, we recommend configuring [a content grouping](#enabling-content-grouping).
Additional dimensional data can be captured using custom dimensions, like this:

1. First, [configure the custom dimension in GA] [configure-custom-dimension].
   Be sure to set the Scope to `Event`, and name it `dimension1`.
2. Then, add a mapping to your `app.analytics.ga4` configuration that instructs
   the plugin to capture Plugin IDs on the custom dimension you just created.
   It should look like this:
3. `allowedContexts` config accepts array of string, where each entry is a context parameter that will be sent in the event.
   context names will be prefixed by `c_`.
4. `allowedAttributes` config accepts array of string, where each entry is an attribute that will be sent in the event.
   attribute names will be prefixed by `a_`.
5. `allowedContexts` and `allowedAttributes` are optional, if not provided, no additional context and attributes will be sent.
6. if `allowedContexts` or `allowedAttributes` is set to '\*', all context and attributes will be sent.
7. `enableSendPageView` is used to send default events and is disabled by default.

```yaml
app:
  analytics:
    ga4:
      measurementId: G-0000000-0
      allowedContexts: ['pluginId']
```

```yaml
app:
  analytics:
    ga4:
      allowedContexts: ['pluginId']
      allowedAttributes: ['someEventContextAttr']
```

### User IDs

This plugin supports accurately deriving user-oriented metrics (like monthly
active users) using Google Analytics' [user ID views][ga-user-id-view]. To
enable this...

1. Be sure you've gone through the process of setting up a user ID view in your
   Backstage instance's Google Analytics property (see docs linked above).
2. Make sure you instantiate `GoogleAnalytics` with an `identityApi` instance
   passed to it, as shown in the installation section above.
3. Set `app.analytics.ga4.identity` to either `required` or `optional` in your
   `app.config.yaml`, like this:

   ```yaml
   app:
     analytics:
       ga4:
         measurementId: G-0000000-0
         identity: optional
   ```

   Set `identity` to `optional` if you need accurate session counts, including
   cases where users do not sign in at all. Use `required` if you need all hits
   to be associated with a user ID without exception (and don't mind if some
   sessions are not captured, such as those where no sign in occur).

Note that, to comply with GA policies, the value of the User ID is
pseudonymized before being sent to GA. By default, it is a `sha256` hash of the
current user's `userEntityRef` as returned by the `identityApi`. To set a
different value, provide a `userIdTransform` function alongside `identityApi`
when you instantiate `GoogleAnalytics`. This function will be passed the
`userEntityRef` as an argument and should resolve to the value you wish to set
as the user ID. For example:

```typescript
import {
  analyticsApiRef,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { GoogleAnalytics } from '@backstage/plugin-analytics-module-ga';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef, identityApi: identityApiRef },
    factory: ({ configApi, identityApi }) =>
      GoogleAnalytics4.fromConfig(configApi, {
        identityApi,
        userIdTransform: async (userEntityRef: string): Promise<string> => {
          return customHashingFunction(userEntityRef);
        },
      }),
  }),
];
```

### Enabling content grouping

Content groups enable you to categorize pages and screens into custom buckets which you can see
metrics for related groups of information.
More about content grouping here [content groups][content-grouping].
It's recommended to enable content grouping by PluginId. `contentGrouping` supports `routeRef` and extension.

```yaml
app:
  analytics:
    ga4:
      contentGrouping: pluginId
```

Please note, content grouping takes 24hrs to show up in the Google Analytics dashboard.

### Debugging and Testing

In pre-production environments, you may wish to set additional configurations
to turn off reporting to Analytics and/or print debug statements to the
console. You can do so like this:

```yaml
app:
  analytics:
    ga4:
      testMode: true # Prevents data being sent to GA
      debug: true # Logs analytics event to the web console
```

You might commonly set the above in an `app-config.local.yaml` file, which is
normally `gitignore`'d but loaded and merged in when Backstage is bootstrapped.

## Development

If you would like to contribute improvements to this plugin, the easiest way to
make and test changes is to do the following:

1. Clone the main Backstage monorepo `git clone git@github.com:backstage/backstage.git`
2. Install all dependencies `yarn install`
3. If one does not exist, create an `app-config.local.yaml` file in the root of
   the monorepo and add config for this plugin (see below)
4. Enter this plugin's working directory: `cd plugins/analytics-provider-ga4`
5. Start the plugin in isolation: `yarn start`
6. Navigate to the playground page at `http://localhost:3000/ga4`
7. Open the web console to see events fire when you navigate or when you
   interact with instrumented components.

Code for the isolated version of the plugin can be found inside the [/dev](./dev)
directory. Changes to the plugin are hot-reloaded.

#### Recommended Dev Config

Paste this into your `app-config.local.yaml` while developing this plugin:

```yaml
app:
  analytics:
    ga4:
      measurementId: G-0000000-0
      debug: true
      testMode: true
      allowedContexts: ['pluginId']
```

[what-is-a-custom-dimension]: https://support.google.com/analytics/answer/2709828
[configure-custom-dimension]: https://support.google.com/analytics/answer/10075209?hl=en#
[ga-user-id-view]: https://support.google.com/analytics/answer/3123669
[content-grouping]: https://support.google.com/analytics/answer/11523339?hl=en
