---
'@backstage/plugin-techdocs-addons-test-utils': major
---

**BREAKING**: `TechDocsAddonTester.renderWithEffects()` no longer returns a screen; this means that you can no longer grab assertions such as `getByText` from its return value.

Newer versions of `@testing-library` recommends using the `screen` export for assertions - and removing this from the addon tester contract allows us to more freely iterate on which underlying version of the testing library is being used.

One notable effect of this, however, is that the `@testing-library` `screen` does NOT support assertions on the shadow DOM, which techdocs relies on. You will therefore want to add a dependency on [the `shadow-dom-testing-library` package](https://github.com/konnorrogers/shadow-dom-testing-library/) in your tests, and using its `screen` and its dedicated `*Shadow*` methods. As an example, if you keep doing `getByText` you will not get matches inside the shadow DOM - switch to `getByShadowText` instead.

```ts
import { screen } from 'shadow-dom-testing-library';

// ... render the addon ...
await TechDocsAddonTester.buildAddonsInTechDocs([<AnAddon />])
  .withDom(<body>TEST_CONTENT</body>)
  .renderWithEffects();

expect(screen.getByShadowText('TEST_CONTENT')).toBeInTheDocument();
```
