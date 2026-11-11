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

import Ajv from 'ajv';
import {
  validationIssuesFromAjv,
  validationIssuesFromValidatorError,
} from './validationIssues';

function validatorError(
  items: Array<{ path: string; message: string; errorCode?: string }>,
) {
  return Object.assign(new Error('validation failed'), { errors: items });
}

describe('validationIssuesFromAjv', () => {
  it('builds exact paths from ajv errors', () => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile({
      type: 'object',
      properties: {
        'a/b': {
          type: 'object',
          properties: { 'c~d': { type: 'string' } },
          required: ['x/y'],
        },
        items: { type: 'array', items: { type: 'string' } },
        '10': { type: 'string' },
      },
      additionalProperties: false,
    });
    expect(
      validate({
        'a/b': { 'c~d': 1 },
        'e/f': 1,
        items: ['ok', 2],
        '10': 3,
      }),
    ).toBe(false);

    expect(validationIssuesFromAjv(validate.errors!, ['body'])).toEqual([
      {
        path: ['body', 'e/f'],
        message: 'must NOT have additional properties',
        code: 'unrecognized_keys',
      },
      // A property name made only of digits becomes a number, like an index.
      {
        path: ['body', 10],
        message: 'must be string',
        code: 'invalid_type',
      },
      {
        path: ['body', 'a/b', 'x/y'],
        message: "must have required property 'x/y'",
        code: 'invalid_type',
      },
      {
        path: ['body', 'a/b', 'c~d'],
        message: 'must be string',
        code: 'invalid_type',
      },
      {
        path: ['body', 'items', 1],
        message: 'must be string',
        code: 'invalid_type',
      },
    ]);
    expect(validationIssuesFromAjv(validate.errors!)[3].path).toEqual([
      'a/b',
      'c~d',
    ]);

    const validateRoot = ajv.compile({ type: 'string' });
    expect(validateRoot(1)).toBe(false);
    const [rootIssue] = validationIssuesFromAjv(validateRoot.errors!);
    expect(rootIssue).toEqual({
      message: 'must be string',
      code: 'invalid_type',
    });
    expect(rootIssue).not.toHaveProperty('path');
    expect(
      validationIssuesFromAjv(validateRoot.errors!, ['query', 'limit']),
    ).toEqual([
      {
        path: ['query', 'limit'],
        message: 'must be string',
        code: 'invalid_type',
      },
    ]);
  });
});

describe('validationIssuesFromValidatorError', () => {
  it('keeps the name of a missing property whole and splits other paths', () => {
    const issues = validationIssuesFromValidatorError(
      validatorError([
        {
          path: '/body/a~1b/x/y',
          message: "must have required property 'x/y'",
          errorCode: 'required.openapi.validation',
        },
        {
          path: '/body/a~1b/extra',
          message: 'must NOT have additional properties',
          errorCode: 'additionalProperties.openapi.validation',
        },
        {
          path: '/body/a~1b/c~0d',
          message: 'must be string',
          errorCode: 'type.openapi.validation',
        },
        {
          path: '/body/items/0/01',
          message: 'must be string',
          errorCode: 'type.openapi.validation',
        },
        {
          path: '/body/10',
          message: "must have required property '10'",
          errorCode: 'required.openapi.validation',
        },
      ]),
    );

    expect(issues).toEqual([
      {
        path: ['body', 'a/b', 'x/y'],
        message: "must have required property 'x/y'",
        code: 'invalid_type',
      },
      {
        path: ['body', 'a/b', 'extra'],
        message: 'must NOT have additional properties',
        code: 'unrecognized_keys',
      },
      {
        path: ['body', 'a/b', 'c~d'],
        message: 'must be string',
        code: 'invalid_type',
      },
      {
        path: ['body', 'items', 0, '01'],
        message: 'must be string',
        code: 'invalid_type',
      },
      // The name of a missing property is an object key, so it stays a string.
      {
        path: ['body', '10'],
        message: "must have required property '10'",
        code: 'invalid_type',
      },
    ]);
  });

  it('normalizes paths that are not schema validation errors', () => {
    const issues = validationIssuesFromValidatorError(
      validatorError([
        { path: '/query/a/b', message: "Unknown query parameter 'a/b'" },
        { path: '.query.filter', message: "Parameter 'style' is invalid" },
        { path: '/things', message: 'unsupported media type text/plain' },
      ]),
    );

    expect(issues).toEqual([
      {
        path: ['query', 'a/b'],
        message: "Unknown query parameter 'a/b'",
        code: 'custom',
      },
      {
        path: ['query', 'filter'],
        message: "Parameter 'style' is invalid",
        code: 'custom',
      },
      {
        message: 'unsupported media type text/plain',
        code: 'custom',
      },
    ]);
    expect(issues![2]).not.toHaveProperty('path');

    expect(
      validationIssuesFromValidatorError(new SyntaxError('bad json')),
    ).toBeUndefined();
  });
});

describe('validation issue codes', () => {
  it('maps ajv keywords onto the zod v4 codes', () => {
    const ajv = new Ajv({ allErrors: true, strict: false });
    ajv.addFormat('email', /^\S+@\S+$/);
    const cases: Array<[object, unknown, string]> = [
      [{ type: 'string' }, 1, 'invalid_type'],
      [{ minLength: 2 }, 'a', 'too_small'],
      [{ minItems: 2 }, [1], 'too_small'],
      [{ minimum: 2 }, 1, 'too_small'],
      [{ exclusiveMinimum: 2 }, 2, 'too_small'],
      [{ minProperties: 1 }, {}, 'too_small'],
      [{ maxLength: 1 }, 'ab', 'too_big'],
      [{ maxItems: 1 }, [1, 2], 'too_big'],
      [{ maximum: 1 }, 2, 'too_big'],
      [{ exclusiveMaximum: 1 }, 1, 'too_big'],
      [{ maxProperties: 0 }, { a: 1 }, 'too_big'],
      [{ format: 'email' }, 'x', 'invalid_format'],
      [{ pattern: '^a$' }, 'b', 'invalid_format'],
      [{ enum: ['a'] }, 'b', 'invalid_value'],
      [{ const: 'a' }, 'b', 'invalid_value'],
      [{ multipleOf: 2 }, 3, 'not_multiple_of'],
      [
        { oneOf: [{ type: 'string' }, { type: 'number' }] },
        true,
        'invalid_union',
      ],
      [{ anyOf: [{ type: 'string' }] }, 1, 'invalid_union'],
      [{ uniqueItems: true }, [1, 1], 'custom'],
    ];
    for (const [schema, value, code] of cases) {
      const validate = ajv.compile(schema);
      expect(validate(value)).toBe(false);
      // Union keywords report the failures of each branch before their own.
      expect(validationIssuesFromAjv(validate.errors!).at(-1)?.code).toBe(code);
    }
  });
});
