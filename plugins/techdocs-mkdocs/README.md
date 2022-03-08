# techdocs-mkdocs

A front-end implementation for TechDocs reader page using [mkdocs](https://www.mkdocs.org/).

> **Note:**
> This plugin expects you to have implemented a TechDocs Storage API that returns the HTML built with mkdocs, see how to do that [here](https://backstage.io/docs/features/techdocs/getting-started#adding-techdocs-backend-plugin).

## Getting started

This plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/techdocs-mkdocs](http://localhost:3000/techdocs-mkdocs).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

## Usage

You have two different ways to use this plugin, they are enumerated just below.

If you are wondering why we are not exposing an interface to render custom transformers, the answer is explained in this [RFC](https://github.com/backstage/backstage/issues/9636). There we are proposing an universal TechDocs Add-on Framework that will work independently of the TechDocs Reader implementation.

### 1. Default page layout

We recommend that you explicitly use the mkdocs implementation instead of the default:

**App.tsx**

```tsx
import { TechDocsReaderPage } from '@backstage/plugin-techdocs';
import { techDocsReaderPage } from '@backstage/plugin-techdocs-mkdocs';

<Route path="/docs/:namespace/:kind/:name/*" element={<TechDocsReaderPage />}>
  {techDocsReaderPage} 👈
</Route>;
```

But you can also use the default implementation which is `mkdocs` for now, but remember, **we don't guarantee that the default implementation will always be mkdocs**:

**App.tsx**

```tsx
import { TechDocsReaderPage } from '@backstage/plugin-techdocs';

<Route
  path="/docs/:namespace/:kind/:name/*"
  element={<TechDocsReaderPage />}
/>;
```

### 2. Custom page layout

This is for you who want to have a different layout than the default reader, if you want to know more about how to customize the TechDocs reader page, take a look [here](https://backstage.io/docs/features/techdocs/how-to-guides#how-to-customize-the-techdocs-reader-page).

**App.tsx**

```tsx
import { TechDocsReaderPage } from '@backstage/plugin-techdocs';
import { TechDocsReaderContent } from '@backstage/plugin-techdocs-mkdocs';

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

To use the default reader do as shown below, but again remember that the default reader may not be mkdocs in the future, so we recommend using it in the previous way.

**App.tsx**

```tsx
import { TechDocsReaderPage } from '@backstage/plugin-techdocs';
import { TechDocsReaderContent } from '@backstage/plugin-techdocs-mkdocs';

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
          <Reader entityRef={entityRef} />
        </Content>
      </>
    )}
  </TechDocsReaderPage>
</Route>;
```
