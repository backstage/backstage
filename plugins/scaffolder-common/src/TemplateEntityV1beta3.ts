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
import schema from './Template.v1beta3.schema.json';

/**
 * Backstage catalog Template kind Entity. Templates are used by the Scaffolder
 * plugin to create new entities, such as Components.
 *
 * @public
 */
export interface TemplateEntityV1beta3 extends Entity {
  /**
   * The apiVersion string of the TaskSpec.
   */
  apiVersion: 'scaffolder.backstage.io/v1beta3';
  /**
   * The kind of the entity
   */
  kind: 'Template';
  /**
   * The specification of the Template Entity
   */
  spec: {
    /**
     * The type that the Template will create. For example service, website or library.
     */
    type: string;
    /**
     * This is a JSONSchema or an array of JSONSchema's which is used to render a form in the frontend
     * to collect user input and validate it against that schema. This can then be used in the `steps` part below to template
     * variables passed from the user into each action in the template.
     */
    parameters?: JsonObject | JsonObject[];
    /**
     * A list of steps to be executed in sequence which are defined by the template. These steps are a list of the underlying
     * javascript action and some optional input parameters that may or may not have been collected from the end user.
     */
    steps: Array<{
      id?: string;
      name?: string;
      action: string;
      input?: JsonObject;
      if?: string | boolean;
    }>;
    /**
     * The output is an object where template authors can pull out information from template actions and return them in a known standard way.
     */
    output?: { [name: string]: string };
    /**
     * The owner entityRef of the TemplateEntity
     */
    owner?: string;
  };
}

const validator = entityKindSchemaValidator(schema);

/**
 * Entity data validator for {@link TemplateEntityV1beta3}.
 *
 * @public
 */
export const templateEntityV1beta3Validator: KindValidator = {
  // TODO(freben): Emulate the old KindValidator until we fix that type
  async check(data: Entity) {
    return validator(data) === data;
  },
};
