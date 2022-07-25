---
'@backstage/backend-common': patch
---

The `ZipArchiveResponse` now correctly handles corrupt ZIP archives.

Before this change, certain corrupt ZIP archives either cause the inflater to throw (as expected), or will hang the parser indefinitely.

By switching out the `zip` parsing library, we now write to a temporary directory, and load from disk which should ensure that the parsing of the `.zip` files are done correctly because `streaming` of `zip` paths is technically impossible without being able to parse the headers at the end of the file.
