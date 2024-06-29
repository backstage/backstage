# @backstage/backend-tasks

## 0.5.26-next.0

### Patch Changes

- 083eaf9: Fix bug where ISO durations could no longer be used for schedules
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.24

### Patch Changes

- 736bc3c: Marked all exports as deprecated and pointed at `@backstage/backend-plugin-api` and `@backstage/backend-defaults`
- ed473cd: Updated the `TaskScheduleDefinitionConfig` deprecated comment to point to `SchedulerServiceTaskScheduleDefinitionConfig`
- 6a576dc: Deprecate the legacy `TaskScheduler.fromConfig` method and stop using the `getVoidlogger` in tests files to reduce the dependency on the soon-to-deprecate `backstage-common` package.
- 1897169: More detailed deprecation messages
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.24-next.3

### Patch Changes

- 1897169: More detailed deprecation messages
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.24-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.24-next.1

### Patch Changes

- ed473cd: Updated the `TaskScheduleDefinitionConfig` deprecated comment to point to `SchedulerServiceTaskScheduleDefinitionConfig`
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1

## 0.5.24-next.0

### Patch Changes

- 736bc3c: Marked all exports as deprecated and pointed at `@backstage/backend-plugin-api` and `@backstage/backend-defaults`
- 6a576dc: Deprecate the legacy `TaskScheduler.fromConfig` method and stop using the `getVoidlogger` in tests files to reduce the dependency on the soon-to-deprecate `backstage-common` package.
- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.23

### Patch Changes

- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18

## 0.5.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.5.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.22

### Patch Changes

- d5a1fe1: Replaced winston logger with `LoggerService`
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.21

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.20

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.19

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## 0.5.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## 0.5.18-next.0

### Patch Changes

- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/types@1.1.1

## 0.5.15

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 6707216: The `TaskScheduler.fromConfig` method now accepts the `LegacyRootDatabaseService` interface rather than the full `DatabaseManager` implementation.
- b68248b: Updated dependency `cron` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.15-next.3

### Patch Changes

- 6707216: The `TaskScheduler.fromConfig` method now accepts the `LegacyRootDatabaseService` interface rather than the full `DatabaseManager` implementation.
- b68248b: Updated dependency `cron` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.15-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.2

## 0.5.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.13

### Patch Changes

- d8f488a: Allow tasks to run more often that the default work check interval, which is 5 seconds.
- 0cbb03b: Fixing regular expression ReDoS with zod packages. Upgrading to latest. ref: https://security.snyk.io/vuln/SNYK-JS-ZOD-5925617
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.13-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.13-next.0

### Patch Changes

- d8f488aaa8: Allow tasks to run more often that the default work check interval, which is 5 seconds.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.12

### Patch Changes

- 013611b42e: `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.
- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.12-next.2

### Patch Changes

- [#20570](https://github.com/backstage/backstage/pull/20570) [`013611b42e`](https://github.com/backstage/backstage/commit/013611b42ed457fefa9bb85fddf416cf5e0c1f76) Thanks [@freben](https://github.com/freben)! - `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.2

## 0.5.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.5.11

### Patch Changes

- 5db102bfdf: Instrument `backend-tasks` with some counters and histograms for duration.

  `backend_tasks.task.runs.count`: Counter with the total number of times a task has been run.
  `backend_tasks.task.runs.duration`: Histogram with the run durations for each task.

  Both these metrics have come with `result` `taskId` and `scope` labels for finer grained grouping.

- ddd76ac98d: Fix bug where backend tasks that are defined with HumanDuration are immediately triggered on application startup
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/errors@1.2.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.5.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/errors@1.2.3-next.0
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1

## 0.5.10-next.1

### Patch Changes

- 5db102bfdf: Instrument `backend-tasks` with some counters and histograms for duration.

  `backend_tasks.task.runs.count`: Counter with the total number of times a task has been run.
  `backend_tasks.task.runs.duration`: Histogram with the run durations for each task.

  Both these metrics have come with `result` `taskId` and `scope` labels for finer grained grouping.

- ddd76ac98d: Fix bug where backend tasks that are defined with HumanDuration are immediately triggered on application startup
- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1

## 0.5.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1

## 0.5.8

### Patch Changes

- 8fd91547cd0b: When starting a task that existed before, with a faster schedule than it
  previously had, the task will now correctly obey the faster schedule
  immediately. Before this fix, the new schedule was only obeyed after the next
  pending (according to the old schedule) run had completed.
- 62f448edb0b5: Use `readDurationFromConfig` from the config package
- 74604806aae8: Avoid starting task janitor in tests.
- cfc3ca6ce060: Changes needed to support MySQL
- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1

## 0.5.8-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-common@0.19.5-next.3

## 0.5.8-next.2

### Patch Changes

- 814feeed7343: Update to handle invalid luxon values
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.5.8-next.1

### Patch Changes

- 62f448edb0b5: Use `readDurationFromConfig` from the config package
- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.5.7-next.0

### Patch Changes

- cfc3ca6ce060: Changes needed to support MySQL
- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.5.5

### Patch Changes

- dfd1b6b2fc33: Make `readTaskScheduleDefinitionFromConfig` properly handle bad inputs
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.5.5-next.2

### Patch Changes

- dfd1b6b2fc33: Make `readTaskScheduleDefinitionFromConfig` properly handle bad inputs
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.2

## 0.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.5.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.5.4

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.5.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/types@1.1.0
  - @backstage/errors@1.2.0
  - @backstage/config@1.0.8

## 0.5.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/types@1.0.2

## 0.5.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.5.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.5.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.5.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/config@1.0.7

## 0.5.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.5.1

### Patch Changes

- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.5.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.5.1-next.1

### Patch Changes

- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.5.0

### Minor Changes

- 1578276708a: add functionality to get descriptions from the scheduler for triggering

### Patch Changes

- f0685193efa: Added the adapted query to mysql and sqlite3 databases to not returning warning on logs
- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.5.0-next.2

### Minor Changes

- 1578276708a: add functionality to get descriptions from the scheduler for triggering

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/config@1.0.7-next.0

## 0.4.4-next.1

### Patch Changes

- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/types@1.0.2

## 0.4.4-next.0

### Patch Changes

- f0685193ef: Added the adapted query to mysql and sqlite3 databases to not returning warning on logs
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0

## 0.4.1

### Patch Changes

- 3fad4ed40a: Added a new static `TaskScheduler.forPlugin` method.
- b99c030f1b: Minor internal refactor to avoid import cycle issue.
- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.4.1-next.1

### Patch Changes

- b99c030f1b: Minor internal refactor to avoid import cycle issue.
- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.4.0

### Minor Changes

- de8a975911: Changed to use native `AbortController` and `AbortSignal` from Node.js, instead
  of the one from `node-abort-controller`. This is possible now that the minimum
  supported Node.js version of the project is 16.

  Note that their interfaces are very slightly different, but typically not in a
  way that matters to consumers. If you see any typescript errors as a direct
  result from this, they are compatible with each other in the ways that we
  interact with them, and should be possible to type-cast across without ill
  effects.

### Patch Changes

- b05dcd5530: Move the `zod` dependency to a version that does not collide with other libraries
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/config@1.0.5

## 0.4.0-next.3

### Patch Changes

- b05dcd5530: Move the `zod` dependency to a version that does not collide with other libraries
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/types@1.0.2-next.1

## 0.4.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/types@1.0.2-next.1

## 0.4.0-next.1

### Minor Changes

- de8a975911: Changed to use native `AbortController` and `AbortSignal` from Node.js, instead
  of the one from `node-abort-controller`. This is possible now that the minimum
  supported Node.js version of the project is 16.

  Note that their interfaces are very slightly different, but typically not in a
  way that matters to consumers. If you see any typescript errors as a direct
  result from this, they are compatible with each other in the ways that we
  interact with them, and should be possible to type-cast across without ill
  effects.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1

## 0.3.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0

## 0.3.7

### Patch Changes

- 30e43717c7: Deprecated the `HumanDuration` type, which should now instead be imported from `@backstage/types`.
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/types@1.0.1
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.3.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/types@1.0.1-next.0

## 0.3.7-next.0

### Patch Changes

- 30e43717c7: Deprecated the `HumanDuration` type, which should now instead be imported from `@backstage/types`.
- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.3.6

### Patch Changes

- d4fea86ea3: Added new function `readTaskScheduleDefinitionFromConfig` to read `TaskScheduleDefinition` (aka. schedule) from the `Config`.
- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/types@1.0.0

## 0.3.6-next.2

### Patch Changes

- d4fea86ea3: Added new function `readTaskScheduleDefinitionFromConfig` to read `TaskScheduleDefinition` (aka. schedule) from the `Config`.
- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/types@1.0.0

## 0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/types@1.0.0

## 0.3.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/types@1.0.0

## 0.3.5

### Patch Changes

- 243533ecdc: Added support to mysql on some raw queries
- 8872cc735d: Fixed a bug where the database option to skip migrations was ignored.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1

## 0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/backend-common@0.15.1-next.3

## 0.3.5-next.0

### Patch Changes

- 243533ecdc: Added support to mysql on some raw queries
- 8872cc735d: Fixed a bug where the database option to skip migrations was ignored.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0

## 0.3.4

### Patch Changes

- 29f782eb37: Updated dependency `@types/luxon` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.0

## 0.3.4-next.0

### Patch Changes

- 29f782eb37: Updated dependency `@types/luxon` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0

## 0.3.3

### Patch Changes

- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/errors@1.1.0

## 0.3.3-next.3

### Patch Changes

- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3

## 0.3.3-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2

## 0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0

## 0.3.2

### Patch Changes

- fde10d24f6: Allow tasks that fail to retry on a loop emitting a warning log every time it fails with the amount of attempts it has
- f7146b516f: Updated dependency `cron` to `^2.0.0`.
  Updated dependency `@types/cron` to `^2.0.0`.
- 7f108513b8: Add error logging when a background task throws an error rather than silently swallowing it.
- Updated dependencies
  - @backstage/backend-common@0.14.0

## 0.3.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2

## 0.3.2-next.1

### Patch Changes

- f7146b516f: Updated dependency `cron` to `^2.0.0`.
  Updated dependency `@types/cron` to `^2.0.0`.
- 7f108513b8: Add error logging when a background task throws an error rather than silently swallowing it.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1

## 0.3.2-next.0

### Patch Changes

- fde10d24f6: Allow tasks that fail to retry on a loop emitting a warning log every time it fails with the amount of attempts it has
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0

## 0.3.1

### Patch Changes

- 73480846dd: `TaskScheduleDefinition` has been updated to also accept an options object containing duration information in the form of days, hours, seconds and so on. This allows for scheduling without importing `luxon`.

  ```diff
  -import { Duration } from 'luxon';
  // omitted other code

  const schedule = env.scheduler.createScheduledTaskRunner({
  -  frequency: Duration.fromObject({ minutes: 10 }),
  -  timeout: Duration.fromObject({ minutes: 15 }),
  +  frequency: { minutes: 10 },
  +  timeout: { minutes: 15 },
     // omitted other code
  });
  ```

- cfd779a9bc: Scheduled tasks now have an optional `scope` field. If unset, or having the
  value `'global'`, the old behavior with cross-worker locking is retained. If
  having the value `'local'`, there is no coordination across workers and the
  behavior is more like `setInterval`. This can be used to replace usages of
  `runPeriodically` helpers.
- ebbec677e1: Correctly set next run time for tasks
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/config@1.0.1

## 0.3.1-next.1

### Patch Changes

- 73480846dd: `TaskScheduleDefinition` has been updated to also accept an options object containing duration information in the form of days, hours, seconds and so on. This allows for scheduling without importing `luxon`.

  ```diff
  -import { Duration } from 'luxon';
  // omitted other code

  const schedule = env.scheduler.createScheduledTaskRunner({
  -  frequency: Duration.fromObject({ minutes: 10 }),
  -  timeout: Duration.fromObject({ minutes: 15 }),
  +  frequency: { minutes: 10 },
  +  timeout: { minutes: 15 },
     // omitted other code
  });
  ```

- ebbec677e1: Correctly set next run time for tasks
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0

## 0.3.1-next.0

### Patch Changes

- cfd779a9bc: Scheduled tasks now have an optional `scope` field. If unset, or having the
  value `'global'`, the old behavior with cross-worker locking is retained. If
  having the value `'local'`, there is no coordination across workers and the
  behavior is more like `setInterval`. This can be used to replace usages of
  `runPeriodically` helpers.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0

## 0.3.0

### Minor Changes

- ab008a0988: Adds the ability to manually trigger tasks which are registered

### Patch Changes

- bdd2773202: Refactored the internal `TaskWorker` class to make it easier to test.
- a83babdd63: Fixed the `initialDelay` parameter of tasks to properly make task workers
  _always_ wait before the first invocations on startup, not just the very first
  time that the task is ever created. This behavior is more in line with
  expectations. Callers to not need to update their code.

  Also clarified in the doc comment for the field that this wait applies only on
  an individual worker level. That is, if you have a cluster of workers then each
  individual machine may postpone its first task invocation by the given amount of
  time to leave room for the service to settle, but _other_ workers may still
  continue to invoke the task on the regular cadence in the meantime.

- Updated dependencies
  - @backstage/backend-common@0.13.2

## 0.3.0-next.2

### Patch Changes

- a83babdd63: Fixed the `initialDelay` parameter of tasks to properly make task workers
  _always_ wait before the first invocations on startup, not just the very first
  time that the task is ever created. This behavior is more in line with
  expectations. Callers to not need to update their code.

  Also clarified in the doc comment for the field that this wait applies only on
  an individual worker level. That is, if you have a cluster of workers then each
  individual machine may postpone its first task invocation by the given amount of
  time to leave room for the service to settle, but _other_ workers may still
  continue to invoke the task on the regular cadence in the meantime.

## 0.3.0-next.1

### Minor Changes

- ab008a0988: Adds the ability to manually trigger tasks which are registered

### Patch Changes

- bdd2773202: Refactored the internal `TaskWorker` class to make it easier to test.
- Updated dependencies
  - @backstage/backend-common@0.13.2-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.0

## 0.2.1

### Patch Changes

- efc73db10c: Use `better-sqlite3` instead of `@vscode/sqlite3`
- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0

## 0.2.0

### Minor Changes

- 9461f73643: **BREAKING**: The `TaskDefinition` type has been removed, and replaced by the equal pair `TaskScheduleDefinition` and `TaskInvocationDefinition`. The interface for `PluginTaskScheduler.scheduleTask` stays effectively unchanged, so this only affects you if you use the actual types directly.

  Added the method `PluginTaskScheduler.createTaskSchedule`, which returns a `TaskSchedule` wrapper that is convenient to pass down into classes that want to control their task invocations while the caller wants to retain control of the actual schedule chosen.

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- 7290dda9d4: Relaxed the task ID requirement to now support any non-empty string
- ae2ed04076: Add support for cron syntax to configure task frequency - `TaskScheduleDefinition.frequency` can now be both a `Duration` and an object on the form `{ cron: string }`, where the latter is expected to be on standard crontab format (e.g. `'0 */2 * * *'`).
- Updated dependencies
  - @backstage/backend-common@0.13.0

## 0.2.0-next.0

### Minor Changes

- 9461f73643: **BREAKING**: The `TaskDefinition` type has been removed, and replaced by the equal pair `TaskScheduleDefinition` and `TaskInvocationDefinition`. The interface for `PluginTaskScheduler.scheduleTask` stays effectively unchanged, so this only affects you if you use the actual types directly.

  Added the method `PluginTaskScheduler.createTaskSchedule`, which returns a `TaskSchedule` wrapper that is convenient to pass down into classes that want to control their task invocations while the caller wants to retain control of the actual schedule chosen.

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- 7290dda9d4: Relaxed the task ID requirement to now support any non-empty string
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0

## 0.1.9

### Patch Changes

- dc97845422: Only output janitor logs when actually timing out tasks
- Updated dependencies
  - @backstage/backend-common@0.11.0

## 0.1.8

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/types@0.1.3

## 0.1.7

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/errors@0.2.1
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2

## 0.1.6

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.1.6-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/errors@0.2.0

## 0.1.2

### Patch Changes

- e188b37024: Updated README to clarify the following:

  - Dashes cannot be used in the `id`, changed to an underscore in the example
  - The `timeout` is required, this was also added to the example
  - Added a note about tasks not running as expected for local development using persistent database

- Updated dependencies
  - @backstage/backend-common@0.10.2

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
