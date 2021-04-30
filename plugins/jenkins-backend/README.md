# Jenkins Plugin (Alpha)

Welcome to the jenkins backend plugin! Website: [https://jenkins.io/](https://jenkins.io/)

This is the backend half of the 2 jenkins plugins and is responsible for:

- finding an appropriate instance of jenkins for an entity
- finding the appropriate job(s) on that instance for an entity
- connecting to jenkins and gathering data to present to the frontend

## Integrating into a backstage instance

This plugin needs to be added to an existing backstage instance.

Typically, this means creating a `src/plugins/jenkins.ts` file and adding a reference to it to `src/index.ts`

### jenkins.ts

```typescript
import {
  createRouter,
  SingleJenkinsInfoProvider,
} from '@backstage/plugin-jenkins-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    logger,
    jenkinsInfoProvider: new SingleJenkinsInfoProvider(),
  });
}
```

This plugin must be provided with a JenkinsInfoProvider, this is a strategy object for finding the jenkins instance and job for an entity.

There is a selection of standard ones provided, but the Integrator is free to build their own.

### SingleJenkinsInfoProvider

Allows configuration of a single global jenkins instance and annotating entities with the job name on that instance.

The following will look for jobs for this entity at `https://jenkins.example.com/job/teamA/job/artistLookup-build`

#### Config

```yaml
jenkins:
  baseUrl: https://jenkins.example.com
  username: backstage-bot
  apikey: 123456789abcdef0123456789abcedf012
```

#### Catalog

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-lookup
  annotations:
    'jenkins.io/github-folder': teamA/artistLookup-build
```

### PrefixedJenkinsInfoProvider

Allows configuration of multiple global jenkins instance and annotating entities with the name of the instance and job name on that instance.

The following will look for jobs for this entity at `https://jenkins-foo.example.com/job/teamA/job/artistLookup-build`

#### Config

```yaml
jenkins:
  instances:
    - name: default
      baseUrl: https://jenkins.example.com
      username: backstage-bot
      apikey: 123456789abcdef0123456789abcedf012
    - name: departmentFoo
      baseUrl: https://jenkins-foo.example.com
      username: backstage-bot
      apikey: 123456789abcdef0123456789abcedf012
```

#### Catalog

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-lookup
  annotations:
    'jenkins.io/github-folder': departmentFoo#teamA/artistLookup-build
```

If the `departmentFoo#` part is omitted, the default instance will be assumed.

### DefaultJenkinsInfoProvider

The default jenkins info provider makes it clear it is replaceable in the config but is otherwise the same as PrefixedJenkinsInfoProvider

The following will look for jobs for this entity at `https://jenkins-foo.example.com/job/teamA/job/artistLookup-build`

#### Config

```yaml
jenkins:
  DefaultJenkinsInfoProvider:
    instances:
      - name: default
        baseUrl: https://jenkins.example.com
        username: backstage-bot
        apikey: 123456789abcdef0123456789abcedf012
      - name: departmentFoo
        baseUrl: https://jenkins-foo.example.com
        username: backstage-bot
        apikey: 123456789abcdef0123456789abcedf012
```

#### Catalog

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-lookup
  annotations:
    'jenkins.io/github-folder': departmentFoo#teamA/artistLookup-build
```

### AcmeJenkinsInfoProvider

An example of a bespoke JenkinsInfoProvider which uses an organisation specific annotation to look up the jenkins info (including jobName)

#### Config

None needed

#### Catalog

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-lookup
  annotations:
    'acme.example.com/paas-project-name': artistLookupService
```

The following will look for jobs for this entity at `https://jenkins-departmentFoo.example.com/job/teamA/job/artistLookupService`

## Jenkins' terminology notes

The domain model for Jenkins is not particularly clear but for the purposes of this plugin the following model has been assumed:

Jenkins contains a tree of *job*s which have children of either; other *job*s (making it a _folder_) or *build*s (making it a _project_).
Concepts like _pipeline_ and *view*s are meaningless (pipelines are just jobs for our purposes, views are (as the name suggests) just views of subsets of jobs)
