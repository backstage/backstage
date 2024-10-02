/*
 * Copyright 2023 The Backstage Authors
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
import { first } from 'lodash';
import { type ParsedTemplateSchema } from '../../hooks/useTemplateSchema';
import {
  getInitialFormState,
  hasErrors,
  makeStepKey,
  transformSchemaToProps,
} from './utils';

describe('hasErrors', () => {
  it('should return false for empty _errors', () => {
    expect(
      hasErrors({
        name: {
          __errors: [],
          addError: jest.fn(),
        },
      }),
    ).toBe(false);
  });

  it('should return true for a single error', () => {
    expect(
      hasErrors({
        name: {
          __errors: ['an error'],
          addError: jest.fn(),
        },
      }),
    ).toBe(true);
  });

  it('should return true for more than one error', () => {
    expect(
      hasErrors({
        name: {
          __errors: [],
          addError: jest.fn(),
        },
        general: {
          address: {
            __errors: [],
            addError: jest.fn(),
          },
          name: {
            __errors: ['something is broken here!'],
            addError: jest.fn(),
          },
        },
      }),
    ).toBe(true);
  });

  it('should not return false when the error is an empty object', () => {
    const errors = {
      something: {},
      otherThing: {},
      someName: {
        __errors: [
          'Accepts alphanumeric values along with _(underscore) and -(hypen) as special characters',
        ],
        addError: jest.fn(),
      },
      someOtherName: {
        __errors: ['Must start with an alphabet & not contain .(period)'],
        addError: jest.fn(),
      },
      aName: {
        __errors: [],
        addError: jest.fn(),
      },
      bName: {
        __errors: [],
        addError: jest.fn(),
      },
      cName: {
        __errors: [],
        addError: jest.fn(),
      },
    };

    expect(hasErrors(errors)).toBe(true);
  });
});

describe('transformSchemaToProps', () => {
  it('should replace ui:ObjectFieldTemplate with actual component', () => {
    const layouts = [{ name: 'TwoColumn', component: jest.fn() }];

    const step: ParsedTemplateSchema = {
      title: 'Fill in some steps',
      mergedSchema: {},
      schema: {},
      uiSchema: {
        'ui:ObjectFieldTemplate': 'TwoColumn' as any,
        name: {
          'ui:field': 'EntityNamePicker',
          'ui:autofocus': true,
        },
      },
    };

    const { uiSchema } = transformSchemaToProps(step, { layouts });
    expect(uiSchema['ui:ObjectFieldTemplate']).toEqual(layouts[0].component);
  });
});

describe('makeStepKey', () => {
  it('should return a string with step prefix', () => {
    expect(makeStepKey(1)).toEqual('step-1');
    expect(makeStepKey('2')).toEqual('step-2');
  });
});

describe('getInitialFormState', () => {
  const templateSchema = [
    { mergedSchema: { properties: { firstName: '' } } },
    { mergedSchema: { properties: { lastName: '' } } },
  ] as any;
  it('should return a record with step keys', () => {
    const initialState = { firstName: 'John', lastName: 'Doe' };
    expect(getInitialFormState(templateSchema, initialState)).toEqual({
      'step-0': { firstName: 'John' },
      'step-1': { lastName: 'Doe' },
    });
  });

  it('should return a record with step keys when no initial state is provided', () => {
    expect(getInitialFormState(templateSchema, {})).toEqual({
      'step-0': {},
      'step-1': {},
    });
  });
});
