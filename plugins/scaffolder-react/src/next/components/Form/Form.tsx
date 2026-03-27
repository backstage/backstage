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

import { withTheme } from '@rjsf/core';
import { useMemo, PropsWithChildren, ChangeEvent } from 'react';
import { FieldTemplate } from './FieldTemplate';
import { DescriptionFieldTemplate } from './DescriptionFieldTemplate';
import {
  FieldProps,
  WidgetProps,
  ObjectFieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  getTemplate,
  getUiOptions,
  canExpand,
} from '@rjsf/utils';
import { ScaffolderRJSFFormProps } from '@backstage/plugin-scaffolder-react';

/**
 * shadcn/ui-styled RJSF widget for text input fields.
 *
 * Replaces the bare HTML `<input>` rendered by `@rjsf/core` with a styled
 * input using Tailwind utility classes that match the shadcn/ui Input
 * component design (border, radius, focus ring, sizing).
 */
function ShadcnTextWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    value,
    required,
    disabled,
    readonly,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    label,
    schema,
  } = props;

  const inputType =
    schema.type === 'number' || schema.type === 'integer' ? 'number' : 'text';

  return (
    <input
      id={id}
      name={id}
      type={inputType}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted/50"
      value={value ?? ''}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      placeholder={placeholder}
      aria-label={label || undefined}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onChange(event.target.value === '' ? undefined : event.target.value)
      }
      onBlur={() => onBlur(id, value)}
      onFocus={() => onFocus(id, value)}
    />
  );
}

/**
 * shadcn/ui-styled RJSF widget for textarea fields.
 *
 * Renders a styled `<textarea>` with Tailwind classes matching the shadcn/ui
 * Textarea component for multi-line text input in scaffolder forms.
 */
function ShadcnTextareaWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    value,
    required,
    disabled,
    readonly,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    label,
  } = props;

  return (
    <textarea
      id={id}
      name={id}
      className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted/50"
      value={value ?? ''}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      placeholder={placeholder}
      aria-label={label || undefined}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
        onChange(event.target.value === '' ? undefined : event.target.value)
      }
      onBlur={() => onBlur(id, value)}
      onFocus={() => onFocus(id, value)}
    />
  );
}

/**
 * shadcn/ui-styled RJSF widget for select/dropdown fields.
 *
 * Renders a native `<select>` with Tailwind classes matching the shadcn/ui
 * Select trigger styling. Native select is used for maximum RJSF compatibility
 * while maintaining visual consistency with the shadcn design language.
 */
function ShadcnSelectWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    value,
    required,
    disabled,
    readonly,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    options,
    label,
    multiple,
  } = props;

  const { enumOptions, enumDisabled } = options;

  return (
    <select
      id={id}
      name={id}
      className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      value={value ?? ''}
      required={required}
      disabled={disabled}
      multiple={multiple}
      aria-label={label || undefined}
      aria-readonly={readonly || undefined}
      onChange={(event: ChangeEvent<HTMLSelectElement>) => {
        const newValue = event.target.value;
        onChange(newValue === '' ? undefined : newValue);
      }}
      onBlur={() => onBlur(id, value)}
      onFocus={() => onFocus(id, value)}
    >
      {!multiple && !value && (
        <option value="">{placeholder || 'Select...'}</option>
      )}
      {Array.isArray(enumOptions) &&
        enumOptions.map(({ value: optVal, label: optLabel }) => (
          <option
            key={String(optVal)}
            value={String(optVal)}
            disabled={
              Array.isArray(enumDisabled) && enumDisabled.includes(optVal)
            }
          >
            {optLabel}
          </option>
        ))}
    </select>
  );
}

/**
 * shadcn/ui-styled RJSF widget for checkbox fields.
 *
 * Renders a styled checkbox input with an accompanying label using Tailwind
 * utility classes that match the shadcn/ui Checkbox component appearance.
 */
function ShadcnCheckboxWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const { id, value, disabled, readonly, onChange, onBlur, onFocus, label } =
    props;

  return (
    <div className="flex items-center space-x-2">
      <input
        id={id}
        name={id}
        type="checkbox"
        className="h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        checked={typeof value === 'boolean' ? value : false}
        disabled={disabled}
        readOnly={readonly}
        aria-label={label || undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.checked)
        }
        onBlur={() => onBlur(id, value)}
        onFocus={() => onFocus(id, value)}
      />
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  );
}

/**
 * shadcn/ui-styled RJSF ObjectFieldTemplate.
 *
 * Renders object-type fields with proper structure, including an optional
 * title and description, child properties, and an "Add" button when the
 * schema supports additional properties.
 */
function ShadcnObjectFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ObjectFieldTemplateProps<T, S, F>) {
  const {
    title,
    description,
    properties,
    disabled,
    readonly,
    uiSchema,
    idSchema,
    schema,
    formData,
    onAddClick,
    registry,
  } = props;

  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>(
    'TitleFieldTemplate',
    registry,
    uiOptions,
  );
  const DescriptionTemplate = getTemplate<
    'DescriptionFieldTemplate',
    T,
    S,
    F
  >('DescriptionFieldTemplate', registry, uiOptions);
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  return (
    <fieldset id={idSchema.$id} className="space-y-4">
      {title && (
        <TitleFieldTemplate
          id={`${idSchema.$id}__title`}
          title={title}
          required={props.required}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      {description && (
        <DescriptionTemplate
          id={`${idSchema.$id}__description`}
          description={description}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      <div className="space-y-4">
        {properties.map(prop => (
          <div key={prop.name} className="w-full">
            {prop.content}
          </div>
        ))}
      </div>
      {canExpand<T, S, F>(schema, uiSchema, formData) && (
        <AddButton
          className="mt-2"
          onClick={onAddClick(schema)}
          disabled={disabled || readonly}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
    </fieldset>
  );
}

/**
 * Custom RJSF theme providing shadcn/ui-styled widgets and templates.
 *
 * This theme replaces the removed `@rjsf/material-ui` theme with lightweight
 * widget implementations using Tailwind CSS utility classes that match the
 * shadcn/ui design language. It provides styled text inputs, selects,
 * checkboxes, textareas, and a structured object field layout.
 */
const ShadcnRjsfTheme = {
  widgets: {
    TextWidget: ShadcnTextWidget,
    TextareaWidget: ShadcnTextareaWidget,
    SelectWidget: ShadcnSelectWidget,
    CheckboxWidget: ShadcnCheckboxWidget,
  },
  templates: {
    ObjectFieldTemplate: ShadcnObjectFieldTemplate,
  },
};

const WrappedForm = withTheme(ShadcnRjsfTheme);

/**
 * The Form component
 * @alpha
 */
export const Form = (props: PropsWithChildren<ScaffolderRJSFFormProps>) => {
  // This is where we unbreak the changes from RJSF, and make it work with our custom fields so we don't pass on this
  // breaking change to our users. We will look more into a better API for this in scaffolderv2.
  const wrappedFields = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(props.fields ?? {}).map(([key, Component]) => [
          key,
          (wrapperProps: FieldProps) => {
            return (
              <Component
                {...wrapperProps}
                uiSchema={wrapperProps.uiSchema ?? {}}
                formData={wrapperProps.formData}
                rawErrors={wrapperProps.rawErrors ?? []}
                disabled={wrapperProps.disabled ?? false}
                readonly={wrapperProps.readonly ?? false}
              />
            );
          },
        ]),
      ),
    [props.fields],
  );

  const templates = useMemo(
    () => ({
      FieldTemplate,
      DescriptionFieldTemplate,
      ...props.templates,
    }),
    [props.templates],
  );

  return (
    <WrappedForm {...props} templates={templates} fields={wrappedFields} />
  );
};
