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

import {
  Entity,
  entityKindSchemaValidator,
  KindValidator,
} from '@backstage/catalog-model';
import { JsonObject } from '@backstage/types';
import schema from './Template.v1beta2.schema.json';

/**
 * Backstage catalog Template kind Entity. Templates are used by the Scaffolder
 * plugin to create new entities, such as Components.
 *
 * @public
 * @deprecated Please convert your templates to TemplateEntityV1beta3 on
 *             apiVersion scaffolder.backstage.io/v1beta3
 */
export interface TemplateEntityV1beta2 extends Entity {
  apiVersion: 'backstage.io/v1beta2';
  kind: 'Template';
  spec: {
    type: string;
    parameters?: JsonObject | JsonObject[];
    steps: Array<{
      id?: string;
      name?: string;
      action: string;
      input?: JsonObject;
      if?: string | boolean;
    }>;
    output?: { [name: string]: string };
    owner?: string;
  };
}

const validator = entityKindSchemaValidator(schema);

/**
 * Entity data validator for {@link TemplateEntityV1beta2}.
 *
 * @public
 * @deprecated Please convert your templates to TemplateEntityV1beta3 on
 *             apiVersion scaffolder.backstage.io/v1beta3
 */
export const templateEntityV1beta2Validator: KindValidator = {
  // TODO(freben): Emulate the old KindValidator until we fix that type
  async check(data: Entity) {
    return validator(data) === data;
  },
};
