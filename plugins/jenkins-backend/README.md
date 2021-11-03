# Jenkins Plugin (Alpha)

Welcome to the Jenkins backend plugin! Website: [https://jenkins.io/](https://jenkins.io/)

This is the backend half of the 2 Jenkins plugins and is responsible for:

- finding an appropriate instance of Jenkins for an entity
- finding the appropriate job(s) on that instance for an entity
- connecting to Jenkins and gathering data to present to the frontend

## Integrating into a backstage instance

This plugin needs to be added to an existing backstage instance.

```bash
# From your Backstage root directory
cd packages/backend
yarn add @backstage/plugin-jenkins-backend
```

Typically, this means creating a `src/plugins/jenkins.ts` file and adding a reference to it to `src/index.ts`

### jenkins.ts

```typescript
import {
  createRouter,
  DefaultJenkinsInfoProvider,
} from '@backstage/plugin-jenkins-backend';
import { CatalogClient } from '@backstage/catalog-client';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
  discovery,
}: PluginEnvironment): Promise<Router> {
  const catalog = new CatalogClient({ discoveryApi: discovery });

  return await createRouter({
    logger,
    jenkinsInfoProvider: DefaultJenkinsInfoProvider.fromConfig({
      config,
      catalog,
    }),
  });
}
```

This plugin must be provided with a JenkinsInfoProvider, this is a strategy object for finding the Jenkins instance and job for an entity.

There is a standard one provided, but the Integrator is free to build their own.

### DefaultJenkinsInfoProvider

Allows configuration of either a single or multiple global Jenkins instances and annotating entities with the job name on that instance (and optionally the name of the instance).

#### Example - Single global instance

The following will look for jobs for this entity at `https://jenkins.example.com/job/teamA/job/artistLookup-build`

Config

```yaml
jenkins:
  baseUrl: https://jenkins.example.com
  username: backstage-bot
  apiKey: 123456789abcdef0123456789abcedf012
```

Catalog

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-lookup
  annotations:
    'jenkins.io/job-full-name': teamA/artistLookup-build
```

The old annotation name of `jenkins.io/github-folder` is equivalent to `jenkins.io/job-full-name`

#### Example - Multiple global instances

The following will look for jobs for this entity at `https://jenkins-foo.example.com/job/teamA/job/artistLookup-build`

Config

```yaml
jenkins:
  instances:
    - name: default
      baseUrl: https://jenkins.example.com
      username: backstage-bot
      apiKey: 123456789abcdef0123456789abcedf012
    - name: departmentFoo
      baseUrl: https://jenkins-foo.example.com
      username: backstage-bot
      apiKey: 123456789abcdef0123456789abcedf012
```

Catalog

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-lookup
  annotations:
    'jenkins.io/job-full-name': departmentFoo:teamA/artistLookup-build
```

If the `departmentFoo:` part is omitted, the default instance will be assumed.

The following config is an equivalent (but less clear) version of the above:

```yaml
jenkins:
  baseUrl: https://jenkins.example.com
  username: backstage-bot
  apiKey: 123456789abcdef0123456789abcedf012
  instances:
    - name: departmentFoo
      baseUrl: https://jenkins-foo.example.com
      username: backstage-bot
      apiKey: 123456789abcdef0123456789abcedf012
```

### Custom JenkinsInfoProvider

An example of a bespoke JenkinsInfoProvider which uses an organisation specific annotation to look up the Jenkins info (including jobFullName):

```typescript
class AcmeJenkinsInfoProvider implements JenkinsInfoProvider {
  constructor(private readonly catalog: CatalogClient) {}

  async getInstance(opt: {
    entityRef: EntityName;
    jobFullName?: string;
  }): Promise<JenkinsInfo> {
    const PAAS_ANNOTATION = 'acme.example.com/paas-project-name';

    // lookup pass-project-name from entity annotation
    const entity = await this.catalog.getEntityByName(opt.entityRef);
    if (!entity) {
      throw new Error(
        `Couldn't find entity with name: ${stringifyEntityRef(opt.entityRef)}`,
      );
    }

    const paasProjectName = entity.metadata.annotations?.[PAAS_ANNOTATION];
    if (!paasProjectName) {
      throw new Error(
        `Couldn't find paas annotation (${PAAS_ANNOTATION}) on entity with name: ${stringifyEntityRef(
          opt.entityRef,
        )}`,
      );
    }

    // lookup department and team for paas project name
    const { team, dept } = this.lookupPaasInfo(paasProjectName);

    const baseUrl = `https://jenkins-${dept}.example.com/`;
    const jobFullName = `${team}/${paasProjectName}`;
    const username = 'backstage-bot';
    const apiKey = this.getJenkinsApiKey(paasProjectName);
    const creds = btoa(`${username}:${apiKey}`);

    return {
      baseUrl,
      headers: {
        Authorization: `Basic ${creds}`,
      },
      jobFullName,
    };
  }

  private lookupPaasInfo(_: string): { team: string; dept: string } {
    // Mock implementation, this would get info from the paas system somehow in reality.
    return {
      team: 'teamA',
      dept: 'DepartmentFoo',
    };
  }

  private getJenkinsApiKey(_: string): string {
    // Mock implementation, this would get info from the paas system somehow in reality.
    return '123456789abcdef0123456789abcedf012';
  }
}
```

No config would be needed if using this JenkinsInfoProvider

A Catalog entity of the following will look for jobs for this entity at `https://jenkins-departmentFoo.example.com/job/teamA/job/artistLookupService`

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-lookup
  annotations:
    'acme.example.com/paas-project-name': artistLookupService
```

## Jenkins' terminology notes

The domain model for Jenkins is not particularly clear but for the purposes of this plugin the following model has been assumed:

Jenkins contains a tree of *job*s which have children of either; other *job*s (making it a _folder_) or *build*s (making it a _project_).
Concepts like _pipeline_ and *view*s are meaningless (pipelines are just jobs for our purposes, views are (as the name suggests) just views of subsets of jobs)

A _job full name_ is a slash separated list of the names of the job, and the folders which contain it. For example `teamA/artistLookupService/develop`, and the same way that a filesystem path has folders and file names.
