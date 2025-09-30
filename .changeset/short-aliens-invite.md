---
'@backstage/plugin-api-docs': minor
---

Remove explicit dependency on `isomorphic-form-data`.

This explicit dependency was added to address [an issue](https://github.com/swagger-api/swagger-ui/issues/7436) in the
dependency `swagger-ui-react`. That [issue has since been resolved](https://github.com/swagger-api/swagger-ui/issues/7436#issuecomment-889792304),
and `isomorphic-form-data` no longer needs to be declared.

Additionally, this changeset updates the `swagger-ui-react` dependency to version `5.19.0` or higher, which includes
[compatibility](https://github.com/swagger-api/swagger-ui?tab=readme-ov-file#compatibility) with the latest versions of
the OpenAPI specification.
