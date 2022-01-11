---
'@backstage/plugin-api-docs': patch
---

Update @asyncapi/react-component to 1.0.0-next.26, which will fix the
`ResizeObserver loop limit exceeded` errors which we encountered in several E2E
tests.

For more details check the following links:

- https://github.com/backstage/backstage/pull/8088#issuecomment-991183968
- https://github.com/asyncapi/asyncapi-react/issues/498
