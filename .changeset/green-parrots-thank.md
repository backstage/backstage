---
'@backstage/plugin-azure-devops': patch
---

Azure DevOps frontend refactoring items from issue #7641

- Remove backend setup documentation and linked to the Azure DevOps backend plugin for these instructions
- Improved documentation to be easier to expand with new features in the future
- Removed Router based on feedback from maintainers
- Added tests for `getBuildResultComponent` and `getBuildStateComponent` from the BuildTable
