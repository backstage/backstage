/*
 * Copyright 2021 Spotify AB
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
import { Repository } from './types';
import { CatalogProcessorResult } from '../types';
import { results } from '../index';
import { BitbucketClient } from './client';

export type BitbucketRepositoryParser = (options: {
  client: BitbucketClient;
  repository: Repository;
  path: string;
}) => AsyncIterable<CatalogProcessorResult>;

export const defaultRepositoryParser: BitbucketRepositoryParser = async function* defaultRepositoryParser({
  repository,
  path,
}) {
  yield results.location(
    {
      type: 'url',
      target: `${repository.links.self[0].href}${path}`,
    },
    // Not all locations may actually exist, since the user defined them as a wildcard pattern.
    // Thus, we emit them as optional and let the downstream processor find them while not outputting
    // an error if it couldn't.
    true,
  );
};
