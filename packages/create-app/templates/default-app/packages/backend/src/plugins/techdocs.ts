import {
  createRouter,
  DirectoryPreparer,
  GithubPreparer,
  Preparers,
  Generators,
  LocalPublish,
  TechdocsGenerator,
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
  const githubPreparer = new GithubPreparer(logger);

  preparers.register('dir', directoryPreparer);
  preparers.register('github', githubPreparer);

  const publisher = new LocalPublish(logger);

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
