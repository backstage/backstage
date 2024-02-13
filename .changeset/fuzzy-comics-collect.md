---
'@backstage/plugin-tech-insights-backend-module-jsonfc': patch
---

Support loading `TechInsightsJsonRuleCheck` instances from config.

Uses the check `id` as key.

Example:

```yaml title="app-config.yaml"
techInsights:
  factChecker:
    checks:
      groupOwnerCheck:
        type: json-rules-engine
        name: Group Owner Check
        description: Verifies that a group has been set as the spec.owner for this entity
        factIds:
          - entityOwnershipFactRetriever
        rule:
          conditions:
            all:
              - fact: hasGroupOwner
                operator: equal
                value: true
```
