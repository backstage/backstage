---
'@backstage/catalog-model': patch
---

**DEPRECATION**:

- Deprecated `CommonValidatorFunctions.isValidString`, please use `isNonEmptyString` instead which is equivalent but better named.
- Deprecated `CommonValidatorFunctions.isValidTag`, with no replacement. Its purpose was too specific and not reusable, so it will be removed.
