---
'@backstage/plugin-jenkins': minor
---

## Extract an entity-oriented Jenkins Backend

Change the Jenkins plugin from talking directly with a single Jenkins instance (via the proxy) to having a specific
backend plugin which talks to the Jenkins instances.

Existing users of the Jenkins plugin will need to configure a Jenkins backend instead of a proxy.
Typically, this means creating a `src/plugins/jenkins.ts` file, adding a reference to it to `src/index.ts` and changing app-config.yaml

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
  const catalogClient = new CatalogClient({ discoveryApi: discovery });

  return await createRouter({
    logger,
    jenkinsInfoProvider: new DefaultJenkinsInfoProvider(catalogClient, config),
  });
}
```

### app-config.yaml

For example

```yaml
proxy:
  '/jenkins/api':
    target: 'https://jenkins.example.com:8080' # your Jenkins URL
    changeOrigin: true
    headers:
      Authorization: Basic ${JENKINS_BASIC_AUTH_HEADER}
```

Would become:

```yaml
jenkins:
  baseUrl: https://jenkins.example.com:8080
  username: backstage-bot
  apiKey: ${JENKINS_PASSWORD}
```

## Change JavaScript API

As part of the above change, the JavaScript API exposed by the plugin as a possible place for customisation has changed.
The ApiRef now has an id of `plugin.jenkins.service2` and has entity-based functions to match the endpoints exposed by
the new backend plugin

## Change BuildWithStepsPage route

The plugin originally provided a route to view a particular build of a particular branch so that if you wanted to view
the master branch of an entity annotated with `'jenkins.io/github-folder': teamA/artistLookup-build` you could typically
access `/catalog/default/component/artist-lookup/ci-cd/run/master/7` but would now have to access
`/catalog/default/component/artist-lookup/ci-cd/build/teamA%2FartistLookup-build%2Fmaster/7`
