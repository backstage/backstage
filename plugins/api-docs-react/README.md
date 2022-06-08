# @backstage/plugin-api-docs-react

### Setup

This widget will render the generated `protoc-gen-doc` descriptors with the `grpc-docs` package. For this make sure you use the `grpc-docs` as the type in the API catalog file.

```yaml
spec:
  type: grpc-docs
  owner: foo
  definition:
    $text: https://fetch-my-json.com/awesome-resource.json
```

### Add the GrpcDocsApiWidget to your apis

Add the widget to your `apiDocsConfigRef` in the following way. Make sure the `apiEntity.spec.type` is compared to `grpc-docs`

```ts
// packages/app/apis.ts
  createApiFactory({
    api: apiDocsConfigRef,
    deps: {},
    factory: () => {
      // load the default widgets
      const definitionWidgets = defaultDefinitionWidgets();
      return {
        getApiDefinitionWidget: (apiEntity: ApiEntity) => {
          // custom rendering for grpc-docs
          if (apiEntity.spec.type === 'grpc-docs') {
            return grpcDocsApiWidget();
          }

          // fallback to the defaults
          return definitionWidgets.find(d => d.type === apiEntity.spec.type);
        },
      };
    },
  }),
```
