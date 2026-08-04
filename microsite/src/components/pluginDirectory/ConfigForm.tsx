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
  ConfigError,
  ConfigValue,
} from '../../pluginDirectory/config';
import { createInitialConfig } from '../../pluginDirectory/config';
import type { ConfigSchema } from '../../pluginDirectory/manifest';
import React, { useId, useRef } from 'react';

import styles from './pluginDirectory.module.scss';

interface ConfigFormProps {
  schema: ConfigSchema;
  value: ConfigValue;
  errors: ConfigError[];
  onChange: (value: ConfigValue) => void;
}

interface ConfigFieldProps extends ConfigFormProps {
  name: string;
  path: string[];
  required: boolean;
  itemIndex?: number;
}


function isConfigObject(
  value: ConfigValue,
): value is { [key: string]: ConfigValue | undefined } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}


function ConfigField({
  schema,
  value,
  errors,
  onChange,
  name,
  path,
  required,
  itemIndex,
}: ConfigFieldProps) {
  const baseLabel = schema['x-ui']?.label ?? name;
  const label =
    itemIndex === undefined ? baseLabel : `${baseLabel} ${itemIndex + 1}`;
  const id = useId();
  const arrayItemKeys = useRef<string[]>([]);
  const nextArrayItemKey = useRef(0);
  const descriptionId = schema.description ? `${id}-description` : undefined;
  const error = errors.find(
    candidate =>
      candidate.path.length === path.length &&
      candidate.path.every((segment, index) => segment === path[index]),
  );
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  if (schema['x-ui']?.secretEnv) {
    const placeholder = `\${${schema['x-ui'].secretEnv}}`;
    return (
      <div
        className={styles.formField}
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={describedBy}
      >
        <span id={`${id}-label`} className={styles.fieldLabel}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </span>
        {schema.description && (
          <p id={descriptionId} className={styles.fieldHelp}>
            {schema.description}
          </p>
        )}
        <code className={styles.secretPlaceholder}>{placeholder}</code>
        {error && (
          <p id={errorId} className={styles.fieldError}>
            {error.message}
          </p>
        )}
      </div>
    );
  }

  if (schema.type === 'object') {
    const objectValue = isConfigObject(value) ? value : {};
    const requiredProperties = new Set(schema.required);
    return (
      <fieldset
        className={`${styles.fieldGroup} ${
          itemIndex === undefined ? '' : styles.arrayObject
        }`}
        aria-describedby={describedBy}
      >
        <legend>{label}</legend>
        {schema.description && (
          <p id={descriptionId} className={styles.fieldHelp}>
            {schema.description}
          </p>
        )}
        {error && (
          <p id={errorId} className={styles.fieldError}>
            {error.message}
          </p>
        )}
        <div className={styles.fieldStack}>
          {Object.entries(schema.properties).map(([key, childSchema]) => (
            <ConfigField
              key={key}
              schema={childSchema}
              value={objectValue[key]}
              errors={errors}
              onChange={childValue =>
                onChange({ ...objectValue, [key]: childValue })
              }
              name={key}
              path={[...path, key]}
              required={requiredProperties.has(key)}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  if (schema.type === 'array') {
    const items = Array.isArray(value) ? value : [];
    const itemName = schema.items['x-ui']?.label ?? 'Item';
    while (arrayItemKeys.current.length < items.length) {
      arrayItemKeys.current.push(`${id}-item-${nextArrayItemKey.current}`);
      nextArrayItemKey.current += 1;
    }
    if (arrayItemKeys.current.length > items.length) {
      arrayItemKeys.current.length = items.length;
    }
    return (
      <fieldset className={styles.fieldGroup} aria-describedby={describedBy}>
        <legend>{label}</legend>
        {schema.description && (
          <p id={descriptionId} className={styles.fieldHelp}>
            {schema.description}
          </p>
        )}
        {error && (
          <p id={errorId} className={styles.fieldError}>
            {error.message}
          </p>
        )}
        <div className={styles.arrayItems}>
          {items.map((item, index) => (
            <div className={styles.arrayItem} key={arrayItemKeys.current[index]}>
              <ConfigField
                schema={schema.items}
                value={item}
                errors={errors}
                onChange={itemValue =>
                  onChange(
                    items.map((currentItem, currentIndex) =>
                      currentIndex === index ? itemValue : currentItem,
                    ),
                  )
                }
                name={itemName}
                path={[...path, String(index)]}
                required
                itemIndex={index}
              />
              <button
                type="button"
                className="button button--outline button--secondary button--sm"
                onClick={() => {
                  arrayItemKeys.current.splice(index, 1);
                  onChange(
                    items.filter(
                      (_item, itemIndexToKeep) =>
                        itemIndexToKeep !== index,
                    ),
                  );
                }}
              >
                Remove {itemName} {index + 1}
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="button button--outline button--primary button--sm"
          onClick={() =>
            onChange([
              ...items,
              createInitialConfig(schema.items, { required: true }),
            ])
          }
        >
          Add {itemName}
        </button>
      </fieldset>
    );
  }

  const commonControlProps = {
    id,
    name: path.join('.'),
    'aria-label': label,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
  };

  let control: React.ReactNode;
  if (schema.type === 'boolean') {
    control = (
      <input
        {...commonControlProps}
        type="checkbox"
        checked={typeof value === 'boolean' ? value : false}
        onChange={event => onChange(event.currentTarget.checked)}
      />
    );
  } else if (schema.enum) {
    control = (
      <select
        {...commonControlProps}
        required={required}
        value={value === undefined ? '' : String(value)}
        onChange={event => {
          if (event.currentTarget.value === '') {
            onChange(undefined);
          } else if (schema.type === 'string') {
            onChange(event.currentTarget.value);
          } else {
            onChange(Number(event.currentTarget.value));
          }
        }}
      >
        <option value="">Select {label}</option>
        {schema.enum.map(option => (
          <option key={String(option)} value={String(option)}>
            {String(option)}
          </option>
        ))}
      </select>
    );
  } else if (schema.type === 'string') {
    control = (
      <input
        {...commonControlProps}
        required={required}
        type="text"
        value={typeof value === 'string' ? value : ''}
        onChange={event => onChange(event.currentTarget.value)}
      />
    );
  } else {
    control = (
      <input
        {...commonControlProps}
        required={required}
        type="number"
        step={schema.type === 'integer' ? 1 : 'any'}
        value={typeof value === 'number' ? value : ''}
        onChange={event =>
          onChange(
            event.currentTarget.value === ''
              ? undefined
              : Number(event.currentTarget.value),
          )
        }
      />
    );
  }

  return (
    <div
      className={`${styles.formField} ${
        schema.type === 'boolean' ? styles.checkboxField : ''
      }`}
    >
      <label htmlFor={id} className={styles.fieldLabel}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {schema.description && (
        <p id={descriptionId} className={styles.fieldHelp}>
          {schema.description}
        </p>
      )}
      {control}
      {error && (
        <p id={errorId} className={styles.fieldError}>
          {error.message}
        </p>
      )}
    </div>
  );
}

export function ConfigForm({
  schema,
  value,
  errors,
  onChange,
}: ConfigFormProps) {
  return (
    <ConfigField
      schema={schema}
      value={value}
      errors={errors}
      onChange={onChange}
      name="Configuration fields"
      path={[]}
      required
    />
  );
}
