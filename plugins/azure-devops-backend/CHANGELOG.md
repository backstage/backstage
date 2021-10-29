# @backstage/plugin-azure-devops-backend

## 0.1.4

### Patch Changes

- 2eebc9bac3: Added duration (startTime and finishTime) and identity (uniqueName) to the RepoBuild results. Also did a bit of refactoring to help finish up the backend items in issue #7641
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/backend-common@0.9.8

## 0.1.3

### Patch Changes

- f67dff0d20: Re-exported types from azure-devops-node-api in @backstage/plugin-azure-devops-backend.
- Updated dependencies
  - @backstage/backend-common@0.9.7

## 0.1.2

### Patch Changes

- a23206049f: Updates function for mapping RepoBuilds to handle undefined properties
- b7c0585471: Expands the Azure DevOps backend plugin to provide pull request data to be used by the front end plugin

## 0.1.1

### Patch Changes

- 299b43f052: Marked all configuration values as required in the schema.
- Updated dependencies
  - @backstage/backend-common@0.9.5
