# Azure DevOps Plugin

Website: [https://dev.azure.com/](https://dev.azure.com/)

## Features

### Azure Pipelines

Lists the top _n_ builds for a given Azure Repo where _n_ is a configurable value

![Azure Pipelines Builds Example](./docs/azure-devops-builds.png)

### Azure Repos

Lists the top _n_ Active, Completed, or Abandoned Pull Requests for a given repository where _n_ is a configurable value

![Azure Repos Pull Requests Example](./docs/azure-devops-pull-requests.png)

## Setup

The following sections will help you get the Azure DevOps plugin setup and running

### Azure DevOps Backend

You need to setup the [Azure DevOps backend plugin](https://github.com/backstage/backstage/tree/master/plugins/azure-devops-backend) before you move forward with any of these steps if you haven't already

### Entity Annotation

To be able to use the Azure DevOps plugin you need to add the following annotation to any entities you want to use it with:

```yaml
dev.azure.com/project-repo: <project-name>/<repo-name>
```

Let's break this down a little: `<project-name>` will be the name of your Team Project and `<repo-name>` will be the name of your repository which needs to be part of the Team Project you entered for `<project-name>`.

Here's what that will look like in action:

```yaml
# Example catalog-info.yaml entity definition file
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    dev.azure.com/project-repo: my-project/my-repo
spec:
  type: service
  # ...
```

### Azure Pipelines Component

To get the Azure Pipelines component working you'll need to do the following two steps:

1. First we need to add the @backstage/plugin-azure-devops package to your frontend app:

   ```bash
   # From your Backstage root directory
   cd packages/app
   yarn add @backstage/plugin-azure-devops
   ```

2. Second we need to add the `EntityAzurePipelinesContent` extension to the entity page in your app:

   ```tsx
   // In packages/app/src/components/catalog/EntityPage.tsx
   import {
     EntityAzurePipelinesContent,
     isAzureDevOpsAvailable,
   } from '@backstage/plugin-azure-devops';

   // For example in the CI/CD section
   const cicdContent = (
     <EntitySwitch>
       // ...
       <EntitySwitch.Case if={isAzureDevOpsAvailable}>
          <EntityAzurePipelinesContent defaultLimit={25} />
       </EntitySwitch.Case>
       // ...
     </EntitySwitch>
   ```

**Notes:**

- The `if` prop is optional on the `EntitySwitch.Case`, you can remove it if you always want to see the tab even if the entity being viewed does not have the needed annotation
- The `defaultLimit` proper on the `EntityAzurePipelinesContent` will set the max number of Builds you would like to see, if not set this will default to 10

### Azure Repos Component

To get the Azure Repos component working you'll need to do the following two steps:

1. First we need to add the @backstage/plugin-azure-devops package to your frontend app:

   ```bash
   # From your Backstage root directory
   cd packages/app
   yarn add @backstage/plugin-azure-devops
   ```

2. Second we need to add the `EntityAzureReposContent` extension to the entity page in your app:

   ```tsx
   // In packages/app/src/components/catalog/EntityPage.tsx
   import {
     EntityAzureReposContent,
     isAzureDevOpsAvailable,
   } from '@backstage/plugin-azure-devops';

   // For example in the Service section
   const serviceEntityPage = (
     <EntityLayout>
       // ...
       <EntityLayout.Route if={isAzureDevOpsAvailable} path="/pull-requests" title="Pull Requests">
         <EntityAzureReposContent defaultLimit={25} />
       </EntityLayout.Route>
       // ...
     </EntityLayout>
   ```

**Notes:**

- You'll need to add the `EntityLayout.Route` above from step 2 to all the entity sections you want to see Pull Requests in. For example if you wanted to see Pull Requests when looking at Website entities then you would need to add this to the `websiteEntityPage` section.
- The `if` prop is optional on the `EntityLayout.Route`, you can remove it if you always want to see the tab even if the entity being viewed does not have the needed annotation
- The `defaultLimit` proper on the `EntityAzureReposContent` will set the max number of Pull Requests you would like to see, if not set this will default to 10

## Limitations

- Currently multiple organizations are not supported
- Mixing Azure DevOps Services (cloud) and Azure DevOps Server (on-premise) is not supported
