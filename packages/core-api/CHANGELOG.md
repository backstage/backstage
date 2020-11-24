# @backstage/core-api

## 0.2.1

### Patch Changes

- c5bab94ab: Updated the AuthApi `.create` methods to configure the default scope of the corresponding Auth Api. As a result the
  default scope is configurable when overwriting the Core Api in the app.

  ```
  GithubAuth.create({
    discoveryApi,
    oauthRequestApi,
    defaultScopes: ['read:user', 'repo'],
  }),
  ```

  Replaced redundant CreateOptions of each Auth Api with the OAuthApiCreateOptions type.

  ```
  export type OAuthApiCreateOptions = AuthApiCreateOptions & {
    oauthRequestApi: OAuthRequestApi;
    defaultScopes?: string[];
  };

  export type AuthApiCreateOptions = {
    discoveryApi: DiscoveryApi;
    environment?: string;
    provider?: AuthProvider & { id: string };
  };
  ```

- Updated dependencies [4577e377b]
  - @backstage/theme@0.2.1

## 0.2.0

### Minor Changes

- 819a70229: Add SAML login to backstage

  ![](https://user-images.githubusercontent.com/872486/92251660-bb9e3400-eeff-11ea-86fe-1f2a0262cd31.png)

  ![](https://user-images.githubusercontent.com/872486/93851658-1a76f200-fce3-11ea-990b-26ca1a327a15.png)

- b79017fd3: Updated the `GithubAuth.create` method to configure the default scope of the Github Auth Api. As a result the
  default scope is configurable when overwriting the Core Api in the app.

  ```
  GithubAuth.create({
    discoveryApi,
    oauthRequestApi,
    defaultScopes: ['read:user', 'repo'],
  }),
  ```

- cbab5bbf8: Refactored the FeatureFlagsApi to make it easier to re-implement. Existing usage of particularly getUserFlags can be replaced with isActive() or save().

### Patch Changes

- cbbd271c4: Add initial RouteRefRegistry

  Starting out some work to bring routing back and working as part of the work towards finalizing #1536

  This is some of the groundwork of an experiment we're working on to enable routing via RouteRefs, while letting the app itself look something like this:

  ```jsx
  const App = () => (
    <BackstageRoutes>
      <Navigate key="/" to="/catalog" />
      <CatalogRoute path="/catalog">
        {' '}
        // catalogRouteRef
        <EntityPage type="service">
          <OverviewContent path="/">
            <WidgetA />
            <WidgetB />
          </OverviewContent>
          <CICDSwitcher path="/ci-cd" />
          <StatusRoute path="/api-status" /> // statusRouteRef
          <ApiDocsRoute path="/api" />
          <DocsRoute path="/docs" />
        </EntityPage>
        <EntityPage type="website">
          <OverviewContent path="/">
            <WidgetA />
            <WidgetB />
          </OverviewContent>
          <CICDSwitcher path="/ci-cd" />
          <SentryRoute path="/sentry" /> // sentryRouteRef
          <DocsRoute path="/docs" />
        </EntityPage>
        <EntityPage>
          <OverviewContent path="/">
            <WidgetA />
            <WidgetB />
          </OverviewContent>
          <DocsRoute path="/docs" />
        </EntityPage>
      </CatalogRoute>
      <DocsRoute path="/docs" />
      <TechRadarRoute path="/tech-radar" width={1500} height={800} />
      <GraphiQLRoute path="/graphiql" />
      <LighthouseRoute path="/lighthouse" />
    </BackstageRoutes>
  );
  ```

  As part of inverting the composition of the app, route refs and routing in general was somewhat broken, intentionally. Right now it's not really possible to easily route to different parts of the app from a plugin, or even different parts of the plugin that are not within the same router.

  The core part of the experiment is to construct a map of ApiRef[] -> path overrides. Each key in the map is the list of route refs to traversed to reach a leaf in the routing tree, and the value is the path override at that point. For example, the above tree would add entries like [techDocsRouteRef] -> '/docs', and [entityRouteRef, apiDocsRouteRef] -> '/api'. By mapping out the entire app in this structure, the idea is that we can navigate to any point in the app using RouteRefs.

  The RouteRefRegistry is an implementation of such a map, and the idea is to add it in master to make it a bit easier to experiment and iterate. This is not an exposed API at this point.

  We've explored a couple of alternatives for how to enable routing, but it's boiled down to either a solution centred around the route map mentioned above, or treating all routes as static and globally unique, with no room for flexibility, customization or conflicts between different plugins. We're starting out pursuing this options 😁. We also expect that a the app-wide routing table will make things like dynamic loading a lot cleaner, as there would be a much more clear handoff between the main chunk and dynamic chunks.

- 26e69ab1a: Remove cost insights example client from demo app and export from plugin
  Create cost insights dev plugin using example client
  Make PluginConfig and dependent types public
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
  - @backstage/theme@0.2.0
  - @backstage/test-utils@0.1.2
