# @backstage/plugin-tech-insights-backend-module-jsonfc

## 0.1.42-next.2

### Patch Changes

- 25cfb76: Add support for the new backend system.

  A new backend module for the tech-insights backend
  was added and exported as `default`.

  The module will register the `JsonRulesEngineFactCheckerFactory`
  as `FactCheckerFactory`, loading checks from the config.

  You can use it with the new backend system like

  ```ts title="packages/backend/src/index.ts"
  backend.add(import('@backstage/plugin-tech-insights-backend-module-jsonfc'));
  ```

- bc72782: Support loading `TechInsightsJsonRuleCheck` instances from config.

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

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/plugin-tech-insights-node@0.4.16-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.1.42-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.16-next.1

## 0.1.42-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-tech-insights-node@0.4.16-next.0
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.1.41

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/plugin-tech-insights-node@0.4.15
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.1.41-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-tech-insights-node@0.4.15-next.2

## 0.1.41-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/plugin-tech-insights-node@0.4.15-next.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.1.41-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/plugin-tech-insights-node@0.4.15-next.0
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.1.40

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-tech-insights-node@0.4.14
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.1.40-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.14-next.3

## 0.1.40-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.14-next.2

## 0.1.40-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.14-next.1

## 0.1.40-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/plugin-tech-insights-node@0.4.14-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.1.39

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.13

## 0.1.39-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-tech-insights-node@0.4.13-next.2

## 0.1.39-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/plugin-tech-insights-node@0.4.13-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.1.39-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.13-next.0

## 0.1.38

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-node@0.4.12
  - @backstage/config@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.1.38-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/errors@1.2.3-next.0
  - @backstage/plugin-tech-insights-node@0.4.12-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.1.37-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/plugin-tech-insights-node@0.4.11-next.1
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/plugin-tech-insights-common@0.2.12

## 0.1.37-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.11-next.0

## 0.1.35

### Patch Changes

- 51b801f743b2: Handle extracting facts from 'not' conditions too
- Updated dependencies
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.9

## 0.1.35-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/plugin-tech-insights-common@0.2.12-next.0
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/plugin-tech-insights-node@0.4.9-next.3

## 0.1.35-next.2

### Patch Changes

- 51b801f743b2: Handle extracting facts from 'not' conditions too
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-tech-insights-node@0.4.9-next.2
  - @backstage/errors@1.2.1
  - @backstage/plugin-tech-insights-common@0.2.11

## 0.1.35-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/plugin-tech-insights-node@0.4.9-next.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-tech-insights-common@0.2.11

## 0.1.34-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-tech-insights-common@0.2.11
  - @backstage/plugin-tech-insights-node@0.4.8-next.0

## 0.1.32

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/plugin-tech-insights-node@0.4.6
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-tech-insights-common@0.2.11

## 0.1.32-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-tech-insights-node@0.4.6-next.2

## 0.1.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-tech-insights-node@0.4.6-next.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-tech-insights-common@0.2.11

## 0.1.32-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-tech-insights-common@0.2.11
  - @backstage/plugin-tech-insights-node@0.4.6-next.0

## 0.1.31

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/config@1.0.8
  - @backstage/plugin-tech-insights-common@0.2.11
  - @backstage/plugin-tech-insights-node@0.4.5

## 0.1.31-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-tech-insights-common@0.2.11
  - @backstage/plugin-tech-insights-node@0.4.5-next.0

## 0.1.30

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/errors@1.2.0
  - @backstage/plugin-tech-insights-node@0.4.4
  - @backstage/config@1.0.8
  - @backstage/plugin-tech-insights-common@0.2.11

## 0.1.30-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.4-next.2

## 0.1.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/plugin-tech-insights-node@0.4.4-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-tech-insights-common@0.2.10

## 0.1.30-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.4-next.0

## 0.1.29

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/plugin-tech-insights-node@0.4.3
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-tech-insights-common@0.2.10

## 0.1.29-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-tech-insights-node@0.4.3-next.1
  - @backstage/config@1.0.7

## 0.1.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/plugin-tech-insights-node@0.4.3-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-tech-insights-common@0.2.10

## 0.1.28

### Patch Changes

- 9cb1db6546a: When multiple fact retrievers are used for a check, allow for cases where only one returns a given fact
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/plugin-tech-insights-node@0.4.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-tech-insights-common@0.2.10

## 0.1.28-next.2

### Patch Changes

- 9cb1db6546a: When multiple fact retrievers are used for a check, allow for cases where only one returns a given fact
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.2-next.2

## 0.1.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.2-next.1

## 0.1.28-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.2-next.0

## 0.1.27

### Patch Changes

- 65454876fb2: Minor API report tweaks
- Updated dependencies
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/config@1.0.7
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.1

## 0.1.27-next.2

### Patch Changes

- 65454876fb2: Minor API report tweaks
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/plugin-tech-insights-node@0.4.1-next.2
  - @backstage/config@1.0.7-next.0

## 0.1.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.1-next.1

## 0.1.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.1-next.0

## 0.1.26

### Patch Changes

- d6b912f963: Surface the cause of the json rules engine
- Updated dependencies
  - @backstage/backend-common@0.18.2
  - @backstage/plugin-tech-insights-common@0.2.10
  - @backstage/plugin-tech-insights-node@0.4.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4

## 0.1.26-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-tech-insights-common@0.2.10-next.0
  - @backstage/plugin-tech-insights-node@0.4.0-next.2

## 0.1.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-tech-insights-common@0.2.10-next.0
  - @backstage/plugin-tech-insights-node@0.4.0-next.1
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4

## 0.1.26-next.0

### Patch Changes

- d6b912f963: Surface the cause of the json rules engine
- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-tech-insights-node@0.3.10-next.0

## 0.1.24

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-tech-insights-common@0.2.9
  - @backstage/plugin-tech-insights-node@0.3.8

## 0.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/plugin-tech-insights-node@0.3.8-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-tech-insights-common@0.2.9

## 0.1.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-tech-insights-common@0.2.9
  - @backstage/plugin-tech-insights-node@0.3.8-next.0

## 0.1.23

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/errors@1.1.4
  - @backstage/config@1.0.5
  - @backstage/plugin-tech-insights-common@0.2.9
  - @backstage/plugin-tech-insights-node@0.3.7

## 0.1.23-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-tech-insights-common@0.2.9-next.1
  - @backstage/plugin-tech-insights-node@0.3.7-next.3

## 0.1.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/plugin-tech-insights-node@0.3.7-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-tech-insights-common@0.2.9-next.1

## 0.1.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-tech-insights-node@0.3.7-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-tech-insights-common@0.2.9-next.1

## 0.1.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0
  - @backstage/plugin-tech-insights-common@0.2.9-next.0
  - @backstage/plugin-tech-insights-node@0.3.7-next.0

## 0.1.22

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-tech-insights-node@0.3.6
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3
  - @backstage/plugin-tech-insights-common@0.2.8

## 0.1.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/plugin-tech-insights-node@0.3.6-next.1
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/plugin-tech-insights-common@0.2.8-next.0

## 0.1.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-tech-insights-node@0.3.6-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/plugin-tech-insights-common@0.2.8-next.0

## 0.1.21

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-tech-insights-node@0.3.5
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/plugin-tech-insights-common@0.2.7

## 0.1.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-tech-insights-node@0.3.5-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/plugin-tech-insights-common@0.2.7-next.2

## 0.1.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/plugin-tech-insights-common@0.2.7-next.1
  - @backstage/plugin-tech-insights-node@0.3.5-next.1

## 0.1.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-tech-insights-node@0.3.5-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/plugin-tech-insights-common@0.2.7-next.0

## 0.1.20

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-tech-insights-node@0.3.4
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1

## 0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/plugin-tech-insights-node@0.3.4-next.1

## 0.1.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/plugin-tech-insights-node@0.3.4-next.0

## 0.1.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/plugin-tech-insights-common@0.2.6
  - @backstage/plugin-tech-insights-node@0.3.3

## 0.1.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/plugin-tech-insights-common@0.2.6-next.0
  - @backstage/plugin-tech-insights-node@0.3.3-next.0

## 0.1.18

### Patch Changes

- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/plugin-tech-insights-common@0.2.5
  - @backstage/plugin-tech-insights-node@0.3.2
  - @backstage/errors@1.1.0

## 0.1.18-next.2

### Patch Changes

- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/plugin-tech-insights-common@0.2.5-next.0
  - @backstage/plugin-tech-insights-node@0.3.2-next.1

## 0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0

## 0.1.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/plugin-tech-insights-node@0.3.2-next.0

## 0.1.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0
  - @backstage/plugin-tech-insights-node@0.3.1

## 0.1.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/plugin-tech-insights-node@0.3.1-next.1

## 0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/plugin-tech-insights-node@0.3.1-next.0

## 0.1.16

### Patch Changes

- 58e2c46151: Updated usages of `buildTechInsightsContext` in README.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-tech-insights-node@0.3.0
  - @backstage/config@1.0.1

## 0.1.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-tech-insights-node@0.3.0-next.2

## 0.1.16-next.1

### Patch Changes

- 58e2c46151: Updated usages of `buildTechInsightsContext` in README.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.1
  - @backstage/plugin-tech-insights-node@0.3.0-next.1

## 0.1.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/plugin-tech-insights-node@0.2.10-next.0

## 0.1.15

### Patch Changes

- e0a51384ac: build(deps): bump `ajv` from 7.0.3 to 8.10.0
- ab008a0988: Removes node-cron from tech-insights to utilize backend-tasks
- Updated dependencies
  - @backstage/plugin-tech-insights-node@0.2.9
  - @backstage/backend-common@0.13.2

## 0.1.15-next.1

### Patch Changes

- ab008a0988: Removes node-cron from tech-insights to utilize backend-tasks
- Updated dependencies
  - @backstage/plugin-tech-insights-node@0.2.9-next.1
  - @backstage/backend-common@0.13.2-next.1

## 0.1.15-next.0

### Patch Changes

- e0a51384ac: build(deps): bump `ajv` from 7.0.3 to 8.10.0
- Updated dependencies
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/plugin-tech-insights-node@0.2.9-next.0

## 0.1.14

### Patch Changes

- 89c7e47967: Minor README update
- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/plugin-tech-insights-common@0.2.4
  - @backstage/plugin-tech-insights-node@0.2.8

## 0.1.13

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-tech-insights-node@0.2.7

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-tech-insights-node@0.2.7-next.0

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-tech-insights-node@0.2.6

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/plugin-tech-insights-node@0.2.5

## 0.1.10

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/plugin-tech-insights-common@0.2.3
  - @backstage/plugin-tech-insights-node@0.2.4

## 0.1.9

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/errors@0.2.1
  - @backstage/config@0.1.14
  - @backstage/plugin-tech-insights-common@0.2.2
  - @backstage/plugin-tech-insights-node@0.2.3

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7
  - @backstage/plugin-tech-insights-node@0.2.2

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/plugin-tech-insights-node@0.2.2-next.0

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6
  - @backstage/plugin-tech-insights-node@0.2.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/plugin-tech-insights-node@0.2.1-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/plugin-tech-insights-node@0.2.0

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-tech-insights-node@0.2.0-next.0

## 0.1.5

### Patch Changes

- a60eb0f0dd: adding new operation to run checks for multiple entities in one request
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/plugin-tech-insights-common@0.2.1
  - @backstage/errors@0.2.0

## 0.1.4

### Patch Changes

- 8d00dc427c: ability to add custom operators
- Updated dependencies
  - @backstage/backend-common@0.10.1

## 0.1.3

### Patch Changes

- 6ff4408fa6: RunChecks endpoint now handles missing retriever data in checks. Instead of
  showing server errors, the checks will be shown for checks whose retrievers have
  data, and a warning will be shown if no checks are returned.
- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/plugin-tech-insights-node@0.1.2

## 0.1.2

### Patch Changes

- c6c8b8e53e: Minor fixes in Readme to make the examples more directly usable.
- Updated dependencies
  - @backstage/plugin-tech-insights-common@0.2.0
  - @backstage/backend-common@0.9.12
  - @backstage/plugin-tech-insights-node@0.1.1

## 0.1.1

### Patch Changes

- 2017de90da: Update README docs to use correct function/parameter names
- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/backend-common@0.9.11
