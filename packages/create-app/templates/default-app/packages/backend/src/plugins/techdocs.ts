import {
  createRouter,
  DirectoryPreparer,
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
}: PluginEnvironment) {
  const generators = new Generators();
  const techdocsGenerator = new TechdocsGenerator();
  generators.register('techdocs', techdocsGenerator);

  const directoryPreparer = new DirectoryPreparer();
  const preparers = new Preparers();

  preparers.register('dir', directoryPreparer);

  const publisher = new LocalPublish();

  const dockerClient = new Docker();

  return await createRouter({
    preparers,
    generators,
    publisher,
    dockerClient,
    logger,
    config,
  });
}
