# @backstage/plugin-techdocs-module-addons-contrib

A collection of community-contributed [TechDocs Addons](https://backstage.io/docs/features/techdocs/addons) that enhance the TechDocs reader experience in Backstage.

## Addons Included

- **ExpandableNavigation** — Adds a toggle button to expand/collapse the TechDocs sidebar navigation. The preferred state is persisted in local storage.
- **ReportIssue** — Lets users select text on a TechDocs page and open a GitHub or GitLab issue pre-filled with the selected content. Requires `edit_uri` to be configured for your docs.
- **TextSize** — Allows users to adjust the font size of TechDocs content.
- **LightBox** — Enables click-to-zoom on images within TechDocs pages.

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-techdocs-module-addons-contrib
```

## Usage

Wrap the desired addons inside `<TechDocsAddons>` on your TechDocs reader page:

```tsx
import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import {
  ExpandableNavigation,
  ReportIssue,
  TextSize,
  LightBox,
} from '@backstage/plugin-techdocs-module-addons-contrib';

const AppRoutes = () => {
  return (
    <FlatRoutes>
      <Route path="/docs" element={<TechDocsIndexPage />}>
        <DefaultTechDocsHome />
      </Route>
      <Route
        path="/docs/:namespace/:kind/:name/*"
        element={<TechDocsReaderPage />}
      >
        <TechDocsAddons>
          <ExpandableNavigation />
          <ReportIssue />
          <TextSize />
          <LightBox />
        </TechDocsAddons>
      </Route>
    </FlatRoutes>
  );
};
```

### ReportIssue

The `ReportIssue` addon supports custom templates via the `templateBuilder` prop:

```tsx
<ReportIssue
  templateBuilder={({ selection }) => ({
    title: `Documentation feedback: ${selection.title}`,
    body: `Selected text:\n> ${selection.text}`,
  })}
/>
```

For `ReportIssue` to work, your TechDocs pages must have an `edit_uri` configured. See the [TechDocs FAQ](https://backstage.io/docs/features/techdocs/faqs#is-it-possible-for-users-to-suggest-changes-or-provide-feedback-on-a-techdocs-page) for details.

## Dependencies

This plugin requires:

- `@backstage/plugin-techdocs` — The main TechDocs plugin
- `@backstage/plugin-techdocs-react` — For `TechDocsAddons` and addon APIs

## Links

- [TechDocs documentation](https://backstage.io/docs/features/techdocs/)
- [TechDocs Addons guide](https://backstage.io/docs/features/techdocs/addons)
- [The Backstage homepage](https://backstage.io)
