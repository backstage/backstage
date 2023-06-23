# TechDocs Backend Module Events

Welcome to the TechDocs Backend Module for Events! This module contains subscribers that will listen for events from Azure DevOps, Bitbucket Server, and GitHub and then trigger a refresh of the relevant entities TechDocs

## Setup

The following sections will help you get the TechDocs Backend Module for Events setup and running

### Up and Running

1. First you need to setup the [Events Backend](https://github.com/backstage/backstage/tree/master/plugins/events-backend)
2. Then we need to add the `@backstage/plugin-techdocs-backend-module-events` package to your backend:

   ```sh
   # From the Backstage root directory
   yarn add --cwd packages/backend @backstage/plugin-techdocs-backend-module-events
   ```

3. Next we will edit the `packages/backend/src/plugins/events.ts` file to add an import:

   - For Azure DevOps: `import { AzureDevOpsTechDocsEventSubscriber } from '@backstage/plugin-techdocs-backend-module-events';`
   - For Bitbucket Server: `import { BitbucketServerTechDocsEventSubscriber } from '@backstage/plugin-techdocs-backend-module-events';`
   - For GitHub: `import { GithubTechDocsEventSubscriber } from '@backstage/plugin-techdocs-backend-module-events';`

4. Now we will add the subscriber we imported like this:

   - For Azure DevOps: `.addSubscribers(azureDevOpsTechDocsEventSubscriber)`
   - For Bitbucket Server: `.addSubscribers(bitbucketServerTechDocsEventSubscriber)`
   - For GitHub: `.addSubscribers(gitHubTechDocsEventSubscriber)`

5. You now have you Backstage instance setup to receive events that will trigger TechDocs to refresh its content!
