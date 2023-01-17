# @backstage/eslint-plugin

A collection of ESLint rules useful to Backstage projects.

## Usage

This ESLint plugin is part of the default lint configuration provided by the [Backstage CLI](https://www.npmjs.com/package/@backstage/cli), so you generally do not need to install it manually.

If you do wish to install this plugin manually, start by adding it as a development dependency to your project:

```sh
yarn add --dev @backstage/eslint-plugin
```

Then add it to your ESLint configuration:

```js
extends: [
  'plugin:@backstage/recommended',
],
```

Alternatively, if you want to install in individual rules manually:

```js
plugins: [
  '@backstage',
],
rules: {
  '@backstage/no-forbidden-package-imports': 'error',
}
```

## Rules

The following rules are provided by this plugin:

| Rule                                      | Description                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| `@backstage/no-forbidden-package-imports` | Disallow internal monorepo imports from package subpaths that are not exported. |
