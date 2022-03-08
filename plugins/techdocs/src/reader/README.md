# TechDocs Reader

The TechDocs reader is a component that fetches a remote page, runs transformers on it and renders it into a shadow dom.

## Customizations

You can create your own Reader implementation by following this steps:

1. Create a plugin prefixed with `@backstage/plugin-techdocs-{NAME}` (e.g. `@backstage/plugin-techdocs-mkdocs`).

2. Your new plugin has to export at least two things: A default `techDocsReaderPage` element and a `TechDocsReaderContent` component.

Example:

**index.ts**

```tsx
export { techDocsReaderPage, TechDocsReaderContent } from './components';
```

4. Backstage integrators should be able to use your package for a default or custom page layout:

```tsx
// Default
import { TechDocsReaderPage } from '@backstage/plugin-techdocs';
import { techDocsReaderPage } from '@backstage/plugin-techdocs-mkdocs';

<Route path="/docs/:namespace/:kind/:name/*" element={<TechDocsReaderPage />}>
  {techDocsReaderPage} 👈
</Route>;
```

```tsx
// Custom
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

## Developer tools

A `TechDocsShadowDom` component can be used by Reader developers if they want to render content using the [Shadow Root API](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot).

```tsx
import {
  useTechDocsReader,
  TechDocsShadowDom,
} from '@backstage/plugin-techdocs';
export const TechDocsReaderContent = () => {
  const { content, onReady } = useTechDocsReader();

  if (!content) return null;

  return <TechDocsShadowDom source={content} onAttached={onReady} />;
};
```

This component uses `DOMPurify` as a sanitizer and you can configure it and add hooks to be used by it as well (see the [DOMPurify](https://github.com/cure53/DOMPurify#dompurify) documentation for more on this):

```tsx
import {
  useTechDocsReader,
  TechDocsShadowDom,
  TechDocsShadowDomHooks,
} from '@backstage/plugin-techdocs';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

import { beforeSanitizeElements, afterSanitizeAttributes } from './hooks';

export const TechDocsReaderContent = () => {
  const configApi = useApi(configApiRef);
  const { content, onReady } = useTechDocsReader();

  if (!content) return null;

  const config = {
    ADD_TAGS: ['link'],
    FORBID_TAGS: ['style'],
  };

  const hooks: TechDocsShadowDomHooks = {
    afterSanitizeAttributes,
  };

  const sanitizer = configApi.getOptionalConfig('techdocs.sanitizer');
  const allowedHosts = sanitizer?.getOptionalStringArray('allowedIframeHosts');
  if (allowedHosts) {
    config.ADD_TAGS.push('iframe');
    hooks.beforeSanitizeElements = beforeSanitizeElements(allowedHosts);
  }

  return (
    <TechDocsShadowDom
      source={content}
      config={config}
      hooks={hooks}
      onAttached={onReady}
    />
  );
};
```

Note that the example above uses the Backstage APIs, you can use any api you implement in your Backstage instance.

You might want to do some transformations on the DOM element attached to the Shadow Root and we encourage you to do this declaratively using React components.
With components, you can access the attached DOM via context by calling the `useTechDocsShadowDom` hook, encapsulate DOM manipulation inside a `useEffect` hook, and still benefit from calls from other hooks such as theme, apis, and more. Finally, you can return portals to elements that are inside the Shadow DOM!

**transformers.tsx**

```tsx
import { useTechDocsShadowDom } from '@backstage/plugin-techdocs';

import { Portal } from '@material-ui/core';
import FeedbackOutlinedIcon from '@material-ui/icons/FeedbackOutlined';

import { FeedbackLink } from './FeedbackLink';

const EDIT_LINK_SELECTOR = '[title="Edit this page"]';

export const FeedbackLinkTransformer = () => {
  const dom = useTechDocsShadowDom();

  const editLink = dom.querySelector<HTMLAnchorElement>(EDIT_LINK_SELECTOR);
  if (!editLink) return null;

  let container = dom.querySelector('#git-feedback-link');
  if (!container) {
    container = document.createElement('div');
    container?.setAttribute('id', 'git-feedback-link');
    editLink.insertAdjacentElement('beforebegin', container);
  }

  return (
    <Portal container={container}>
      <a
        className="md-content__button md-icon"
        title="Leave feedback for this page"
        target="_blank"
        href="https://..."
        style={{ paddingLeft: '5px' }}
      >
        <FeedbackOutlinedIcon />
      </a>
    </Portal>
  );
};
```

```tsx
import {
  useTechDocsReader,
  TechDocsShadowDom,
} from '@backstage/plugin-techdocs';

import { FeedbackLinkTransformer } from './transformers';

export const TechDocsReaderContent = () => {
  const { content, onReady } = useTechDocsReader();

  if (!content) null;

  return (
    <TechDocsShadowDom source={content} onAttached={onReady}>
      <FeedbackLinkTransformer />
    </TechDocsShadowDom>
  );
};
```
