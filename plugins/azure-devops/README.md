# Azure DevOps Plugin

Website: [https://dev.azure.com/](https://dev.azure.com/)

## Features

### Azure Pipelines

Lists the top _n_ builds for a given repository where _n_ is a configurable value

![Azure Pipelines Builds Example](./docs/azure-devops-builds.png)

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
          // Set defaultLimit to the max number of builds you would like to be able to see
          // the default if not set is 10
          <EntityAzurePipelinesContent defaultLimit={25} />
       </EntitySwitch.Case>
       // ...
     </EntitySwitch>
   ```

## Limitations

- Currently multiple organizations are not supported
- Mixing Azure DevOps Services (cloud) and Azure DevOps Server (on-premise) is not supported
