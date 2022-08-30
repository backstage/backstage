---
'@backstage/cli': minor
---

Updated dependency `eslint-plugin-jest` to `^27.0.0`.

Note that this major update to the Jest plugin contains some breaking changes.
This means that some of your tests may start seeing some new lint errors. [Read
about them
here](https://github.com/jest-community/eslint-plugin-jest/blob/main/CHANGELOG.md#2700-2022-08-28).

These are mostly possible to fix automatically. You can try to run `yarn backstage-cli repo lint --fix` in your repo root to have most or all of them
corrected.
