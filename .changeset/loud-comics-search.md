---
'@backstage/plugin-tech-insights': minor
---

Added the possibility to display check results of different types on a single scorecard.

- **BREAKING** Removed the `getScorecardsDefinition` method from the `TechInsightsApi` interface. Added the `getCheckResultRenderers` method that returns rendering components for given types.
- **BREAKING** The `CheckResultRenderer` type now exposes the `component` factory method that creates a React component used to display a result of a provided check result.
- The `TechInsightsClient` constructor accepts now the optional `renderers` parameter that can be used to inject a custom renderer.
- **BREAKING** The `title` parameter in the `EntityTechInsightsScorecardContent` and `EntityTechInsightsScorecardCard` components is now mandatory.
- The `jsonRulesEngineCheckResultRenderer` used to render `json-rules-engine` check results is exported.
- The `BooleanCheck` component that can be used to render other check results types is also exported.

If you were overriding the `getScorecardsDefinition` method to adjust the rendering of check results, you should now provide a custom renderer using `renderers` parameter in the `TechInsightsClient` class.

See the [README](https://github.com/backstage/backstage/tree/master/plugins/tech-insights/README.md) for more details.
