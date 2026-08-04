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
import type {
  ArrayFieldTemplateProps,
  FieldErrorProps,
  FieldTemplateProps,
  ObjectFieldTemplateProps,
  RegistryWidgetsType,
  TemplatesType,
  WidgetProps,
} from '@rjsf/utils';
import React from 'react';

import styles from './pluginDirectory.module.scss';

function itemTitle(schema: ArrayFieldTemplateProps['schema']): string {
  const items = schema.items;
  if (items && !Array.isArray(items) && typeof items !== 'boolean') {
    return items.title ?? 'Item';
  }
  return 'Item';
}

function ConfigFieldTemplate(props: FieldTemplateProps) {
  const {
    id,
    classNames,
    style,
    label,
    help,
    required,
    description,
    errors,
    children,
    schema,
    hidden,
  } = props;

  if (hidden) {
    return (
      <div className={classNames} style={style}>
        {children}
      </div>
    );
  }

  if (schema.type === 'object' || schema.type === 'array') {
    return (
      <div className={classNames} style={style}>
        {children}
      </div>
    );
  }

  const isCheckbox = schema.type === 'boolean';
  const fieldLabel = (
    <label htmlFor={id} className={styles.fieldLabel}>
      {label}
      {required && <span aria-hidden="true"> *</span>}
    </label>
  );

  return (
    <div
      className={`${classNames} ${styles.formField} ${
        isCheckbox ? styles.checkboxField : ''
      }`}
      style={style}
    >
      {isCheckbox ? (
        <>
          {children}
          {fieldLabel}
        </>
      ) : (
        <>
          {fieldLabel}
          {children}
        </>
      )}
      {description}
      {errors}
      {help}
    </div>
  );
}

function ConfigFieldErrorTemplate({ errors }: FieldErrorProps) {
  if (!errors || errors.length === 0) {
    return null;
  }
  return (
    <p className={styles.fieldError}>
      {errors.map((error, index) => (
        <React.Fragment key={index}>
          {index > 0 && ', '}
          {error}
        </React.Fragment>
      ))}
    </p>
  );
}

function ConfigErrorListTemplate() {
  return null;
}

function ConfigObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  const { title, description, properties, fieldPathId } = props;
  const isRoot = fieldPathId.path.length === 0;

  return (
    <fieldset className={styles.fieldGroup}>
      <legend>{isRoot ? 'Configuration fields' : title}</legend>
      {description}
      <div className={styles.fieldStack}>
        {properties.map(property => (
          <React.Fragment key={property.name}>
            {property.content}
          </React.Fragment>
        ))}
      </div>
    </fieldset>
  );
}

function ConfigArrayFieldTemplate(props: ArrayFieldTemplateProps) {
  const { title, items, canAdd, onAddClick, schema } = props;
  const name = itemTitle(schema);

  return (
    <fieldset className={styles.fieldGroup}>
      <legend>{title}</legend>
      <div className={styles.arrayItems}>
        {items.map((item, index) => (
          <div className={styles.arrayItem} key={index}>
            {item}
          </div>
        ))}
      </div>
      {canAdd && (
        <button
          type="button"
          className="button button--outline button--primary button--sm"
          onClick={onAddClick}
        >
          Add {name}
        </button>
      )}
    </fieldset>
  );
}

export const configFormTemplates: Partial<TemplatesType> = {
  FieldTemplate: ConfigFieldTemplate,
  FieldErrorTemplate: ConfigFieldErrorTemplate,
  ErrorListTemplate: ConfigErrorListTemplate,
  ObjectFieldTemplate: ConfigObjectFieldTemplate,
  ArrayFieldTemplate: ConfigArrayFieldTemplate,
};

function ConfigTextWidget({
  id,
  value,
  required,
  disabled,
  readonly,
  schema,
  onChange,
}: WidgetProps) {
  const isNumeric = schema.type === 'integer' || schema.type === 'number';
  return (
    <input
      id={id}
      type={isNumeric ? 'number' : 'text'}
      step={schema.type === 'integer' ? 1 : 'any'}
      required={required}
      disabled={disabled || readonly}
      value={value === undefined ? '' : value}
      onChange={event => {
        const raw = event.currentTarget.value;
        if (!isNumeric) {
          onChange(raw);
          return;
        }
        onChange(raw === '' ? undefined : Number(raw));
      }}
    />
  );
}

function ConfigCheckboxWidget({
  id,
  value,
  disabled,
  readonly,
  onChange,
}: WidgetProps) {
  return (
    <input
      id={id}
      type="checkbox"
      checked={typeof value === 'boolean' ? value : false}
      disabled={disabled || readonly}
      onChange={event => onChange(event.currentTarget.checked)}
    />
  );
}

function ConfigSelectWidget({
  id,
  value,
  required,
  disabled,
  readonly,
  onChange,
  options,
}: WidgetProps) {
  const enumOptions = options.enumOptions ?? [];
  return (
    <select
      id={id}
      required={required}
      disabled={disabled || readonly}
      value={value === undefined ? '' : String(value)}
      onChange={event => {
        if (event.currentTarget.value === '') {
          onChange(undefined);
          return;
        }
        const selected = enumOptions.find(
          option => String(option.value) === event.currentTarget.value,
        );
        onChange(selected ? selected.value : event.currentTarget.value);
      }}
    >
      <option value="" />
      {enumOptions.map(option => (
        <option key={String(option.value)} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export const configFormWidgets: RegistryWidgetsType = {
  TextWidget: ConfigTextWidget,
  CheckboxWidget: ConfigCheckboxWidget,
  SelectWidget: ConfigSelectWidget,
};
