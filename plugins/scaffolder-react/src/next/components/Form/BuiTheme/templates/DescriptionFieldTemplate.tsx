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
import { isValidElement } from 'react';
import {
  DescriptionFieldProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';
import { MarkdownContent } from '@backstage/core-components';

export default function DescriptionFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ id, description }: DescriptionFieldProps<T, S, F>) {
  if (!description) {
    return null;
  }

  return (
    <div id={id}>
      {isValidElement(description) ? (
        description
      ) : (
        <MarkdownContent
          content={description as string}
          linkTarget="_blank"
        />
      )}
    </div>
  );
}
