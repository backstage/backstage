# Tech Insights Backend JSON Rules engine fact checker module

This is an extension to module to tech-insights-backend plugin, which provides basic framework and functionality to implement tech insights within Backstage.

This module provides functionality to run checks against a `json-rules-engine` and provide boolean logic by simply building checks using JSON conditions.

## Getting started

To add this FactChecker into your Tech Insights you need to install the module into your backend application:

```bash
# From your Backstage root directory
cd packages/backend
yarn add @backstage/plugin-tech-insights-backend-module-jsonfc
```

and modify the `techInsights.ts` file to contain a reference to the FactCheckers implementation.

```diff
+ import { JsonRulesEngineFactCheckerFactory } from '@backstage/plugin-tech-insights-backend-module-jsonfc';

+ const myFactCheckerFactory = new JsonRulesEngineFactCheckerFactory({
+    checks: [],
+    logger,
+  }),

const builder = new DefaultTechInsightsBuilder({
logger,
config,
database,
discovery,
factRetrievers: [myFactRetrieverRegistration],
+ factCheckerFactory: myFactCheckerFactory
});
```

By default this implementation comes with an in-memory storage to store checks. You can inject an additional data store by adding an implementation of `TechInsightCheckRegistry` into the constructor options when creating a `JsonRulesEngineFactCheckerFactory`. That can be done as follows

```diff
const myTechInsightCheckRegistry: TechInsightCheckRegistry<MyCheckType> = // snip
const myFactCheckerFactory = new JsonRulesEngineFactCheckerFactory({
  checks: [],
  logger,
+ checkRegistry: myTechInsightCheckRegistry
}),

```

## Adding checks

Checks for this FactChecker are constructed as `json-rules-engine` compatible JSON rules. A check could look like the following for example:

```ts
import { TechInsightJsonRuleCheck } from '../types';

export const exampleCheck: TechInsightJsonRuleCheck = {
  id: 'demodatacheck', // Unique identifier of this check
  name: 'demodatacheck', // A human readable name of this check to be displayed in the UI
  description: 'A fact check for demoing purposes', // A description to be displayed in the UI
  factRefs: ['demo-poc.factretriever'], // References to fact containers that this check uses. See documentation on FactRetrievers for more information on these
  rule: {
    // The actual rule
    conditions: {
      all: [
        // 2 options are available, all and any conditions.
        {
          fact: 'examplenumberfact', // Reference to an individual fact to check against
          operator: 'greaterThanInclusive', // Operator to use. See: https://github.com/CacheControl/json-rules-engine/blob/master/docs/rules.md#operators for more
          value: 2, // The threshold value that the fact must satisfy
        },
      ],
    },
  },
  successMetadata: {
    // Additional metadata to be returned if the check has passed
    link: 'https://link.to.some.information.com',
  },
  failureMetadata: {
    // Additional metadata to be returned if the check has failed
    link: 'https://sonar.mysonarqube.com/increasing-number-value',
  },
};
```
