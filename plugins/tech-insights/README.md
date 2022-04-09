# Tech Insights

This plugin provides the UI for the `@backstage/tech-insights-backend` plugin, in order to display results of the checks running following the rules and the logic defined in the `@backstage/tech-insights-backend` plugin itself.

Main areas covered by this plugin currently are:

- Providing an overview for default boolean checks in a form of Scorecards.

- Providing an option to render different custom components based on type of the checks running in the backend.

## Installation

### Install the plugin

```bash
# From your Backstage root directory
yarn add --cwd packages/app @backstage/plugin-tech-insights
```

### Add boolean checks overview (Scorecards) page to the EntityPage:

```tsx
// packages/app/src/components/catalog/EntityPage.tsx

import { EntityTechInsightsScorecardContent } from '@backstage/plugin-tech-insights';

const serviceEntityPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>
    ...
    <EntityLayout.Route path="/tech-insights" title="Scorecards">
      <EntityTechInsightsScorecardContent
        title="Customized title for the scorecard"
        description="Small description about scorecards"
      />
      <EntityTechInsightsScorecardContent
        title="Show only simpleTestCheck in this card"
        checksId={['simpleTestCheck']}
      />
    </EntityLayout.Route>
    ...
  </EntityLayoutWrapper>
);
```

It is not obligatory to pass title and description props to `EntityTechInsightsScorecardContent`. If those are left out, default values from `defaultCheckResultRenderers` in `CheckResultRenderer` will be taken, hence `Boolean scorecard` and `This card represents an overview of default boolean Backstage checks`.

You can pass an array `checksId` as a prop with the [Fact Retrievers ids](../tech-insights-backend#creating-fact-retrievers) to limit which checks you want to show in this card, If you don't pass, the default value is show all checks.

## Boolean Scorecard Example

If you follow the [Backend Example](https://github.com/backstage/backstage/tree/master/plugins/tech-insights-backend#backend-example), once the needed facts have been generated the boolean scorecard will look like this:

![Boolean Scorecard Example](./docs/boolean-scorecard-example.png)
