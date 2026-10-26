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

import { RJSFSchema } from '@rjsf/utils';
import { customizeValidator, validator } from './index';

describe('validator', () => {
  const schema: RJSFSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', title: 'Name' },
      email: { type: 'string', format: 'email' },
      count: { type: 'integer', minimum: 1 },
      pair: {
        type: 'array',
        items: [{ type: 'string' }, { type: 'number' }],
      },
      owner: { $ref: '#/definitions/owner' },
    },
    definitions: {
      owner: { type: 'string', pattern: '^[a-z]+$' },
    },
  };

  it('accepts valid data', () => {
    const result = validator.validateFormData(
      { name: 'x', email: 'a@b.com', count: 2, pair: ['a', 1], owner: 'abc' },
      schema,
    );
    expect(result.errors).toEqual([]);
    expect(result.errorSchema).toEqual({});
  });

  it('reports errors with RJSF properties, titles and error schema', () => {
    const result = validator.validateFormData(
      { email: 'nope', count: 0, pair: ['a', 'b'], owner: 'ABC' },
      schema,
    );

    const byProperty = Object.fromEntries(
      result.errors.map(e => [e.property, e]),
    );
    expect(byProperty.name).toMatchObject({
      name: 'required',
      params: { missingProperty: 'name' },
      title: 'Name',
    });
    expect(byProperty.name.message).toContain("'Name'");
    expect(byProperty['.email']).toMatchObject({ name: 'format' });
    expect(byProperty['.count']).toMatchObject({ name: 'minimum' });
    // draft-07 tuple form of `items`
    expect(byProperty['.pair.1']).toMatchObject({ name: 'type' });
    // `$ref` into `definitions`
    expect(byProperty['.owner']).toMatchObject({ name: 'pattern' });

    expect(result.errorSchema.count?.__errors).toHaveLength(1);
    expect(result.errorSchema.owner?.__errors).toHaveLength(1);
  });

  it('applies transformErrors and customValidate', () => {
    const result = validator.validateFormData(
      { name: 'x', count: 0 },
      schema,
      (formData, errors) => {
        if (formData?.name === 'x') {
          errors.name?.addError('not x');
        }
        return errors;
      },
      errors => errors.filter(e => e.name !== 'minimum'),
    );
    expect(result.errors.map(e => e.stack)).toEqual(['.name not x']);
  });

  it('implements isValid against a root schema, for oneOf matching', () => {
    const root: RJSFSchema = {
      definitions: { id: { type: 'string', minLength: 3 } },
      oneOf: [{ $ref: '#/definitions/id' }, { type: 'number' }],
    };
    const [stringOption, numberOption] = root.oneOf as RJSFSchema[];
    expect(validator.isValid(stringOption, 'abcd', root)).toBe(true);
    expect(validator.isValid(stringOption, 'ab', root)).toBe(false);
    expect(validator.isValid(numberOption, 'abcd', root)).toBe(false);
    expect(validator.isValid(numberOption, 1, root)).toBe(true);
  });

  it('supports custom formats and toErrorList', () => {
    const custom = customizeValidator({
      customFormats: { 'entity-ref': /^[a-z]+:[a-z]+$/ },
    });
    const refSchema: RJSFSchema = { type: 'string', format: 'entity-ref' };
    expect(custom.validateFormData('user:me', refSchema).errors).toEqual([]);
    expect(custom.validateFormData('me', refSchema).errors).toHaveLength(1);

    expect(
      custom.toErrorList({ __errors: ['root'], a: { __errors: ['child'] } }),
    ).toEqual([
      { property: '.', message: 'root', stack: '. root' },
      { property: '.a', message: 'child', stack: '.a child' },
    ]);
  });
});
