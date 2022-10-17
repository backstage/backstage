---
'@backstage/cli': patch
---

Treat files in `__testUtils__` and `__mocks__` directories as test files for linting
purposes.

Updates the parts of the eslint configuration generator that specify which files
should be treated as test code to include any files under two additional
directories:

- `__mocks__`: this is the directory used by Jest[0] for mock code.
- `__testUtils__`: a suggested location for utility code executed only when
  running tests.

[0]: https://jestjs.io/docs/manual-mocks#mocking-user-modules
