# @backstage/plugin-api-docs-react

## Setup

```
yarn add @backstage/plugin-api-docs-react
```

## Add the GrpcDocsApiWidget to your apis

Add the widget to your `apiDocsConfigRef` in the following way. Make sure the `apiEntity.spec.type` is compared to `grpc-docs`

```ts
import { grpcDocsApiWidget } from '@backstage/plugin-api-docs-react';
// packages/app/apis.ts
export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: apiDocsConfigRef,
    deps: {},
    factory: () => {
      // load the default widgets
      const definitionWidgets = defaultDefinitionWidgets();
      // add the grpc-docs api widget to the definition widgets
      definitionWidgets.push(grpcDocsApiWidget);
      return {
        getApiDefinitionWidget: (apiEntity: ApiEntity) => {
          // find the widget for the type of api entity
          return definitionWidgets.find(d => d.type === apiEntity.spec.type);
        },
      };
    },
  }),
];
```

### Set the type in your api entities

This widget will render the generated `protoc-gen-doc` descriptors with the `grpc-docs` package. For this make sure you use the `grpc-docs` as the type in the API catalog file.

```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: hello-world
  description: Hello World example for gRPC
spec:
  type: grpc-docs
  lifecycle: deprecated
  owner: foo
  definition:
    $text: https://fetch-my-json.com/awesome-resource.json
```
