# @backstage/plugin-tech-insights-backend-module-jsonfc

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
