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
     * Template specific configuration of the presentation layer.
     */
    presentation?: TemplatePresentationV1beta3;

    /**
     * Recovery strategy for the template
     */
    EXPERIMENTAL_recovery?: TemplateRecoveryV1beta3;

    /**
     * This is a JSONSchema or an array of JSONSchema's which is used to render a form in the frontend
     * to collect user input and validate it against that schema. This can then be used in the `steps` part below to template
     * variables passed from the user into each action in the template.
     */
    parameters?: TemplateParametersV1beta3 | TemplateParametersV1beta3[];
    /**
     * A list of steps to be executed in sequence which are defined by the template. These steps are a list of the underlying
     * javascript action and some optional input parameters that may or may not have been collected from the end user.
     */
    steps: Array<TemplateEntityStepV1beta3>;
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

/**
 * Depends on how you designed your task you might tailor the behaviour for each of them.
 *
 * @public
 */
export interface TemplateRecoveryV1beta3 extends JsonObject {
  /**
   *
   * none - not recover, let the task be marked as failed
   * startOver - do recover, start the execution of the task from the first step.
   *
   * @public
   */
  EXPERIMENTAL_strategy?: 'none' | 'startOver';
}

/**
 * The presentation of the template.
 *
 * @public
 */
export interface TemplatePresentationV1beta3 extends JsonObject {
  /**
   * Overrides default buttons' text
   */
  buttonLabels?: {
    /**
     * The text for the button which leads to the previous template page
     */
    backButtonText?: string;
    /**
     * The text for the button which starts the execution of the template
     */
    createButtonText?: string;
    /**
     * The text for the button which opens template's review/summary
     */
    reviewButtonText?: string;
  };
}

/**
 * Step that is part of a Template Entity.
 *
 * @public
 */
export interface TemplateEntityStepV1beta3 extends JsonObject {
  id?: string;
  name?: string;
  action: string;
  input?: JsonObject;
  if?: string | boolean;
  'backstage:permissions'?: TemplatePermissionsV1beta3;
}

/**
 * Parameter that is part of a Template Entity.
 *
 * @public
 */
export interface TemplateParametersV1beta3 extends JsonObject {
  'backstage:permissions'?: TemplatePermissionsV1beta3;
}

/**
 *  Access control properties for parts of a template.
 *
 * @public
 */
export interface TemplatePermissionsV1beta3 extends JsonObject {
  tags?: string[];
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

/**
 * Typeguard for filtering entities and ensuring v1beta3 entities
 * @public
 */
export const isTemplateEntityV1beta3 = (
  entity: Entity,
): entity is TemplateEntityV1beta3 =>
  entity.apiVersion === 'scaffolder.backstage.io/v1beta3' &&
  entity.kind === 'Template';
