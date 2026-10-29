---
id: extension-fragments
title: Extension fragments
sidebar_label: Extension fragments
description: Embedding React content from another plugin
---

# Extension fragments

Extension fragments let a plugin render a piece of React content provided by another installed plugin. They are useful for lightweight integration within an internal app, where the plugins can agree on a fragment ID without defining a custom blueprint and extension input.

Initializing a fragment extension and looking it up in the registry do not load or render its content. The loader runs only when the fragment is rendered. Use a dedicated blueprint and input when you need a richer contract, typed data exchange, or a collection of contributions.

## Providing a fragment

Create a fragment with `FragmentBlueprint` from `@backstage/frontend-plugin-api` and register it in your plugin:

```tsx
import {
  createFrontendPlugin,
  FragmentBlueprint,
} from '@backstage/frontend-plugin-api';

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
import { ExtensionFragment } from '@backstage/frontend-plugin-api';

<ExtensionFragment
  extensionId="deployments/summary"
  fallback={<p>No deployment summary available</p>}
/>;
```

Always provide the namespace and optional name, without the `fragment:` kind prefix. For an unnamed fragment, use `extensionId="deployments"`.

If the fragment is missing, disabled, or excluded by an extension predicate, the component renders `fallback`, or nothing if no fallback was provided. Loading and rendering errors use the fragment's normal extension boundary; they do not select the missing-content fallback.

The fragment inherits React context from its location in the consuming page, while retaining its own extension identity for error reporting and analytics. There are no additional props passed to the fragment. Prefer Utility APIs for shared functionality; use host context only where the integration requires it.

## Configuring fragments

App configuration uses full extension IDs, just like other extensions:

```yaml
app:
  extensions:
    - fragment:deployments/summary: false
```

The app plugin collects enabled fragments through its `api:app/extension-fragments` extension, exposed as `coreApis.extensionFragments`.

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
import { mockApis, renderInTestApp } from '@backstage/frontend-test-utils';

renderInTestApp(<DeploymentPage />, {
  apis: [
    [
      coreApis.extensionFragments,
      {
        getFragment: id =>
          id === 'fragment:deployments/summary' ? (
            <div>Test deployment summary</div>
          ) : undefined,
      },
    ],
  ],
});
```

The Utility API accepts full extension IDs. `ExtensionFragment` adds the `fragment:` prefix to the namespace and optional name supplied by the consumer. Return `undefined` from the mock to test missing-content behavior.

For integration tests, use `renderTestApp` with the actual producer and consumer plugins in `features`. The test app includes the default fragment registry.
