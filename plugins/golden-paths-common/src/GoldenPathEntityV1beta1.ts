/*
 * Copyright 2026 The Backstage Authors
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
import schema from './GoldenPath.v1beta1.schema.json';

/**
 * Backstage catalog GoldenPath kind Entity. Golden Paths are used by the application
 * to combine particular Scaffolder Templates into logically executable sequence of steps.
 *
 * @public
 */
export interface GoldenPathEntityV1beta1 extends Entity {
  /**
   * The apiVersion string of the TaskSpec.
   */
  apiVersion: 'backstage.io/v1beta1';
  /**
   * The kind of the entity
   */
  kind: 'GoldenPath';
  /**
   * The specification of the GoldenPath Entity
   */
  spec: {
    /**
     * The type that the GoldenPath describing the purpose.
     */
    type: string;

    /**
     * This is a JSONSchema or an array of JSONSchema's which is used to render a form in the frontend
     * to collect user input and validate it against that schema. This can then be used in the `steps` part below to golden path
     * variables passed from the user into each action in the template.
     */
    parameters?: GoldenPathParametersV1beta1 | GoldenPathParametersV1beta1[];
    /**
     * A list of templates to be executed in sequence which are defined by the golden path. These templates are a list of the underlying
     * steps and some optional input parameters that may or may not have been collected from the end user.
     */
    steps: Array<GoldenPathEntityStepV1beta1>;
    /**
     * The owner entityRef of the GoldenPath Entity
     */
    owner?: string;
  };
}

/**
 * Step that is part of a Golden Path Entity.
 *
 * @public
 */
export interface GoldenPathEntityStepV1beta1 extends JsonObject {
  id?: string;
  name?: string;
  template: string;
  input?: JsonObject;
  output?: string[]; // Define which values from the step execution should be stored as outputs
  if?: string | boolean;
  'backstage:permissions'?: GoldenPathPermissionsV1beta1;
}

/**
 * Parameter that is part of a GoldenPath Entity.
 *
 * @public
 */
export interface GoldenPathParametersV1beta1 extends JsonObject {
  'backstage:permissions'?: GoldenPathPermissionsV1beta1;
}

/**
 *  Access control properties for parts of a golden path.
 *
 * @public
 */
export interface GoldenPathPermissionsV1beta1 extends JsonObject {
  tags?: string[];
}

const validator = entityKindSchemaValidator(schema);

/**
 * Entity data validator for {@link GoldenPathEntityV1beta1}.
 *
 * @public
 */
export const goldenPathEntityV1beta1Validator: KindValidator = {
  async check(data: Entity) {
    return validator(data) === data;
  },
};

/**
 * Typeguard for filtering entities and ensuring v1beta1 entities
 * @public
 */
export const isGoldenPathEntityV1beta1 = (
  entity: Entity,
): entity is GoldenPathEntityV1beta1 =>
  entity.apiVersion === 'backstage.io/v1beta1' && entity.kind === 'GoldenPath';
