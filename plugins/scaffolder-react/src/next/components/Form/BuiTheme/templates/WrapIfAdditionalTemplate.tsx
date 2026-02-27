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
  ADDITIONAL_PROPERTY_FLAG,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WrapIfAdditionalTemplateProps,
} from '@rjsf/utils';
import { Button, Flex, Box, TextField } from '@backstage/ui';
import { RiDeleteBinLine } from '@remixicon/react';

export default function WrapIfAdditionalTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  children,
  classNames,
  style,
  disabled,
  id,
  label,
  onDropPropertyClick,
  onKeyChange,
  readonly,
  required,
  schema,
}: WrapIfAdditionalTemplateProps<T, S, F>) {
  const keyLabel = `${label} Key`;
  const additional = ADDITIONAL_PROPERTY_FLAG in schema;

  if (!additional) {
    return (
      <Box className={classNames} style={style}>
        {children}
      </Box>
    );
  }

  const handleChange = (value: string) => {
    onKeyChange(value);
  };

  return (
    <Box className={classNames} style={style}>
      <Flex align="start" gap="4">
        <Box style={{ flex: 1 }}>
          <Box mb="4">
            <TextField
              id={`${id}-key`}
              label={keyLabel}
              secondaryLabel={required ? 'Required' : undefined}
              defaultValue={label}
              isDisabled={disabled || readonly}
              onChange={handleChange}
            />
          </Box>
          {children}
        </Box>
        <Button
          variant="tertiary"
          size="small"
          isDisabled={disabled || readonly}
          onClick={onDropPropertyClick(label)}
          iconStart={<RiDeleteBinLine />}
          aria-label="Remove"
        />
      </Flex>
    </Box>
  );
}
