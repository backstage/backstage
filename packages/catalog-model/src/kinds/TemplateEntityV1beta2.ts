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

import type { Entity, EntityMeta } from '../entity/Entity';
import schema from '../schema/kinds/Template.v1beta2.schema.json';
import entitySchema from '../schema/Entity.schema.json';
import entityMetaSchema from '../schema/EntityMeta.schema.json';
import commonSchema from '../schema/shared/common.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';
import { JsonObject } from '@backstage/config';

const API_VERSION = ['backstage.io/v1beta2'] as const;
const KIND = 'Template' as const;

export interface TemplateEntityV1beta2 extends Entity {
  apiVersion: typeof API_VERSION[number];
  kind: typeof KIND;
  metadata: EntityMeta & {
    title?: string;
  };
  spec: {
    type: string;
    parameters?: JsonObject | JsonObject[];
    steps: Array<{
      id?: string;
      name?: string;
      action: string;
      parameters?: JsonObject;
    }>;
    output?: { [name: string]: string };
  };
}

export const templateEntityV1beta2Validator = ajvCompiledJsonSchemaValidator(
  KIND,
  API_VERSION,
  schema,
  [commonSchema, entityMetaSchema, entitySchema],
);
