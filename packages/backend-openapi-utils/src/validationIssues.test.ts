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
  it('builds escaped JSON Pointer paths from ajv errors', () => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile({
      type: 'object',
      properties: {
        'a/b': {
          type: 'object',
          properties: { 'c~d': { type: 'string' } },
          required: ['x/y'],
        },
      },
      additionalProperties: false,
    });
    expect(validate({ 'a/b': { 'c~d': 1 }, 'e/f': 1 })).toBe(false);

    expect(validationIssuesFromAjv(validate.errors!, '/body')).toEqual([
      {
        path: '/body/e~1f',
        message: 'must NOT have additional properties',
        code: 'additionalProperties.openapi.validation',
      },
      {
        path: '/body/a~1b/x~1y',
        message: "must have required property 'x/y'",
        code: 'required.openapi.validation',
      },
      {
        path: '/body/a~1b/c~0d',
        message: 'must be string',
        code: 'type.openapi.validation',
      },
    ]);
    expect(validationIssuesFromAjv(validate.errors!)[2].path).toBe(
      '/a~1b/c~0d',
    );
  });
});

describe('validationIssuesFromValidatorError', () => {
  it('escapes property names that the validator appends unescaped', () => {
    const data = { body: { 'a/b': { 'e/f': 1 } }, query: {} };
    const issues = validationIssuesFromValidatorError(
      validatorError([
        {
          path: '/body/a~1b/x/y',
          message: "must have required property 'x/y'",
          errorCode: 'required.openapi.validation',
        },
        {
          path: '/body/a~1b/e/f',
          message: 'must NOT have additional properties',
          errorCode: 'additionalProperties.openapi.validation',
        },
        {
          path: '/body/a~1b/c~0d',
          message: 'must be string',
          errorCode: 'type.openapi.validation',
        },
      ]),
      data,
    );

    expect(issues).toEqual([
      {
        path: '/body/a~1b/x~1y',
        message: "must have required property 'x/y'",
        code: 'required.openapi.validation',
      },
      {
        path: '/body/a~1b/e~1f',
        message: 'must NOT have additional properties',
        code: 'additionalProperties.openapi.validation',
      },
      {
        path: '/body/a~1b/c~0d',
        message: 'must be string',
        code: 'type.openapi.validation',
      },
    ]);
  });

  it('handles very long and deeply nested paths without excessive work', () => {
    const depth = 50_000;
    const deepest: Record<string, unknown> = { 'x/y': 1 };
    let body: Record<string, unknown> = deepest;
    for (let i = 0; i < depth; i++) {
      body = { a: body };
    }
    const parentPath = `/body${'/a'.repeat(depth)}`;
    const additional = (path: string) =>
      validatorError([
        {
          path,
          message: 'must NOT have additional properties',
          errorCode: 'additionalProperties.openapi.validation',
        },
      ]);

    expect(
      validationIssuesFromValidatorError(additional(`${parentPath}/x/y`), {
        body,
      })?.[0].path,
    ).toBe(`${parentPath}/x~1y`);

    // A property that can't be found keeps the path as reported.
    const missingPath = `${parentPath}/not/there`;
    expect(
      validationIssuesFromValidatorError(additional(missingPath), { body })?.[0]
        .path,
    ).toBe(missingPath);

    // A long path that doesn't match the request at all.
    const longPath = `/body${'/q'.repeat(200_000)}`;
    expect(
      validationIssuesFromValidatorError(additional(longPath), {
        body: {},
      })?.[0].path,
    ).toBe(longPath);
  });

  it('normalizes paths that are not schema validation errors', () => {
    const issues = validationIssuesFromValidatorError(
      validatorError([
        { path: '/query/a/b', message: "Unknown query parameter 'a/b'" },
        { path: '.query.filter', message: "Parameter 'style' is invalid" },
        { path: '/things', message: 'unsupported media type text/plain' },
      ]),
      {},
    );

    expect(issues).toEqual([
      { path: '/query/a~1b', message: "Unknown query parameter 'a/b'" },
      { path: '/query/filter', message: "Parameter 'style' is invalid" },
      { path: '', message: 'unsupported media type text/plain' },
    ]);

    expect(
      validationIssuesFromValidatorError(new SyntaxError('bad json'), {}),
    ).toBeUndefined();
  });
});
