# Scorecards

This plugin represents scorecards which are rendered as a part of the default Backstage Tech Insights feature.
It provides UI for the scorecards as well as a check overview.

## Installation

### Install the plugin

```bash
# From your Backstage root directory
cd packages/app
yarn add @backstage/plugin-scorecards
```

### Adding the plugin to your `packages/app`

```tsx
// In packages/app/src/App.tsx

import { ScorecardsPage } from '@backstage/plugin-scorecards';

<Route path="/scorecards" element={<ScorecardsPage />} />;
```

3. Add Scorecards overview page to the EntityPage:

```tsx
// packages/app/src/components/catalog/EntityPage.tsx

import { ScorecardsPage } from '@backstage/plugin-scorecards';

const serviceEntityPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>
    ...
    <EntityLayout.Route path="/scorecards" title="Scorecards">
      <ScorecardsPage />
    </EntityLayout.Route>
    ...
  </EntityLayoutWrapper>
);
```

## Links

- [The Backstage homepage](https://backstage.io)
