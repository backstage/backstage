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
  ArrayFieldTemplateProps,
  ArrayFieldTemplateItemType,
  FormContextType,
  getTemplate,
  getUiOptions,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';
import { Box, Text } from '@backstage/ui';

export default function ArrayFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  canAdd,
  disabled,
  idSchema,
  uiSchema,
  items,
  onAddClick,
  readonly,
  registry,
  required,
  schema,
  title,
}: ArrayFieldTemplateProps<T, S, F>) {
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const ArrayFieldDescriptionTemplate = getTemplate<
    'ArrayFieldDescriptionTemplate',
    T,
    S,
    F
  >('ArrayFieldDescriptionTemplate', registry, uiOptions);
  const ArrayFieldItemTemplate = getTemplate<
    'ArrayFieldItemTemplate',
    T,
    S,
    F
  >('ArrayFieldItemTemplate', registry, uiOptions);
  const ArrayFieldTitleTemplate = getTemplate<
    'ArrayFieldTitleTemplate',
    T,
    S,
    F
  >('ArrayFieldTitleTemplate', registry, uiOptions);
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  const hasTitle = uiOptions.title || title;
  const hasDescription = uiOptions.description || schema.description;

  return (
    <Box mb="4">
      {hasTitle && (
        <Box mb="2">
          <ArrayFieldTitleTemplate
            idSchema={idSchema}
            title={uiOptions.title || title}
            required={required}
            schema={schema}
            uiSchema={uiSchema}
            registry={registry}
          />
        </Box>
      )}
      {hasDescription && (
        <Box mb="2">
          <ArrayFieldDescriptionTemplate
            idSchema={idSchema}
            description={uiOptions.description || schema.description}
            schema={schema}
            uiSchema={uiSchema}
            registry={registry}
          />
        </Box>
      )}
      {items && items.length > 0 ? (
        items.map(
          ({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => (
            <ArrayFieldItemTemplate key={key} {...itemProps} />
          ),
        )
      ) : (
        <Box
          p="3"
          mb="4"
          style={{
            backgroundColor: 'var(--bui-bg-neutral-2)',
            borderRadius: 'var(--bui-radius-2)',
          }}
        >
          <Text
            variant="body-medium"
            color="secondary"
            style={{ textAlign: 'center' }}
          >
            No items added yet
          </Text>
        </Box>
      )}
      {canAdd && (
        <Box>
          <AddButton
            onClick={onAddClick}
            disabled={disabled || readonly}
            uiSchema={uiSchema}
            registry={registry}
          />
        </Box>
      )}
    </Box>
  );
}
