---
'@backstage/plugin-api-docs': patch
---

Lazy load all API definition widgets. The widgets use libraries like
`swagger-ui`, `graphiql`, and `@asyncapi/react-component` which are quite heavy
weight. To improve initial load times, the widgets are only loaded once used.
