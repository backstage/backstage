---
'@backstage/backend-common': patch
---

Added a `stream()` method to complement the `buffer()` method on `ReadUrlResponse`. A `ReadUrlResponseFactory` utility class is now also available, providing a simple, consistent way to provide a valid `ReadUrlResponse`.

This method, though optional for now, will be required on the responses of `UrlReader.readUrl()` implementations in a future release.
