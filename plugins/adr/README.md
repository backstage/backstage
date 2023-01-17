# Architecture Decision Records (ADR) Plugin

Welcome to the ADR plugin!

This plugin allows you to browse ADRs associated with your entities as well as a way to discover ADRs across others entities via Backstage Search. Use this to learn from the past experience of other projects to guide your own architecture decisions.

## Setup

1. Install this plugin:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-adr
```

2. Make sure the [ADR backend plugin](../adr-backend/README.md) is installed.

3. [Configure integrations](https://backstage.io/docs/integrations/) for all sites you would like to pull ADRs from.

### Entity Pages

1. Add the plugin as a tab to your Entity pages:

```jsx
// In packages/app/src/components/catalog/EntityPage.tsx
import { EntityAdrContent, isAdrAvailable } from '@backstage/plugin-adr';

...

const serviceEntityPage = (
  <EntityLayout>
    {/* other tabs... */}
    <EntityLayout.Route if={isAdrAvailable} path="/adrs" title="ADRs">
      <EntityAdrContent />
    </EntityLayout.Route>
  </EntityLayout>
```

2. Add `backstage.io/adr-location` annotation to your `catalog-info.yaml`:

```yaml
metadata:
  annotations:
    backstage.io/adr-location: <RELATIVE_PATH_TO_ADR_FILES_DIR>
```

The value for `backstage.io/adr-location` should be a path relative to your `catalog-info.yaml` file or a absolute URL to the directory which contains your ADR markdown files.

For example, if you have the following directory structure, you would set `backstage.io/adr-location: docs/adrs`:

```
repo-root/
  README.md
  src/
  catalog-info.yaml
  docs/
    adrs/
      0001-use-adrs.md
      0002-use-cloud.md
```

### Search

First, make sure to setup Backstage Search with the [ADR backend plugin](../adr-backend/README.md).
Afterwards, add the following code snippet to use `AdrSearchResultListItem` when the type of the search results is `adr`:

```tsx
// In packages/app/src/components/search/SearchPage.tsx
import { AdrSearchResultListItem } from '@backstage/plugin-adr';

...

case 'adr':
  return (
    <AdrSearchResultListItem
      key={document.location}
      result={document}
    />
  );
```

## Custom ADR formats

By default, this plugin will parse ADRs according to the format specified by the [Markdown Architecture Decision Record (MADR) v2.x template](https://github.com/adr/madr/tree/2.1.2). If your ADRs are written using a different format, you can apply the following customizations to correctly identify and parse your documents:

### Custom Filename/Path Format

In order to ensure the plugin fetches the correct ADR files (e.g. ignoring your template file), you can pass in an optional `filePathFilterFn` parameter to `EntityAdrContent` which will be called with each file path relative to the ADR location specified by `backstage.io/adr-location`. For example, the follow custom filter function will ignore the ADR template file and include files with a specific naming convention including those under a specified sub-directory:

```tsx
const myCustomFilterFn: AdrFilePathFilterFn = (path: string): boolean => {
  if (path === '0000-adr-template.md') {
    return false;
  }
  // Match all files following the pattern NNNN-title-with-dashes.md including those under decided-adrs/
  return /^(decided-adrs\/)?\d{4}-.+\.md$/.test(path);
}

...

<EntityAdrContent filePathFilterFn={myCustomFilterFn} />
```

### Custom Content Decorators

Your ADR Markdown content will typically be rendered in the UI as is with the exception of relative links/embeds being rewritten as absolute URLs so they can be linked correctly (e.g. `./my-diagram.png` => `<ABSOLUTE_ADR_DIR_URL>/my-diagram.png`). Depending on your ADR format, you may want to apply additional transformations to the content (e.g. parsing/ignoring front matter). You can do so by passing in a list of custom content decorators for the optional `contentDecorators` parameter. Note that passing in this parameter will override the default decorators. If you want to include the default ones, make sure to add them as well:

```tsx
import {
  AdrReader,
  ...
} from '@backstage/plugin-adr';

...

const myCustomDecorator: AdrContentDecorator = ({ content }) => {
  return { content: applyCustomContentTransformation(content) };
};

...

<EntityAdrContent contentDecorators={[
    AdrReader.decorators.createRewriteRelativeLinksDecorator(),
    AdrReader.decorators.createRewriteRelativeEmbedsDecorator(),
    myCustomDecorator,
  ]}
/>
```
