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
  ArrayFieldTitleProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  titleId,
} from '@rjsf/utils';
import { Text } from '@backstage/ui';

export default function ArrayFieldTitleTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ idSchema, title, required }: ArrayFieldTitleProps<T, S, F>) {
  if (!title) {
    return null;
  }

  const id = titleId<T>(idSchema);

  return (
    <Text id={id} as="h3" variant="title-medium" weight="bold">
      {title}
      {required && (
        <Text as="span" color="danger">
          {' '}
          *
        </Text>
      )}
    </Text>
  );
}
