# techdocs-mkdocs-react

A `web-library` that exports components for you to compose the `TechDocs` reader page with [mkdocs](https://www.mkdocs.org/).

## Usage

Create a custom reader page as follows:

```tsx
// packages/app/src/components/techdocs/TechDocsPage.tsx
import { TechDocsReaderPage, TechDocsReaderPageLayout } from '@backstage/plugin-techdocs';
import { MkDocsReaderPage } from '@backstage/plugin-techdocs-mkdocs-react';

const TechDocsPage = () => (
  <TechDocsReaderPage component={MkDocsReaderPage}>
    {({ content }) => (
      <TechDocsReaderPageLayout>{content}</TechDocsReaderPageLayout>
    )}
  </TechDocsReaderPage>
);

export const techDocsPage = <TechDocsPage />; 👈
```

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
