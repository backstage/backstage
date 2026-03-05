/*
 * Copyright 2023 The Backstage Authors
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

import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import type { FormProps as SchemaFormProps } from '@rjsf/core';
import { UiSchema } from '@rjsf/utils';
import { JsonObject } from '@backstage/types';

/** @public  */
export type TemplateGroupFilter = {
  title?: React.ReactNode;
  filter: (entity: TemplateEntityV1beta3) => boolean;
};

/**
 * Any `@rjsf/core` form properties that are publicly exposed to the `ScaffolderPage`
 *
 * @public
 */
export type FormProps = Pick<
  SchemaFormProps,
  | 'transformErrors'
  | 'noHtml5Validate'
  | 'uiSchema'
  | 'formContext'
  | 'omitExtraData'
  | 'liveOmit'
>;

/**
 * The props for the Last Step in scaffolder template form.
 * Which represents the summary of the input provided by the end user.
 *
 * @public
 */
export type ReviewStepProps = {
  disableButtons: boolean;
  formData: JsonObject;
  handleBack: () => void;
  handleReset: () => void;
  handleCreate: () => void;
  steps: {
    uiSchema: UiSchema;
    mergedSchema: JsonObject;
    schema: JsonObject;
  }[];
};
