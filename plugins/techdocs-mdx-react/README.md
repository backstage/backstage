# techdocs-module-mdx

An implementation for TechDocs reader page using [MDX](https://mdxjs.com/).

> **Note:**
> This plugin expects you to have implemented a backend Generator which returns markdown files, see how to do that [here](hhttps://github.com/backstage/backstage/tree/master/plugins/techdocs-mdx-node).

## Getting started

This plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/techdocs-mdx](http://localhost:3000/techdocs-mdx).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

## Usage

We are designing a way to customize the plugins used by the MDX compiler in the future, but for now you cannot do that.

### Routes

You have two different ways to use this plugin, they are enumerated just below.

#### 1. Default page layout

Explicitly use the MDX implementation for your Reader page:

**App.tsx**

```tsx
import { TechDocsReaderPage } from '@backstage/plugin-techdocs-react';
import { techDocsReaderPage } from '@backstage/plugin-techdocs-mdx-react';

<Route path="/docs/:namespace/:kind/:name/*" element={<TechDocsReaderPage />}>
  {techDocsReaderPage} 👈
</Route>;
```

#### 2. Custom page layout

This is for you who want to have a different layout than the default reader, if you want to know more about how to customize the TechDocs reader page, take a look [here](https://backstage.io/docs/features/techdocs/how-to-guides#how-to-customize-the-techdocs-reader-page).

**App.tsx**

```tsx
import { TechDocsReaderPage } from '@backstage/plugin-techdocs-react';
import { TechDocsReaderContent } from '@backstage/plugin-techdocs-mdx-react';

<Route path="/docs/:namespace/:kind/:name/*" element={<TechDocsReaderPage />}>
  <TechDocsReaderPage>
    {({ entityRef, entityMetadataValue, techdocsMetadataValue }) => (
      <>
        <TechDocsReaderPageHeader
          entityRef={entityRef}
          entityMetadata={entityMetadataValue}
          techDocsMetadata={techdocsMetadataValue}
        />
        <Content data-testid="techdocs-content">
          <Reader entityRef={entityRef}>
            <TechDocsReaderContent /> 👈
          </Reader>
        </Content>
      </>
    )}
  </TechDocsReaderPage>
</Route>;
```

### API Configuration

This plugin expects you to have a TechDocs Storage API that returns markdown files, the `@backstage/plugin-techdocs-mdx-react` does that for you based on [this](https://backstage.io/docs/features/techdocs/how-to-guides#how-to-implement-your-own-techdocs-apis) guide:

```ts
import {
  createApiFactory,
  configApiRef,
  discoveryApiRef,
  identityApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { techdocsStorageApiRef } from '@backstage/plugin-techdocs-react';
import { TechDocsStorageApiImpl } from '@backstage/plugin-techdocs-mdx-react';

const app = createApp({
  apis: [
    createApiFactory({
    api: techdocsStorageApiRef,
    deps: {
      configApi: configApiRef,
      discoveryApi: discoveryApiRef,
      identityApi: identityApiRef,
      fetchApi: fetchApiRef,
    },
    factory: ({ configApi, discoveryApi, identityApi, fetchApi }) =>
      new TechDocsStorageApiImpl({
        configApi,
        discoveryApi,
        identityApi,
        fetchApi,
      }),
  }),
});
```
