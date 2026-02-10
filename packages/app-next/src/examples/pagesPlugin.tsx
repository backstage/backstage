/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Link } from '@backstage/core-components';
import {
  createFrontendPlugin,
  createRouteRef,
  createExternalRouteRef,
  useRouteRef,
  PageBlueprint,
  FrontendPluginInfo,
  useAppNode,
  allOf,
  anyOf,
  createFeatureFlagCondition,
} from '@backstage/frontend-plugin-api';
import { configApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { createPermissionCondition } from '@backstage/plugin-permission-react';
import {
  catalogEntityCreatePermission,
  catalogLocationAnalyzePermission,
} from '@backstage/plugin-catalog-common/alpha';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

const indexRouteRef = createRouteRef();
const page1RouteRef = createRouteRef();
export const externalPageXRouteRef = createExternalRouteRef({
  defaultTarget: 'pages.pageX',
});
export const pageXRouteRef = createRouteRef();
// const page2RouteRef = createSubRouteRef({
//   id: 'page2',
//   parent: page1RouteRef,
//   path: '/page2',
// });

function PluginInfo() {
  const node = useAppNode();
  const [info, setInfo] = useState<FrontendPluginInfo | undefined>(undefined);

  useEffect(() => {
    node?.spec.plugin?.info().then(setInfo);
  }, [node]);

  return (
    <div>
      <h3>Plugin Info</h3>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </div>
  );
}

const IndexPage = PageBlueprint.make({
  name: 'index',
  params: {
    path: '/',
    routeRef: indexRouteRef,
    loader: async () => {
      const Component = () => {
        const page1Link = useRouteRef(page1RouteRef);
        return (
          <div>
            <h1>Example Pages Plugin</h1>
            <h2>Navigation</h2>
            {page1Link && (
              <div>
                <Link to={page1Link()}>Page 1</Link>
              </div>
            )}
            <div>
              <Link to="/home">Home</Link>
            </div>
            <div>
              <Link to="/graphiql">GraphiQL</Link>
            </div>
            <div>
              <Link to="/search">Search</Link>
            </div>
            <div>
              <Link to="/settings">Settings</Link>
            </div>

            <h2>Dynamic Enablement Examples</h2>
            <p>
              The following pages demonstrate dynamic extension enablement. They
              will only be accessible if their conditions are met:
            </p>
            <ul>
              <li>
                <Link to="/feature-flag-example">Feature Flag Example</Link> -
                Requires 'experimental-features' flag (toggle in{' '}
                <Link to="/settings">Settings</Link>)
              </li>
              <li>
                <Link to="/config-example">Config Example</Link> - Requires
                app.features.betaUI: true in config
              </li>
              <li>
                <Link to="/combined-example">Combined Example</Link> - Requires
                'advanced-features' flag (toggle in{' '}
                <Link to="/settings">Settings</Link>) AND
                app.features.advancedMode: true in config
              </li>
              <li>
                <Link to="/or-example">OR Example</Link> - Requires
                'beta-access' flag (toggle in{' '}
                <Link to="/settings">Settings</Link>) OR user.betaTester: true
                in config
              </li>
              <li>
                <Link to="/user-example">User Example</Link> - Requires email
                ending with @example.com
              </li>
              <li>
                <Link to="/permission-example">Permission Example</Link> -
                Requires 'catalog.entity.create' permission
              </li>
              <li>
                <Link to="/permission-example-2">Permission Example #2</Link> -
                Requires 'catalog.location.analyze' permission
              </li>
            </ul>
            <p>
              <strong>To test:</strong> Try navigating to these pages - you'll
              get a 404 error if the conditions aren't met. Toggle the feature
              flags in <Link to="/settings">Settings</Link>, add config values
              to app-config.yaml, then refresh the app to see the pages appear!
            </p>

            <PluginInfo />
          </div>
        );
      };
      return <Component />;
    },
  },
});

const Page1 = PageBlueprint.make({
  name: 'page1',
  params: {
    path: '/page1',
    routeRef: page1RouteRef,
    loader: async () => {
      const Component = () => {
        const indexLink = useRouteRef(indexRouteRef);
        const xLink = useRouteRef(externalPageXRouteRef);
        // const page2Link = useRouteRef(page2RouteRef);

        return (
          <div>
            <h1>This is page 1</h1>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
            <Link to="./page2">Page 2</Link>
            {/* <Link to={page2Link()}>Page 2</Link> */}
            {xLink && <Link to={xLink()}>Page X</Link>}

            <div>
              Sub-page content:
              <div>
                <Routes>
                  <Route path="/" element={<h2>This is also page 1</h2>} />
                  <Route path="/page2" element={<h2>This is page 2</h2>} />
                </Routes>
              </div>
            </div>
          </div>
        );
      };
      return <Component />;
    },
  },
});

const ExternalPage = PageBlueprint.make({
  name: 'pageX',
  params: {
    path: '/pageX',
    routeRef: pageXRouteRef,
    loader: async () => {
      const Component = () => {
        const indexLink = useRouteRef(indexRouteRef);
        // const pageXLink = useRouteRef(pageXRouteRef);

        return (
          <div>
            <h1>This is page X</h1>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
          </div>
        );
      };
      return <Component />;
    },
  },
});

// Example: Page enabled only when a feature flag is active
// To test: Set the 'experimental-features' feature flag in your config or via FeatureFlagsApi
const FeatureFlagPage = PageBlueprint.make({
  name: 'featureFlagExample',
  params: {
    path: '/feature-flag-example',
    loader: async () => {
      const Component = () => {
        const indexLink = useRouteRef(indexRouteRef);
        return (
          <div>
            <h1>Feature Flag Enabled Page</h1>
            <p>
              This page is only accessible when the 'experimental-features'
              feature flag is enabled.
            </p>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
          </div>
        );
      };
      return <Component />;
    },
  },
  enabled: createFeatureFlagCondition('experimental-features'),
});

// Example: Page enabled based on config value
// To test: Add `app.features.betaUI: true` to your app-config.yaml
const ConfigBasedPage = PageBlueprint.make({
  name: 'configExample',
  params: {
    path: '/config-example',
    loader: async () => {
      const Component = () => {
        const indexLink = useRouteRef(indexRouteRef);
        return (
          <div>
            <h1>Config-Based Page</h1>
            <p>
              This page is only accessible when app.features.betaUI is set to
              true in config.
            </p>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
          </div>
        );
      };
      return <Component />;
    },
  },
  enabled: async (_, { apiHolder }) => {
    const config = apiHolder.get(configApiRef);
    return config?.getOptionalBoolean('app.features.betaUI') === true;
  },
});

// Example: Combining multiple conditions with AND logic
// To test: Enable both 'advanced-features' flag AND set app.features.advancedMode: true
const CombinedConditionsPage = PageBlueprint.make({
  name: 'combinedExample',
  params: {
    path: '/combined-example',
    loader: async () => {
      const Component = () => {
        const indexLink = useRouteRef(indexRouteRef);
        return (
          <div>
            <h1>Combined Conditions Page</h1>
            <p>
              This page requires BOTH the 'advanced-features' feature flag AND
              app.features.advancedMode config to be enabled.
            </p>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
          </div>
        );
      };
      return <Component />;
    },
  },
  enabled: allOf(
    createFeatureFlagCondition('advanced-features'),
    async (_, { apiHolder }) => {
      const config = apiHolder.get(configApiRef);
      return config?.getOptionalBoolean('app.features.advancedMode') === true;
    },
  ),
});

// Example: Using OR logic - accessible if ANY condition is met
// To test: Enable either 'beta-access' flag OR set user.betaTester: true
const OrConditionsPage = PageBlueprint.make({
  name: 'orExample',
  params: {
    path: '/or-example',
    loader: async () => {
      const Component = () => {
        const indexLink = useRouteRef(indexRouteRef);
        return (
          <div>
            <h1>OR Conditions Page</h1>
            <p>
              This page is accessible if EITHER the 'beta-access' feature flag
              OR user.betaTester config is enabled.
            </p>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
          </div>
        );
      };
      return <Component />;
    },
  },
  enabled: anyOf(
    createFeatureFlagCondition('beta-access'),
    async (_, { apiHolder }) => {
      const config = apiHolder.get(configApiRef);
      return config?.getOptionalBoolean('user.betaTester') === true;
    },
  ),
});

// Example: Custom condition based on user identity
// This page checks if the user's email domain is from the company
const UserBasedPage = PageBlueprint.make({
  name: 'userExample',
  params: {
    path: '/user-example',
    loader: async () => {
      const Component = () => {
        const indexLink = useRouteRef(indexRouteRef);
        return (
          <div>
            <h1>User-Based Access Page</h1>
            <p>
              This page is only accessible to users with an @example.com email
              address.
            </p>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
          </div>
        );
      };
      return <Component />;
    },
  },
  enabled: async (_, { apiHolder }) => {
    const identity = apiHolder.get(identityApiRef);
    if (!identity) return false;

    // Now that enabled conditions are evaluated at React mount time (not tree construction),
    // identityApi will have user data available without stalling the app
    const profile = await identity.getProfileInfo();
    return profile?.email?.endsWith('@example.com') === true;
  },
});

// Example: Permission-based access control
// This page checks if the user has the catalog.entity.read permission
const PermissionBasedPage = PageBlueprint.make({
  name: 'permissionExample',
  params: {
    path: '/permission-example',
    loader: async () => {
      const Component = () => {
        const indexLink = useRouteRef(indexRouteRef);
        return (
          <div>
            <h1>Permission-Based Access Page</h1>
            <p>
              This page is only accessible to users with the
              'catalog.entity.create' permission.
            </p>
            <p>
              This demonstrates how to use the permission system to control
              access to extensions at the tree-attachment level.
            </p>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
          </div>
        );
      };
      return <Component />;
    },
  },
  enabled: createPermissionCondition(catalogEntityCreatePermission),
});

// Example: Permission-based access control
// This page checks if the user has the catalog.entity.read permission
const SecondPermissionBasedPage = PageBlueprint.make({
  name: 'permissionExample2',
  params: {
    path: '/permission-example-2',
    loader: async () => {
      const Component = () => {
        const indexLink = useRouteRef(indexRouteRef);
        return (
          <div>
            <h1>Permission-Based Access Page</h1>
            <p>
              This page is only accessible to users with the
              'catalog.location.analyze' permission.
            </p>
            <p>
              This demonstrates how to use the permission system to control
              access to extensions at the tree-attachment level.
            </p>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
          </div>
        );
      };
      return <Component />;
    },
  },
  enabled: createPermissionCondition(catalogLocationAnalyzePermission),
});

export const pagesPlugin = createFrontendPlugin({
  pluginId: 'pages',
  // routes: {
  //   index: indexRouteRef,
  //   // reference in config:
  //   //   'plugin.pages.routes.index'
  //   //     OR
  //   //   'page1'
  // },
  info: {
    packageJson: () => import('../../package.json'),
    manifest: () => import('../../catalog-info.yaml'),
  },
  routes: {
    page1: page1RouteRef,
    pageX: pageXRouteRef,
  },
  externalRoutes: {
    pageX: externalPageXRouteRef,
  },
  featureFlags: [
    { name: 'experimental-features' },
    { name: 'advanced-features' },
    { name: 'beta-access' },
  ],
  extensions: [
    IndexPage,
    Page1,
    ExternalPage,
    // Dynamic enablement examples
    FeatureFlagPage,
    ConfigBasedPage,
    CombinedConditionsPage,
    OrConditionsPage,
    UserBasedPage,
    PermissionBasedPage,
    SecondPermissionBasedPage,
  ],
});
