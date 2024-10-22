/*
 * Copyright 2024 The Backstage Authors
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
  GenericObjectType,
  NAME_KEY,
  PathSchema,
  RJSF_ADDITIONAL_PROPERTIES_FLAG,
  ValidatorType,
  createSchemaUtils,
} from '@rjsf/utils';
import { JsonSchema } from 'json-schema-library';

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _pick from 'lodash/pick';
import { useMemo } from 'react';

// copied from rjsf: https://github.com/rjsf-team/react-jsonschema-form/blob/c77378b2c867778924087c7e75b23b1bab49ad74/packages/core/src/components/Form.tsx#L568-L598
const getFieldNames = <T>(
  pathSchema: PathSchema<T>,
  formData?: T,
): string[][] => {
  const getAllPaths = (
    _obj: GenericObjectType,
    acc: string[][] = [],
    paths: string[][] = [[]],
  ) => {
    Object.keys(_obj).forEach((key: string) => {
      if (typeof _obj[key] === 'object') {
        const newPaths = paths.map(path => [...path, key]);
        // If an object is marked with additionalProperties, all its keys are valid
        if (
          _obj[key][RJSF_ADDITIONAL_PROPERTIES_FLAG] &&
          _obj[key][NAME_KEY] !== ''
        ) {
          acc.push(_obj[key][NAME_KEY]);
        } else {
          getAllPaths(_obj[key], acc, newPaths);
        }
      } else if (key === NAME_KEY && _obj[key] !== '') {
        paths.forEach(path => {
          const formValue = _get(formData, path);
          // adds path to fieldNames if it points to a value
          // or an empty object/array
          if (
            typeof formValue !== 'object' ||
            _isEmpty(formValue) ||
            (Array.isArray(formValue) &&
              formValue.every(val => typeof val !== 'object'))
          ) {
            acc.push(path);
          }
        });
      }
    });
    return acc;
  };

  return getAllPaths(pathSchema);
};

// copied from rjsf: https://github.com/rjsf-team/react-jsonschema-form/blob/c77378b2c867778924087c7e75b23b1bab49ad74/packages/core/src/components/Form.tsx#L548
const getUsedFormData = <T>(
  formData: T | undefined,
  fields: string[][],
): T | undefined => {
  // For the case of a single input form
  if (fields.length === 0 && typeof formData !== 'object') {
    return formData;
  }

  // _pick has incorrect type definition, it works with string[][], because lodash/hasIn supports it
  const data: GenericObjectType = _pick(
    formData,
    fields as unknown as string[],
  );
  if (Array.isArray(formData)) {
    return Object.keys(data).map((key: string) => data[key]) as unknown as T;
  }

  return data as T;
};

export const useSchemaUtils = ({
  validator,
  schema,
}: {
  validator: ValidatorType;
  schema: JsonSchema;
}) => {
  return useMemo(() => {
    if (!schema) {
      return undefined;
    }

    const schemaUtils = createSchemaUtils(validator, schema);
    return {
      omitExtraData: <T>(formData?: T): T | undefined => {
        const retrievedSchema = schemaUtils.retrieveSchema(schema, formData);
        const pathSchema = schemaUtils.toPathSchema(
          retrievedSchema,
          '',
          formData,
        ) as PathSchema<T>;
        const fieldNames = getFieldNames(pathSchema, formData);
        const newFormData = getUsedFormData(formData, fieldNames);
        return newFormData;
      },
    };
  }, [validator, schema]);
};
