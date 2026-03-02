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
import { MarkdownContent } from '@backstage/core-components';
import {
  DescriptionFieldProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';

/** The `DescriptionField` is the template to use to render the description of a field
 * @alpha
 * @param props - The `DescriptionFieldProps` for this component
 */
export const DescriptionFieldTemplate = <
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(
  props: DescriptionFieldProps<T, S, F>,
) => {
  const { id, description } = props;

  if (description) {
    if (typeof description === 'string') {
      return (
        <MarkdownContent
          content={description}
          linkTarget="_blank"
          className="text-xs text-muted-foreground m-0 [&_:first-child]:m-0 [&_:first-child]:mt-[3px]"
        />
      );
    }

    return (
      <p id={id} className="text-sm font-medium mt-[5px]">
        {description}
      </p>
    );
  }

  return null;
};
