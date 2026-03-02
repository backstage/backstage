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
import { ErrorListProps, RJSFValidationError } from '@rjsf/utils';
import { AlertCircle } from 'lucide-react';
import startCase from 'lodash/startCase';

/**
 * Shows a list of errors found in the form
 *
 * @public
 */
export const ErrorListTemplate = ({ errors, schema }: ErrorListProps) => {
  function formatErrorMessage(error: RJSFValidationError) {
    if (error.property && error.message) {
      const propertyName = error.property.startsWith('.')
        ? error.property.substring(1)
        : error.property;
      if (schema.properties && propertyName in schema.properties) {
        const property = schema.properties[propertyName];

        if (typeof property === 'object' && 'title' in property) {
          return `'${property.title}' ${error.message}`;
        }
      }
      // fall back to property name
      return `'${startCase(propertyName)}' ${error.message}`;
    }
    // fall back if property does not exist
    return error.stack;
  }

  return (
    <div className="rounded-lg border bg-card p-0">
      <ul className="w-full">
        {errors.map((error, index) => (
          <li key={index} className="flex items-center gap-3 px-4 py-2">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <span className="text-sm text-wrap">
              {formatErrorMessage(error)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
