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
import fetch from 'node-fetch';
import { ResponseError } from '@backstage/errors';
import { ENDPOINT_NODES, ENDPOINT_FACTSETS } from './constants';
import { LoggerService } from '@backstage/backend-plugin-api';

/**
 * Makes a GET request against the provided url and returns JSON object.
 *
 * @param url - The URL to make a request against.
 * @param logger - Logging object.
 * @returns JSON response from url.
 */
async function fetchJson(url: string, logger?: LoggerService): Promise<any> {
  if (logger) {
    logger.debug('Fetching URL', { url });
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }

  return response.json();
}

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
  const nodesUrl = new URL(ENDPOINT_NODES, config.baseUrl);

  // Step 1: Fetch nodes from ENDPOINT_NODES
  if (config.query) {
    nodesUrl.searchParams.set('query', config.query);
  }

  const nodes = (await fetchJson(
    nodesUrl.toString(),
    opts?.logger,
  )) as PuppetNode[];
  const entities: ResourceEntity[] = [];

  // Step 2: For each node, fetch its facts from ENDPOINT_NODES
  for (const node of nodes) {
    const nodeFactsUrl = new URL(
      `${ENDPOINT_FACTSETS}/${node.certname}/facts`,
      config.baseUrl,
    );
    const nodeFacts = await fetchJson(nodeFactsUrl.toString(), opts?.logger);
    // Step 3: Extract the facts object from the nodeFacts response
    const facts = nodeFacts[0]?.facts;
    // Step 4: Merge facts into node under the 'facts' key
    const enrichedNode = { ...node, facts };
    // Step 5: Transform the enriched node into a ResourceEntity
    const entity = await transformFn(enrichedNode, config);

    if (entity) {
      entities.push(entity);
    }
  }

  return entities;
}
