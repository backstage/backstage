---
'@backstage/plugin-techdocs-backend': patch
---

Output logs from a TechDocs build to a logging transport in addition to existing
frontend event stream, for capturing these logs to other sources.

This allows users to capture debugging information around why tech docs fail to build
without needing to rely on end users capturing information from their web browser.

The most common use case is to log to the same place as the rest of the backend
application logs.

Sample usage:

```
import { DockerContainerRunner } from '@backstage/backend-common';
import {
  createRouter,
  Generators,
  Preparers,
  Publisher,
} from '@backstage/plugin-techdocs-backend';
import Docker from 'dockerode';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const preparers = await Preparers.fromConfig(env.config, {
    logger: env.logger,
    reader: env.reader,
  });

  const dockerClient = new Docker();
  const containerRunner = new DockerContainerRunner({ dockerClient });

  const generators = await Generators.fromConfig(env.config, {
    logger: env.logger,
    containerRunner,
  });

  const publisher = await Publisher.fromConfig(env.config, {
    logger: env.logger,
    discovery: env.discovery,
  });

  await publisher.getReadiness();

  return await createRouter({
    preparers,
    generators,
    publisher,
    logger: env.logger,
    // Passing a buildLogTransport as a parameter in createRouter will enable
    // capturing build logs to a backend log stream
    buildLogTransport: env.logger,
    config: env.config,
    discovery: env.discovery,
    cache: env.cache,
  });
}
```
