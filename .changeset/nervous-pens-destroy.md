---
'@backstage/cli': minor
---

We have updated the default `eslint` rules in the `@backstage/cli` package.

```diff
-'@typescript-eslint/no-shadow': 'off',
-'@typescript-eslint/no-redeclare': 'off',
+'no-shadow': 'off',
+'no-redeclare': 'off',
+'@typescript-eslint/no-shadow': 'error',
+'@typescript-eslint/no-redeclare': 'error',
```

The rules are documented [here](https://eslint.org/docs/rules/no-shadow) and [here](https://eslint.org/docs/rules/no-redeclare).

This involved a large number of small changes to the code base. When you compile your own code using the CLI, you may also be
affected. We consider these rules important, and the primary recommendation is to try to update your code according to the
documentation above. But those that prefer to not enable the rules, or need time to perform the updates, may update their
local `.eslintrc.js` file(s) in the repo root and/or in individual plugins as they see fit:

```js
module.exports = {
  // ... other declarations
  rules: {
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-redeclare': 'off',
  },
};
```

Because of the nature of this change, we're unable to provide a grace period for the update :(
