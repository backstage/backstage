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

import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';
import { DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS } from '../../extensions/default';
import {
  buildEditorFieldExtensions,
  toFieldExtensionOptions,
} from './EditorSubPage';

describe('buildEditorFieldExtensions', () => {
  it('includes default field extensions when no custom fields are loaded', () => {
    expect(buildEditorFieldExtensions()).toEqual(
      DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS,
    );
  });

  it('keeps loaded field extensions ahead of defaults and de-duplicates by name', () => {
    const customField: FieldExtensionOptions = {
      ...DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS[0],
      component: jest.fn(() => null),
    } as FieldExtensionOptions;

    const fieldExtensions = buildEditorFieldExtensions([customField]);

    expect(fieldExtensions[0]).toBe(customField);
    expect(
      fieldExtensions.filter(field => field.name === customField.name),
    ).toHaveLength(1);
  });
});

describe('toFieldExtensionOptions', () => {
  it('flattens FieldSchema wrappers from form field blueprints', () => {
    const field = {
      $$type: '@backstage/scaffolder/FormField',
      version: 'v1',
      name: 'EntityPicker',
      component: jest.fn(() => null),
      schema: {
        schema: {
          returnValue: { type: 'string' },
          uiOptions: { type: 'object' },
        },
      },
    } as any;

    expect(toFieldExtensionOptions(field)).toMatchObject({
      name: 'EntityPicker',
      schema: {
        returnValue: { type: 'string' },
        uiOptions: { type: 'object' },
      },
    });
  });
});
