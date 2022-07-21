/*
 * Copyright 2022 The Backstage Authors
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
  LocationSpec,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-backend';
import { Entity } from '@backstage/catalog-model';
import { Logger } from 'winston';
import { BitbucketServerClient } from '../lib';

/**
 * A custom callback that reacts to finding a location by yielding entities.
 * Can be used for custom location/repository parsing logic.
 *
 * @public
 */
export type BitbucketServerLocationParser = (options: {
  client: BitbucketServerClient;
  location: LocationSpec;
  logger: Logger;
}) => AsyncIterable<Entity>;

export const defaultBitbucketServerLocationParser =
  async function* defaultBitbucketServerLocationParser(options: {
    location: LocationSpec;
  }) {
    yield locationSpecToLocationEntity({ location: options.location });
  };
