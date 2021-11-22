/*
 * Copyright 2020 The Backstage Authors
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

import { resolve } from 'path';
import { Command } from 'commander';
import { createLogger } from '../../lib/utility';
import { SingleHostDiscovery } from '@backstage/backend-common';
import { Publisher } from '@backstage/techdocs-common';
import { Entity } from '@backstage/catalog-model';
import { PublisherConfig } from '../../lib/PublisherConfig';

export default async function publish(cmd: Command): Promise<any> {
  const logger = createLogger({ verbose: cmd.verbose });

  const config = PublisherConfig.getValidConfig(cmd);
  const discovery = SingleHostDiscovery.fromConfig(config);
  const publisher = await Publisher.fromConfig(config, { logger, discovery });

  // Check that the publisher's underlying storage is ready and available.
  const { isAvailable } = await publisher.getReadiness();
  if (!isAvailable) {
    // Error messages printed in getReadiness() call. This ensures exit code 1.
    return Promise.reject(new Error(''));
  }

  const [namespace, kind, name] = cmd.entity.split('/');
  const entity = {
    kind,
    metadata: {
      namespace,
      name,
    },
  } as Entity;

  const directory = resolve(cmd.directory);
  await publisher.publish({ entity, directory });

  return true;
}
