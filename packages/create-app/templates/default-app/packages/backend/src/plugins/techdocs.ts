import {
  createRouter,
  DirectoryPreparer,
  Preparers,
  Generators,
  TechdocsGenerator,
  CommonGitPreparer,
  Publisher,
} from '@backstage/plugin-techdocs-backend';
import { PluginEnvironment } from '../types';
import Docker from 'dockerode';

export default async function createPlugin({
  logger,
  config,
  discovery,
}: PluginEnvironment) {
  const generators = new Generators();
  const techdocsGenerator = new TechdocsGenerator(logger, config);

  generators.register('techdocs', techdocsGenerator);

  const preparers = new Preparers();
  const directoryPreparer = new DirectoryPreparer(logger);
  const commonGitPreparer = new CommonGitPreparer(logger);

  preparers.register('dir', directoryPreparer);
  preparers.register('github', commonGitPreparer);
  preparers.register('gitlab', commonGitPreparer);

  const publisher = Publisher.fromConfig(config, logger, discovery);

  const dockerClient = new Docker();

  return await createRouter({
    preparers,
    generators,
    publisher,
    dockerClient,
    logger,
    config,
    discovery,
  });
}
