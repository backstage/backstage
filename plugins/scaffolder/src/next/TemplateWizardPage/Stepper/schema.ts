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
import { UiSchema } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';

import { TemplateParameterSchema } from '../../../types';

export const extractSchemaFromManifest = (
  manifest: TemplateParameterSchema,
): { uiSchema: UiSchema; schema: JSONSchema7 } => {
  const schema = manifest.steps[0].schema;
  const uiSchema = JSON.parse(JSON.stringify(schema), (key, value) => {
    if (typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).filter(
          ([k, v]) => k.startsWith('ui:') || typeof v === 'object',
        ),
      );
    }

    return value;
  });

  console.log(uiSchema);
  return { uiSchema, schema: {} };
};
