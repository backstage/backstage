# techdocs-mkdocs-react

A `web-library` that exports components for you to compose the `TechDocs` reader page with [mkdocs](https://www.mkdocs.org/).

## Usage

Create a custom reader page as follows:

```tsx
// packages/app/src/components/techdocs/TechDocsPage.tsx
import { TechDocsReaderPageLayout } from '@backstage/plugin-techdocs';
import { MkDocsReaderPage as TechDocsReaderPage } from '@backstage/plugin-techdocs-mkdocs-react';

const TechDocsPage = () => (
  <TechDocsReaderPage>
    {({ content }) => (
      <TechDocsReaderPageLayout>{content}</TechDocsReaderPageLayout>
    )}
  </TechDocsReaderPage>
);

export const techDocsPage = <TechDocsPage />; 👈
```

> **Important**: `MkDocsReaderPage` replaces the default reader page, so do not wrap it in a `TechDocsReaderPage`.

Now, render the custom page as a child of reader route:

```tsx
// packages/app/src/App.tsx
import { TechDocsReaderPage } from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import {
  ExpandableNavigation,
  ReportIssue,
  TextSize,
} from '@backstage/plugin-techdocs-mkdocs-addons';
import { techDocsPage } from './components/techdocs';

<Route path="/docs/:namespace/:kind/:name/*" element={<TechDocsReaderPage />}>
  {techDocsPage} 👈
  <TechDocsAddons>
    <ExpandableNavigation />
    <ReportIssue />
    <TextSize />
  </TechDocsAddons>
</Route>;
```

And that's it :tada:!
