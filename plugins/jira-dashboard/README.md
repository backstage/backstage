# Jira Dashboard plugin

Welcome to the Jira Dashboard plugin!

## Introduction

The **Jira Dashboard** plugin allows you to fetch and display Jira issues for your entity. You get quickly access summaries to issues in your project in order to acieve more efficient project management and visibility. The issue overview can be customized to display the information that is relevant for that entity by defining specific Jira filters or components.

By default, the issues that are provided are **incoming issues**, **open issues** and **assigned to you**.

## Note

You will **need** to also perform the installation instructions in [Jira Dashboard Backend](https://github.com/backstage/backstage/tree/master/plugins/jira-dashboard-backend) in order for this plugin to work.

## Getting Started

First, install the plugin into your app:

```bash
# From your Backstage root directory
yarn add --cwd packages/app @backstage/plugin-jira-dashboard
```

Modify your entity page in `EntityPage.tsx` to include the `EntityJiraDashboardContent` component and the `isJiraDashboardAvailable` function exported from the plugin.

> NOTE: You can choose for which kind of entity you want to include the plugin by adding the plugin in that specific entity kind, for instance `serviceEntityPage` or `apiPage`.

The example below show how you can add the plugin to the `defaultEntityPage`:

```tsx
// In packages/app/src/components/catalog/Entity.tsx
import { EntityJiraDashboardContent } from '@backstage/plugin-jira-dashboard';
import { isJiraDashboardAvailable } from '@backstage/plugin-jira-dashboard';

const defaultEntityPage = (
  <EntityLayout.Route
    if={isJiraDashboardAvailable}
    path="/jira-dashboard"
    title="Jira Dashboard"
  >
    <EntityJiraDashboardContent />
  </EntityLayout.Route>
  ...
;
```

### Integration with the Catalog

To enable the Jira Dashboard plugin for your entity, the entity must have the following annotation:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    jira/project-key: # The key of the Jira project to track for this entity
```

### Optional annotations

If you want to track specific components or filters you can add the optional annotations `component` and `filters-ids`. You can specify an endless number of Jira components or filters for your entity.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    jira/project-key: # The key of the Jira project to track for this entity
    jira/component: component-name:component-name:component:name # Jira component name separated with :
    jira/filter-ids: 12345:67890:68965 # Jira filter id separated with :
```

## Layout

The issue overview is located under the tab "Jira Dashboard" on the entity page. The overview displays information about the specific Jira project, and then renders one table for each type of issue. For instance, you can see the priority, assignee and status for the issues.

![home](media/layout.png)
