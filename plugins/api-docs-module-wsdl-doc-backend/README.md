# @backstage/plugin-api-docs-module-wsdl-doc-backend

Backend for the `@backstage/plugin-api-docs-module-wsdl-doc` plugin. Assists in converting WSDL to HTML.

## Installation

Install the `@backstage/plugin-api-docs-module-wsdl-doc-backend` package in your backend packages, and then integrate the plugin using the following default setup for `src/plugins/apiDocsModuleWsdlDoc.ts`:

```ts
import { Router } from 'express';
import { createRouter } from '@backstage/plugin-api-docs-module-wsdl-doc-backend';

export default async function createPlugin(
  _: PluginEnvironment,
): Promise<Router> {
  return await createRouter();
}
```

And then add to `packages/backend/src/index.ts`:

```js
// In packages/backend/src/index.ts
import apiDocsModuleWsdlDoc from './plugins/apiDocsModuleWsdlDoc';
// ...
async function main() {
  // ...
  const apiDocsModuleWsdlDocEnv = useHotMemoize(module, () => createEnv('apiDocsModuleWsdlDoc'));
  // ...
  apiRouter.use('/api-docs-module-wsdl-doc', await apiDocsModuleWsdlDoc(apiDocsModuleWsdlDocEnv));
```

## Development

This plugin is based on the work of the [wsdl-viewer](https://github.com/tomi-vanek/wsdl-viewer) and uses
[SaxonJS](https://www.saxonica.com/saxon-js/index.xml) for the `XSLT` transformation.

If you like to future improve the `XSLT` you have to make changes to `./wsdl-viewer.xsl` and convert it to a `SEF` file.

```
xslt3 -t -xsl:./wsdl-viewer.xsl -export:./src/stylesheet.sef.json -nogo
```
