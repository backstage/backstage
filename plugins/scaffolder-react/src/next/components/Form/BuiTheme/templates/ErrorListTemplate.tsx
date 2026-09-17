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
  ErrorListProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TranslatableString,
} from '@rjsf/utils';
import { Box, Text } from '@backstage/ui';

export default function ErrorListTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ errors, registry }: ErrorListProps<T, S, F>) {
  const { translateString } = registry;

  if (errors.length === 0) {
    return null;
  }

  return (
    <Box
      p="4"
      mb="8"
      style={{
        backgroundColor: 'var(--bui-bg-danger)',
        border: '1px solid var(--bui-border-danger)',
        borderRadius: 'var(--bui-radius-2)',
      }}
    >
      <Text as="h4" variant="title-small" weight="bold" color="danger">
        {translateString(TranslatableString.ErrorsLabel)}
      </Text>
      <Box mt="2" pl="8">
        {errors.map((error, i) => (
          <Box
            key={i}
            style={{
              display: 'list-item',
              listStyleType: 'disc',
              marginLeft: '20px',
            }}
          >
            <Text variant="body-small" color="danger">
              {error.stack}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
