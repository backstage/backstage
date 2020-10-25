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

import { InputError } from '@backstage/backend-common';
import { Entity, Location, LocationSpec } from '@backstage/catalog-model';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { EntitiesCatalog, LocationsCatalog } from '../catalog';
import { EntityUpsertResponse } from '../catalog/types';
import { durationText } from '../util/timing';
import { AddLocationResult, ConfigGenerator, LocationReader } from './types';

/**
 * Placeholder for operations that span several catalogs and/or stretches out
 * in time.
 *
 * TODO(freben): Find a better home for these, possibly refactoring to use the
 * database more directly.
 */
export class ConfigGeneratorClient implements ConfigGenerator {
  logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }
  async generateConfig(repoPath: string): Promise<Entity[]> {
    const [ownerName, repoName] = [
      repoPath.split('/')[0],
      repoPath.split('/')[1],
    ];
    const config = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: repoName,
        description: '',
        annotations: { 'github.com/project-slug': repoPath },
      },
      spec: { type: 'service', owner: ownerName, lifecycle: 'experimental' },
    };

    return [config];
  }
}
