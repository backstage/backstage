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
  DirectoryPreparer,
  Preparers,
  Generators,
  LocalPublish,
  TechdocsGenerator,
  CommonGitPreparer,
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
  const commonGitPreparer = new CommonGitPreparer(logger);

  const directoryPreparer = new DirectoryPreparer(logger);
  preparers.register('dir', directoryPreparer);
  preparers.register('github', commonGitPreparer);
  preparers.register('gitlab', commonGitPreparer);
  preparers.register('azure/api', commonGitPreparer);

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
