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
  UnsupportedFieldProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';
import { Box, Text } from '@backstage/ui';

export default function UnsupportedFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: UnsupportedFieldProps<T, S, F>) {
  const { schema, reason } = props;
  return (
    <Box p="3" style={{ backgroundColor: 'var(--bui-bg-neutral-3)' }}>
      <Text variant="body-small" color="danger">
        Unsupported field schema
        {schema && schema.type && ` for type: ${JSON.stringify(schema.type)}`}
        {reason && `: ${reason}`}
      </Text>
    </Box>
  );
}
