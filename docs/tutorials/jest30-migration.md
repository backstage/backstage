---
id: jest30-migration
title: Migrating to Jest 30
description: A guide to migrating your project to Jest 30 and JSDOM 27
---

Starting with a recent version of `@backstage/cli`, `jest` is a peer dependency. If you run tests using Backstage CLI, you must add Jest and its environment dependencies as `devDependencies` in your project.

You can choose to install either Jest 29 or Jest 30. The built-in Jest version before this change was Jest 29, however, we recommend that you switch to Jest 30. Upgrading will solve the `Could not parse CSS stylesheet` errors, allow you to use MSW v2 in web packages, and ensure that you remain compatible with future versions of the Backstage CLI. Support for Jest 29 is temporary, with the purpose of allowing you to upgrade at your own pace, but it will eventually be removed.

- **Jest 29**:

  ```bash
  # in your repository root, run:
  yarn add --dev jest@^29 @types/jest@^29 jest-environment-jsdom@^29
  ```

  Pros: No migration needed

  Cons: You may see `Could not parse CSS stylesheet` warnings/errors when testing components from `@backstage/ui` or other packages using CSS `@layer` declarations

- **Jest 30**:

  ```bash
  # in your repository root, run:
  yarn add --dev jest@^30 @types/jest@^30 @jest/environment-jsdom-abstract@^30 jsdom@^27
  ```

  Pros: Fixes the stylesheet parsing warnings/errors

  Cons: Requires migration steps (see below) in your tests

## Migration Guide

The examples below are issues we encountered while migrating the Backstage repository. For a complete list of breaking changes, see the official documentation:

- [Jest 30 upgrade guide](https://jestjs.io/docs/upgrading-to-jest30)
- [JSDOM changelog](https://github.com/jsdom/jsdom/releases)

### Jest 30

**Asymmetric matchers with arrays**: `expect.objectContaining()` no longer works with arrays.

```diff
- expect(result).toEqual(expect.objectContaining([{ id: '123' }]));
+ expect(result).toEqual([{ id: '123' }]);
// or
+ expect(result).toEqual(expect.arrayContaining([{ id: '123' }]));
```

**Array length assertions**: `expect.objectContaining({ length: N })` no longer works.

```diff
- expect(fn).toHaveBeenCalledWith(expect.objectContaining({ length: 2 }));
+ expect(fn).toHaveBeenCalledWith(expect.any(Array));
+ expect(fn.mock.calls[0][0]).toHaveLength(2);
```

**Deprecated matcher aliases removed**: Replace with canonical names.

```diff
- expect(fn).toBeCalled();
+ expect(fn).toHaveBeenCalled();
```

**Snapshots**: Regenerate snapshots as the header format has changed.

```bash
yarn test --no-watch -u
```

### JSDOM 27

**window.location is non-configurable**: You can no longer mock location via `Object.defineProperty`.

```diff
- Object.defineProperty(window, 'location', { value: { href: '' } });
+ // Option 1: Use history API
+ history.replaceState({}, '', '/new-path');
+ // Option 2: Spy on navigation methods
+ const spy = jest.spyOn(component, 'navigate');
```

**CSS color values**: Colors may be returned as RGB instead of named colors.

```diff
- expect(element.style.color).toBe('red');
+ expect(element.style.color).toBe('rgb(255, 0, 0)');
```

**Error format changes**: Error messages and stack traces may have different formatting.

#### If you run into `Cannot read properties of null (reading 'constructor')`

Certain Backstage UI-components (e.g. Button) have a combination of CSS that triggers this error in tests. The solution is to make sure you have at least v0.9.25 of `@acemir/cssom`.
