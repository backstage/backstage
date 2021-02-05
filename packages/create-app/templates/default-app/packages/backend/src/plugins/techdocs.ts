import {
  createRouter,
  Preparers,
  Generators,
  Publisher,
} from '@backstage/plugin-techdocs-backend';
import { PluginEnvironment } from '../types';
import Docker from 'dockerode';

export default async function createPlugin({
  logger,
  config,
  discovery,
  reader,
}: PluginEnvironment) {
  // Preparers are responsible for fetching source files for documentation.
  const preparers = await Preparers.fromConfig(config, {
    logger,
    reader,
  });

  // Generators are used for generating documentation sites.
  const generators = await Generators.fromConfig(config, {
    logger,
  });

  // Publisher is used for
  // 1. Publishing generated files to storage
  // 2. Fetching files from storage and passing them to TechDocs frontend.
  const publisher = await Publisher.fromConfig(config, {
    logger,
    discovery,
  });

  // Docker client (conditionally) used by the generators, based on techdocs.generators config.
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
