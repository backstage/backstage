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

import { PuppetDbEntityProviderConfig } from '../providers';
import { PuppetNode, ResourceTransformer } from './types';
import { ResourceEntity } from '@backstage/catalog-model';
import { defaultResourceTransformer } from './transformers';
import { ResponseError } from '@backstage/errors';
import { ENDPOINT_FACTSETS } from './constants';
import { LoggerService } from '@backstage/backend-plugin-api';

/**
 * Reads nodes and their facts from PuppetDB.
 *
 * @param config - The provider configuration.
 * @param opts - Additional options.
 */
export async function readPuppetNodes(
  config: PuppetDbEntityProviderConfig,
  opts?: {
    transformer?: ResourceTransformer;
    logger?: LoggerService;
  },
): Promise<ResourceEntity[]> {
  const transformFn = opts?.transformer ?? defaultResourceTransformer;
  const url = new URL(ENDPOINT_FACTSETS, config.baseUrl);

  if (config.query) {
    url.searchParams.set('query', config.query);
  }

  if (opts?.logger) {
    opts.logger.debug('Reading nodes from PuppetDB', { url: url.toString() });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }

  const nodes = (await response.json()) as PuppetNode[];
  const entities: ResourceEntity[] = [];

  for (const node of nodes) {
    const entity = await transformFn(node, config);
    if (entity) {
      entities.push(entity);
    }
  }

  return entities;
}
