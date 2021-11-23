/*
 * Copyright 2021 The Backstage Authors
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

import { SingleHostDiscovery } from '@backstage/backend-common';
import { Publisher } from '@backstage/techdocs-common';
import { Command } from 'commander';
import { createLogger } from '../../lib/utility';
import { PublisherConfig } from '../../lib/PublisherConfig';

export default async function migrate(cmd: Command) {
  const logger = createLogger({ verbose: cmd.verbose });

  const config = PublisherConfig.getValidConfig(cmd);
  const discovery = SingleHostDiscovery.fromConfig(config);
  const publisher = await Publisher.fromConfig(config, { logger, discovery });

  if (!publisher.migrateDocsCase) {
    throw new Error(`Migration not implemented for ${cmd.publisherType}`);
  }

  // Check that the publisher's underlying storage is ready and available.
  const { isAvailable } = await publisher.getReadiness();
  if (!isAvailable) {
    // Error messages printed in getReadiness() call. This ensures exit code 1.
    throw new Error('');
  }

  // Validate and parse migration arguments.
  const removeOriginal = cmd.removeOriginal;
  const numericConcurrency = parseInt(cmd.concurrency, 10);

  if (!Number.isInteger(numericConcurrency) || numericConcurrency <= 0) {
    throw new Error(
      `Concurrency must be a number greater than 1. ${cmd.concurrency} provided.`,
    );
  }

  await publisher.migrateDocsCase({
    concurrency: numericConcurrency,
    removeOriginal,
  });
}
