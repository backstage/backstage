/*
 * Copyright 2024 The Backstage Authors
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
  FormContextType,
  RJSFSchema,
  RJSFValidationError,
  StrictRJSFSchema,
  UiSchema,
} from '@rjsf/utils';

import lodash from 'lodash';

const disable = /($^)/;

function xlate(
  err: RJSFValidationError,
  uiSchema: UiSchema,
): string | undefined {
  if (!(err.property && err.name)) {
    return undefined;
  }
  const path = lodash
    .filter(err.property.split('.'))
    .map(e => e.replace(/^\d+$/, 'items'));

  for (let i = path.length; i >= 0; i--) {
    const templatePath = [
      ...path.slice(0, i),
      'ui:message',
      ...path.slice(i),
      err.name,
    ];
    const template = lodash.get(uiSchema, templatePath);
    if (template) {
      return lodash.template(template, {
        interpolate: /@{{([^}]+)}}/,
        escape: disable,
        evaluate: disable,
      })({ err });
    }
  }
  return undefined;
}

export default function transformErrors<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(
  errors: RJSFValidationError[],
  uiSchema?: UiSchema<T, S, F>,
): RJSFValidationError[] {
  if (errors.length && uiSchema) {
    errors.forEach(err => {
      const msg = xlate(err, uiSchema as any);
      if (msg) {
        if (err.stack) {
          err.stack = err.stack.includes(err.message!)
            ? err.stack.replace(err.message!, msg)
            : msg;
        }
        err.message = msg;
      }
    });
  }
  return errors;
}
