---
'@backstage/cli': minor
---

Treat files in `__tests__` and `__mocks__` directories as test files for linting
purposes.

Updates the parts of the eslint configuration generator that specify which files
should be treated as test code to include any files under directories named
`__tests__` or `__mocks__`, to match the default file locations used in Jest.

cf.
https://jestjs.io/docs/configuration/#testmatch-arraystring
https://jestjs.io/docs/manual-mocks#mocking-user-modules
