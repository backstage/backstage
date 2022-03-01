---
'@backstage/catalog-model': minor
---

**Breaking**: The following changes are all breaking changes.

Removed `EDIT_URL_ANNOTATION` and `VIEW_URL_ANNOTATION`, `LOCATION_ANNOTATION`, `ORIGIN_LOCATION_ANNOTATION`, `LOCATION_ANNOTATION`, `SOURCE_LOCATION_ANNOTATION`. All of these constants have been prefixed with ANNOTATION to be easier to find meaning `SOURCE_LOCATION_ANNOTATION` is available as `ANNOTATION_SOURCE_LOCATION`.

Removed `parseLocationReference`, replaced by `parseLocationRef`.

Removed `stringifyLocationReference`, replaced by `stringifyLocationRef`.

Removed `Location` type which has been moved to `catalog-client`.

Removed `ENTITY_DEFAULT_NAMESPACE`, replaced by `DEFAULT_NAMESPACE`.

Removed `compareEntityToRef` compare using `stringifyEntityRef` instead.

Removed `JSONSchema` type which should be imported from `json-schema` package instead.

Removed utility methods: `entityHasChanges`, `generateEntityEtag`, `generateEntityUid`, `generateUpdatedEntity`.

Removed `ENTITY_META_GENERATED_FIELDS` and `EntityRefContext`.
