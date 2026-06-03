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
import type { PropsWithChildren, CSSProperties, ReactElement } from 'react';
import {
  FieldTemplateProps,
  FormContextType,
  getTemplate,
  getUiOptions,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';
import { Box, Text } from '@backstage/ui';

const descriptionStyle: CSSProperties = {
  fontSize: 'var(--bui-font-size-2)',
  color: 'var(--bui-fg-secondary)',
  margin: 0,
};

function BuiFieldWrapper(
  props: PropsWithChildren<{
    displayLabel?: boolean;
    rawDescription?: string;
    errors?: ReactElement;
    help?: ReactElement;
  }>,
) {
  const { children, displayLabel = true, rawDescription, errors, help } = props;
  return (
    <Box mb="3">
      {children}
      {displayLabel && rawDescription ? (
        <Text style={descriptionStyle}>{rawDescription}</Text>
      ) : null}
      {errors}
      {help}
    </Box>
  );
}

export default function FieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: FieldTemplateProps<T, S, F>) {
  const {
    id,
    children,
    classNames,
    style,
    disabled,
    displayLabel,
    hidden,
    label,
    onDropPropertyClick,
    onKeyChange,
    readonly,
    registry,
    required,
    rawErrors = [],
    errors,
    help,
    rawDescription,
    schema,
    uiSchema,
  } = props;

  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const WrapIfAdditionalTemplate = getTemplate<
    'WrapIfAdditionalTemplate',
    T,
    S,
    F
  >('WrapIfAdditionalTemplate', registry, uiOptions);

  if (hidden) {
    return <Box display="none">{children}</Box>;
  }

  return (
    <WrapIfAdditionalTemplate
      classNames={classNames}
      style={style}
      disabled={disabled}
      id={id}
      label={label}
      onDropPropertyClick={onDropPropertyClick}
      onKeyChange={onKeyChange}
      readonly={readonly}
      required={required}
      schema={schema}
      uiSchema={uiSchema}
      registry={registry}
    >
      <BuiFieldWrapper
        displayLabel={displayLabel}
        rawErrors={rawErrors}
        help={help}
        rawDescription={rawDescription}
        errors={errors}
      >
        {children}
      </BuiFieldWrapper>
    </WrapIfAdditionalTemplate>
  );
}
