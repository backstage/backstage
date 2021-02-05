/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
