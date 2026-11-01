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

import { ErrorSchemaBuilder, RJSFSchema } from '@rjsf/utils';
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

    const errorSchema = new ErrorSchemaBuilder()
      .addErrors('root')
      .addErrors('child', 'a').ErrorSchema;
    expect(custom.toErrorList(errorSchema)).toEqual([
      { property: '.', message: 'root', stack: '. root' },
      { property: '.a', message: 'child', stack: '.a child' },
    ]);
  });

  it('supports the errorMessage keyword when enabled', () => {
    // `errorMessage` is not part of the RJSF schema type
    const messageSchema = {
      type: 'object',
      required: ['name', 'id'],
      properties: {
        name: { type: 'string', pattern: '^[a-z]+$' },
        postcode: { type: 'string', pattern: '^[0-9]+$', minLength: 5 },
        id: { type: 'string', errorMessage: 'bad id' },
        owner: { $ref: '#/definitions/owner' },
      },
      definitions: {
        owner: {
          type: 'string',
          pattern: '^[a-z]+$',
          errorMessage: { pattern: 'lowercase owner', _: 'bad owner' },
        },
      },
      errorMessage: {
        properties: { postcode: 'invalid postcode' },
        required: { name: 'name is needed' },
      },
    } as RJSFSchema;
    const data = { postcode: 'abc', id: 1, owner: 'ABC' };

    const custom = customizeValidator({ errorMessage: true });
    const byProperty = Object.fromEntries(
      custom
        .validateFormData(data, messageSchema)
        .errors.map(e => [e.property, e.message]),
    );
    expect(byProperty).toEqual({
      '.name': 'name is needed',
      '.postcode': 'invalid postcode',
      '.id': 'bad id',
      '.owner': 'lowercase owner',
    });

    const plain = validator.validateFormData(data, messageSchema).errors;
    expect(plain.map(e => e.message)).not.toContain('invalid postcode');
    expect(plain.filter(e => e.property === '.postcode')).toHaveLength(2);
  });

  it('applies errorMessage to children through allOf, items and dependencies', () => {
    const messageSchema = {
      type: 'object',
      allOf: [{ properties: { a: { type: 'string', minLength: 3 } } }],
      properties: {
        list: {
          type: 'array',
          items: { type: 'string' },
          errorMessage: { items: { 1: 'second item must be a string' } },
        },
      },
      dependencies: { b: ['c'] },
      errorMessage: {
        properties: { a: 'a is too short' },
        dependencies: { b: 'b needs c' },
      },
    } as RJSFSchema;

    const custom = customizeValidator({ errorMessage: true });
    const errors = custom.validateFormData(
      { a: 'x', list: ['ok', 2], b: 1 },
      messageSchema,
    ).errors;
    expect(errors.map(e => [e.property, e.message])).toEqual(
      expect.arrayContaining([
        ['.a', 'a is too short'],
        ['.list.1', 'second item must be a string'],
        ['', 'b needs c'],
      ]),
    );
    expect(errors).toHaveLength(3);
  });

  it('reports errors on fields with special names and keeps distinct errors', () => {
    const specialSchema: RJSFSchema = {
      type: 'object',
      properties: {
        'display name': { type: 'string' },
        'team/name': { type: 'string' },
        'a.b': { type: 'string' },
      },
      anyOf: [
        {
          properties: {
            x: { type: 'string', minLength: 3 },
            y: { type: 'string', minLength: 3 },
          },
        },
        { required: ['z'] },
      ],
      dependencies: {
        d: ['e'],
        f: { properties: { g: { type: 'string' } } },
      },
    };

    const result = validator.validateFormData(
      {
        'display name': 1,
        'team/name': 1,
        'a.b': 1,
        x: 'a',
        y: 'b',
        d: 1,
        f: 1,
        g: 0,
      } as any,
      specialSchema,
    );
    const properties = result.errors.map(e => e.property);
    expect(properties).toEqual(
      expect.arrayContaining([
        '.display name',
        '.team/name',
        '["a.b"]',
        '.x',
        '.y',
        '.g',
      ]),
    );
    expect(result.errors.map(e => e.message)).toContain(
      'Instance has "d" but does not have "e".',
    );
    expect(result.errorSchema).toEqual(
      expect.objectContaining({
        'display name': { __errors: [expect.any(String)] },
        'team/name': { __errors: [expect.any(String)] },
        'a.b': { __errors: [expect.any(String)] },
      }),
    );
  });

  it('keeps custom formats separate between validators', () => {
    const refSchema: RJSFSchema = { type: 'string', format: 'color' };
    const custom = customizeValidator({ customFormats: { color: /^blue$/ } });
    expect(custom.validateFormData('blue', refSchema).errors).toEqual([]);
    expect(custom.validateFormData('red', refSchema).errors).toHaveLength(1);
    // the default validator still uses the built-in color format
    expect(validator.validateFormData('red', refSchema).errors).toEqual([]);
    expect(custom.validateFormData('red', refSchema).errors).toHaveLength(1);

    const entityRef: RJSFSchema = { type: 'string', format: 'entity-ref' };
    customizeValidator({ customFormats: { 'entity-ref': /^x$/ } });
    expect(validator.validateFormData('y', entityRef).errors).toEqual([]);
  });

  it('handles schema IDs, quoted names, aggregate messages and false schemas', () => {
    const root = {
      definitions: {
        id: { $id: 'urn:example:id', type: 'string' },
      },
    } as RJSFSchema;
    expect(
      validator.isValid(root.definitions!.id as RJSFSchema, 'a', root),
    ).toBe(true);
    expect(validator.isValid(root.definitions!.id as RJSFSchema, 1, root)).toBe(
      false,
    );

    const messageSchema = {
      type: 'object',
      required: ["owner's name", 'b'],
      properties: {
        0: { type: 'string' },
        strict: {
          type: 'object',
          additionalProperties: false,
          errorMessage: { additionalProperties: 'no extras' },
        },
        list: { type: 'array', items: { type: 'string' } },
      },
      errorMessage: {
        required: { "owner's name": 'owner is needed' },
        properties: { 0: 'zero must be a string' },
        _: 'something is wrong',
      },
    } as RJSFSchema;
    const custom = customizeValidator({ errorMessage: true });
    const errors = custom
      .validateFormData({ 0: 1, strict: { x: 1 } }, messageSchema)
      .errors.map(e => [e.property, e.message]);
    expect(errors).toEqual(
      expect.arrayContaining([
        [`["owner's name"]`, 'owner is needed'],
        ['.0', 'zero must be a string'],
        ['.strict', 'no extras'],
        ['', 'something is wrong'],
      ]),
    );
    expect(errors).toHaveLength(4);

    // a string message for all required errors is reported once, for the object
    const aggregate = custom.validateFormData({}, {
      type: 'object',
      required: ['a', 'b'],
      errorMessage: 'Fill in all fields',
    } as RJSFSchema).errors;
    expect(aggregate.map(e => [e.property, e.message])).toEqual([
      ['', 'Fill in all fields'],
    ]);

    // without custom messages, false schemas report the keyword error only
    const plain = validator.validateFormData(
      { strict: { x: 1 } },
      messageSchema,
    ).errors;
    expect(plain.map(e => e.message)).not.toContain('False boolean schema.');
  });

  it('keeps false schema failures, resolves IDs and finds nested titles', () => {
    const custom = customizeValidator({ errorMessage: true });

    const forbiddenSchema = {
      type: 'object',
      properties: { forbidden: false, name: { type: 'string' } },
      errorMessage: { properties: { forbidden: 'not allowed' } },
    } as RJSFSchema;
    expect(
      validator
        .validateFormData({ forbidden: 1, name: 2 }, forbiddenSchema)
        .errors.map(e => e.property),
    ).toEqual(expect.arrayContaining(['.forbidden', '.name']));
    expect(
      custom
        .validateFormData({ forbidden: 1, name: 2 }, forbiddenSchema)
        .errors.map(e => [e.property, e.message]),
    ).toEqual(expect.arrayContaining([['.forbidden', 'not allowed']]));

    const idSchema = {
      type: 'object',
      properties: { owner: { $ref: 'urn:example:owner' } },
      definitions: {
        owner: {
          $id: 'urn:example:owner',
          type: 'string',
          pattern: '^[a-z]+$',
          errorMessage: 'lowercase owner',
        },
      },
    } as RJSFSchema;
    expect(
      custom
        .validateFormData({ owner: 'ABC' }, idSchema)
        .errors.map(e => e.message),
    ).toEqual(['lowercase owner']);

    const nestedSchema: RJSFSchema = {
      type: 'object',
      properties: { person: { $ref: '#/definitions/person' } },
      definitions: {
        person: {
          type: 'object',
          required: ['name'],
          properties: { name: { type: 'string' } },
        },
      },
    };
    const [nested] = validator.validateFormData(
      { person: {} },
      nestedSchema,
      undefined,
      undefined,
      { person: { name: { 'ui:title': 'Full name' } } },
    ).errors;
    expect(nested.property).toBe('.person.name');
    expect(nested.message).toContain("'Full name'");
  });
});
