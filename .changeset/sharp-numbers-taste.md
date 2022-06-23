---
'@backstage/errors': minor
---

The `ResponseError.fromResponse` now accepts a more narrow response type, in order to avoid incompatibilities between different fetch implementations.

The `response` property of `ResponseError` has also been narrowed to a new `ConsumedResponse` type that omits all the properties for consuming the body of the response. This is not considered a breaking change as it was always an error to try to consume the body of the response.
