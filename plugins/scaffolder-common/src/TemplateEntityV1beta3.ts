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
  createEntitySchema,
  createFromZod,
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
     * Form hooks to be run
     */
    EXPERIMENTAL_formDecorators?: { id: string; input?: JsonObject }[];

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

export const templateEntityV1beta3Schema = createFromZod(z => {
  const parameterSchema = z
    .object({
      'backstage:permissions': z
        .object({
          tags: z.array(z.string()),
        })
        .passthrough()
        .describe('Object used for authorizing the parameter'),
    })
    .passthrough();

  return createEntitySchema({
    kind: z.literal('Template'),
    apiVersion: z.enum(['scaffolder.backstage.io/v1beta3']),
    spec: z
      .object({
        type: z
          .string()
          .min(1)
          .describe(
            'The type of component created by the template. The software catalog accepts any type value, but an organization should take great care to establish a proper taxonomy for these. Tools including Backstage itself may read this field and behave differently depending on its value. For example, a website type component may present tooling in the Backstage interface that is specific to just websites.',
          ),
        steps: z.array(
          z
            .object({
              action: z.string().describe('The name of the action to execute.'),
              id: z
                .string()
                .optional()
                .describe(
                  'The ID of the step, which can be used to refer to its outputs.',
                ),
              name: z
                .string()
                .optional()
                .describe(
                  'The name of the step, which will be displayed in the UI during the scaffolding process.',
                ),
              input: z
                .object({})
                .passthrough()
                .optional()
                .describe(
                  'A templated object describing the inputs to the action.',
                ),
              if: z
                .string()
                .or(z.boolean())
                .optional()
                .describe(
                  'A templated condition that skips the step when evaluated to false. If the condition is true or not defined, the step is executed. The condition is true, if the input is not `false`, `undefined`, `null`, `""`, `0`, or `[]`.',
                ),
              'backstage:permissions': z
                .object({
                  tags: z.array(z.string()).optional(),
                })
                .passthrough()
                .optional()
                .describe('Object used for authorizing the step'),
            })
            .passthrough()
            .describe('A list of steps to execute.'),
        ),
        output: z
          .object({
            links: z
              .array(
                z.object({
                  url: z.string().describe('The URL of the link.'),
                  entityRef: z
                    .string()
                    .optional()
                    .describe(
                      'An entity reference to an entity in the catalog.',
                    ),
                  title: z
                    .string()
                    .min(1)
                    .optional()
                    .describe('The title of the link.'),
                  icon: z
                    .string()
                    .min(1)
                    .optional()
                    .describe('The icon of the link.'),
                }),
              )
              .optional()
              .describe(
                'A list of external hyperlinks, typically pointing to resources created or updated by the template',
              ),
            text: z
              .array(
                z.object({
                  title: z
                    .string()
                    .min(1)
                    .optional()
                    .describe('The title of the text.'),
                  icon: z
                    .string()
                    .min(1)
                    .optional()
                    .describe('The icon of the text.'),
                  content: z
                    .string()
                    .optional()
                    .describe('The content of the text.'),
                }),
              )
              .optional()
              .describe(
                'A list of Markdown text blobs, like output data from the template.',
              ),
          })
          .and(z.record(z.string(), z.string()))
          .optional()
          .describe(
            'A templated object describing the outputs of the scaffolding task.',
          ),
        owner: z
          .string()
          .min(1)
          .optional()
          .describe('The user (or group) owner of the template'),
        parameters: parameterSchema
          .optional()
          .describe('The JSONSchema describing the inputs for the template.')
          .or(
            z
              .array(parameterSchema)
              .describe('A list of separate forms to collect parameters.'),
          ),
        presentation: z
          .object({
            buttonLabels: z
              .object({
                backButtonText: z
                  .string()
                  .describe('A button which return the user to one step back.'),
                createButtonText: z
                  .string()
                  .describe(
                    'A button which start the execution of the template.',
                  ),
                reviewButtonText: z
                  .string()
                  .describe(
                    'A button which open the review step to verify the input prior to start the execution.',
                  ),
              })
              .passthrough()
              .optional()
              .describe('A way to redefine the labels for actionable buttons.'),
          })
          .passthrough()
          .optional()
          .describe('A way to redefine the presentation of the scaffolder.'),
        EXPERIMENTAL_recovery: z
          .object({
            EXPERIMENTAL_strategy: z
              .enum(['none', 'startOver'])
              .describe('The recovery strategy for the template.'),
          })
          .passthrough()
          .optional()
          .describe('EXPERIMENTAL: Recovery strategy for the template'),
        EXPERIMENTAL_formDecorators: z
          .array(
            z.object({
              id: z.string().optional().describe('The form hook ID'),
              input: z
                .object({})
                .passthrough()
                .optional()
                .describe('A object describing the inputs to the form hook.'),
            }),
          )
          .optional()
          .describe('EXPERIMENTAL: Form hooks to be run'),
      })
      .passthrough(),
  });
});
