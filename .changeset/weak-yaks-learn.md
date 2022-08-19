---
'@backstage/plugin-azure-devops': minor
'@backstage/plugin-azure-devops-backend': minor
'@backstage/plugin-azure-devops-common': minor
---

Added README card for Azure Devops

**Before:**

Remember to check if you have already provided these settings previously, as we will need them for the reame card to work.

#### [Azure DevOps](https://github.com/backstage/backstage/blob/master/app-config.yaml#L48L51:~:text=azureDevOps%3A,%3A%20my%2Dcompany)

```yaml
# app-config.yaml
azureDevOps:
  host: dev.azure.com
  token: my-token
  organization: my-company
```

#### [Azure Integrations](https://github.com/backstage/backstage/blob/master/app-config.yaml#L48L51:~:text=azure%3A,%3A%20%24%7BAZURE_TOKEN%7D)

```yaml
# app-config.yaml
integrations:
    azure:
    - host: dev.azure.com
        token: ${AZURE_TOKEN}
```

**After:**

To get the README component working you'll need to do the following two steps:

1. First we need to add the @backstage/plugin-azure-devops package to your frontend app:

   ```bash
   # From your Backstage root directory
   yarn add --cwd packages/app @backstage/plugin-azure-devops
   ```

2. Second we need to add the `EntityAzureReadmeCard` extension to the entity page in your app:

   ```tsx
   // In packages/app/src/components/catalog/EntityPage.tsx
   import {
     EntityAzureReadmeCard,
     isAzureDevOpsAvailable,
   } from '@backstage/plugin-azure-devops';

   // As it is a card, you can customize it the way you prefer
   // For example in the Service section

   const overviewContent = (
     <Grid container spacing={3} alignItems="stretch">
       <EntitySwitch>
         <EntitySwitch.Case if={isAzureDevOpsAvailable}>
           <Grid item md={6}>
             ...
           </Grid>
           <Grid item md={6}>
             <EntityAzureReadmeCard maxHeight={350} />
           </Grid>
         </EntitySwitch.Case>
       </EntitySwitch>
     </Grid>
   );
   ```

**Notes:**

- You'll need to add the `EntitySwitch.Case` above from step 2 to all the entity sections you want to see Readme in. For example if you wanted to see Readme when looking at Website entities then you would need to add this to the `websiteEntityPage` section.
- The `if` prop is optional on the `EntitySwitch.Case`, you can remove it if you always want to see the tab even if the entity being viewed does not have the needed annotation
- The `maxHeight` property on the `EntityAzureReadmeCard` will set the maximum screen size you would like to see, if not set it will default to 100%
