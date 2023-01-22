# @backstage/plugin-api-docs-module-wsdl-doc

## Setup

```
yarn add @backstage/plugin-api-docs-module-wsdl-doc
```

### Add the wsdlDocsApiWidget to your apis

Add the widget to your `apiDocsConfigRef`.

```ts
// packages/app/apis.ts

import {
  apiDocsModuleWsdlDocApiRef,
  ApiDocsModuleWsdlDocClient,
  wsdlDocsApiWidget,
} from '@backstage/plugin-api-docs-module-wsdl-doc';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: apiDocsModuleWsdlDocApiRef,
    deps: {
      identityApi: identityApiRef,
      discoveryApi: discoveryApiRef,
    },
    factory: ({ identityApi, discoveryApi }) =>
      new ApiDocsModuleWsdlDocClient({ identityApi, discoveryApi }),
  }),
  createApiFactory({
    api: apiDocsConfigRef,
    deps: {},
    factory: () => {
      // load the default widgets
      const definitionWidgets = defaultDefinitionWidgets();
      // add the wsdl-docs api widget to the definition widgets
      definitionWidgets.push(wsdlDocsApiWidget);
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

This widget will render the generated `wsdl` descriptors with the provided `xslt` transformation.

```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: hello-world
  description: Hello World example for WSDL
spec:
  type: wsdl
  lifecycle: deprecated
  owner: foo
  definition:
    $text: http://www.dneonline.com/calculator.asmx?wsdl
```

You can find more examples in `./examples`.
