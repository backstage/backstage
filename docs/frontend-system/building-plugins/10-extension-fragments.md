---
id: extension-fragments
title: Extension fragments
sidebar_label: Extension fragments
description: Embedding React content from another plugin
---

# Extension fragments

Extension fragments are an **experimental** feature available through `/next` entry points. Import the APIs from `@backstage/frontend-plugin-api/next` and the fragment test helpers from `@backstage/frontend-test-utils/next`. These APIs may change before becoming stable.

Extension fragments let a plugin render a piece of React content provided by another installed plugin. They are useful for lightweight integration within an internal app, where the plugins can agree on a fragment ID without defining a custom blueprint and extension input.

Fragments are also useful when publishing a plugin that provides a freeform component for other plugins to render. When the caller does not need to pass props, prefer a fragment over directly exporting the component: the providing plugin retains control of its implementation, extension configuration, and any child extensions. The fragment itself can be configurable or extensible, but its caller cannot pass props. Use a regular exported component when caller-provided props are part of the contract.

Initializing a fragment extension and looking it up in the registry do not load or render its content. The loader runs only when the fragment is rendered. Use a dedicated blueprint and input when you need a richer contract, typed data exchange, or a collection of contributions.

## Enabling fragments

Install the fragment registry by adding the app module to your app's features:

```tsx
import { createApp } from '@backstage/frontend-defaults';
import { appModuleExtensionFragments } from '@backstage/plugin-app/next';

const app = createApp({
  features: [appModuleExtensionFragments],
});
```

The module is opt-in. Apps that do not use fragments do not need to install it.

## Providing a fragment

Create a fragment with `FragmentBlueprint` from `@backstage/frontend-plugin-api/next` and register it in your plugin:

```tsx
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import { FragmentBlueprint } from '@backstage/frontend-plugin-api/next';

const summary = FragmentBlueprint.make({
  name: 'summary',
  params: {
    loader: () =>
      import('./components/DeploymentSummary').then(m => (
        <m.DeploymentSummary />
      )),
  },
});

export default createFrontendPlugin({
  pluginId: 'deployments',
  extensions: [summary],
});
```

The extension ID is `fragment:deployments/summary`. Omitting `name` creates the unnamed fragment `fragment:deployments`. Each fragment outputs a React element. The loader runs when that element is first rendered, rather than when the fragment is registered.

## Rendering a fragment

Render `ExtensionFragment` at the desired location in the consuming page:

```tsx
import { ExtensionFragment } from '@backstage/frontend-plugin-api/next';

<ExtensionFragment
  fragmentId="deployments/summary"
  fallback={<p>No deployment summary available</p>}
/>;
```

Always provide the namespace and optional name, without the `fragment:` kind prefix. For an unnamed fragment, use `fragmentId="deployments"`.

If the fragment is missing, disabled, or excluded by an extension predicate, the component renders `fallback`, or nothing if no fallback was provided. Loading and rendering errors use the fragment's normal extension boundary; they do not select the missing-content fallback.

The fragment inherits React context from its location in the consuming page, while retaining its own extension identity for error reporting and analytics. There are no additional props passed to the fragment. Prefer Utility APIs for shared functionality; use host context only where the integration requires it.

## Configuring fragments

App configuration uses full extension IDs, just like other extensions:

```yaml
app:
  extensions:
    - fragment:deployments/summary: false
```

The app module collects enabled fragments through its `api:app/extension-fragments` extension, exposed as `extensionFragmentsApiRef` from `@backstage/frontend-plugin-api/next`.

The registry follows the normal Utility API lifecycle. Without extension predicates in its subtree, it can initialize during bootstrap. If the subtree contains a predicate, the entire registry is deferred until app finalization, when the session's predicate context is available. Sign-in pages and other bootstrap UI must not depend on the registry in that case.

## Testing fragments

### Producer tests

Use `createExtensionTester` to render a fragment's element independently of the registry:

```tsx
const tester = createExtensionTester(summary);
renderInTestApp(tester.reactElement());
expect(await screen.findByText('Last deployed yesterday')).toBeVisible();
```

Supply any Utility API mocks through `renderInTestApp`'s `apis` option. If the fragment depends on host React context, wrap the element in the corresponding provider.

### Consumer tests

Inject the fragment registry without importing the contributing plugin:

```tsx
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { mockApis } from '@backstage/frontend-test-utils/next';

renderInTestApp(<DeploymentPage />, {
  apis: [
    mockApis.extensionFragments({
      'deployments/summary': <div>Test deployment summary</div>,
    }),
  ],
});
```

The fake accepts React elements keyed by fragment ID, without the `fragment:` prefix, just like `ExtensionFragment`'s `fragmentId` prop. Calling `mockApis.extensionFragments()` without arguments creates an empty registry, which is useful for testing missing-content fallbacks.

For assertions on lookup calls, use `mockApis.extensionFragments.mock()` with an optional `getFragment` implementation. The underlying Utility API accepts full extension IDs; `ExtensionFragment` adds the `fragment:` prefix before looking up the element.

For integration tests, use `renderTestApp` with the actual producer and consumer plugins in `features`. Include `appModuleExtensionFragments` in `features` to install the fragment registry.
