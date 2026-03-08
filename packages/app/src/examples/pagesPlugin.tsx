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
} from '@backstage/frontend-plugin-api';
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

            <h2>Permission Enablement Examples</h2>
            <p>
              The following pages demonstrate conditional extension enablement
              via the <code>enabled</code> predicate using permissions. They
              will only appear when the user has the required permissions.
            </p>
            <ul>
              <li>
                <Link to="/permission-gated-example">
                  Permission Gated Example
                </Link>{' '}
                — requires <code>catalog.entity.create</code>
              </li>
            </ul>

            <h2>Feature Flag Enablement Examples</h2>
            <p>
              The following pages demonstrate conditional extension enablement
              via the <code>enabled</code> predicate. They will only appear in
              the router tree when their conditions are satisfied. Toggle the
              relevant feature flags in <Link to="/settings">Settings</Link>,
              then refresh the app to see the pages appear.
            </p>
            <ul>
              <li>
                <Link to="/feature-flag-example">Feature Flag Example</Link> —
                requires the <code>experimental-features</code> flag
              </li>
              <li>
                <Link to="/all-flags-example">All Flags Example</Link> —
                requires <em>both</em> <code>experimental-features</code> and{' '}
                <code>advanced-features</code> (<code>$all</code>)
              </li>
              <li>
                <Link to="/any-flag-example">Any Flag Example</Link> — requires{' '}
                <em>either</em> <code>experimental-features</code> or{' '}
                <code>beta-access</code> (<code>$any</code>)
              </li>
            </ul>

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

// Example: Page enabled only when a single feature flag is active.
//
// The `enabled` predicate is evaluated once at app startup (before the router
// tree is built), so this page simply won't exist in the app until the flag is
// toggled and the page is refreshed.
//
// To test: enable the 'experimental-features' flag in Settings, then refresh.
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
              This page is only present in the app when the{' '}
              <code>experimental-features</code> feature flag is active.
            </p>
            <p>
              It uses a simple{' '}
              <code>
                {'{ featureFlags: { $contains: "experimental-features" } }'}
              </code>{' '}
              predicate.
            </p>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
          </div>
        );
      };
      return <Component />;
    },
  },
  enabled: { featureFlags: { $contains: 'experimental-features' } },
});

// Example: Page enabled only when ALL of several feature flags are active.
//
// The $all operator requires every nested predicate to be satisfied. This page
// won't appear unless both 'experimental-features' and 'advanced-features' are
// enabled at the same time.
//
// To test: enable BOTH flags in Settings, then refresh.
const AllFlagsPage = PageBlueprint.make({
  name: 'allFlagsExample',
  params: {
    path: '/all-flags-example',
    loader: async () => {
      const Component = () => {
        const indexLink = useRouteRef(indexRouteRef);
        return (
          <div>
            <h1>All Flags Required Page</h1>
            <p>
              This page requires <em>both</em>{' '}
              <code>experimental-features</code> and{' '}
              <code>advanced-features</code> to be active simultaneously.
            </p>
            <p>
              It uses a <code>$all</code> predicate to AND the two conditions
              together.
            </p>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
          </div>
        );
      };
      return <Component />;
    },
  },
  enabled: {
    $all: [
      { featureFlags: { $contains: 'experimental-features' } },
      { featureFlags: { $contains: 'advanced-features' } },
    ],
  },
});

// Example: Page enabled when ANY one of several feature flags is active.
//
// The $any operator is satisfied as soon as at least one nested predicate
// matches. Enabling either 'experimental-features' or 'beta-access' will make
// this page appear.
//
// To test: enable at least one of the two flags in Settings, then refresh.
const AnyFlagPage = PageBlueprint.make({
  name: 'anyFlagExample',
  params: {
    path: '/any-flag-example',
    loader: async () => {
      const Component = () => {
        const indexLink = useRouteRef(indexRouteRef);
        return (
          <div>
            <h1>Any Flag Sufficient Page</h1>
            <p>
              This page appears when <em>either</em>{' '}
              <code>experimental-features</code> or <code>beta-access</code> is
              active.
            </p>
            <p>
              It uses a <code>$any</code> predicate to OR the two conditions
              together.
            </p>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
          </div>
        );
      };
      return <Component />;
    },
  },
  enabled: {
    $any: [
      { featureFlags: { $contains: 'experimental-features' } },
      { featureFlags: { $contains: 'beta-access' } },
    ],
  },
});

// Example: Page enabled only when the user is allowed to create catalog entities.
//
// The `enabled` predicate is evaluated once at app startup (after sign-in),
// so this page simply won't exist in the router tree if the user lacks the
// required permission.
const PermissionGatedPage = PageBlueprint.make({
  name: 'permissionGatedExample',
  params: {
    path: '/permission-gated-example',
    loader: async () => {
      const Component = () => {
        const indexLink = useRouteRef(indexRouteRef);
        return (
          <div>
            <h1>Permission Gated Page</h1>
            <p>
              This page is only present when the user has the{' '}
              <code>catalog.entity.create</code> permission.
            </p>
            {indexLink && <Link to={indexLink()}>Go back</Link>}
          </div>
        );
      };
      return <Component />;
    },
  },
  enabled: { permissions: { $contains: 'catalog.entity.create' } },
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
    FeatureFlagPage,
    AllFlagsPage,
    AnyFlagPage,
    PermissionGatedPage,
  ],
});
