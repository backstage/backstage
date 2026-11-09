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

import { deserializeError, serializeError } from '../serialization';
import { InputError } from './common';
import { validationIssuesFromZod } from './validation';

describe('validationIssuesFromZod', () => {
  it('converts zod issues into validation issues', () => {
    const zodLikeError = {
      issues: [
        {
          code: 'invalid_type',
          path: ['entity', 'spec', 0, 'name'],
          message: 'Expected string, received number',
        },
        {
          path: ['a/b', 'c~d'],
          message: 'Invalid value',
        },
        { code: 'custom', path: [], message: 'Invalid input' },
      ],
    };

    expect(validationIssuesFromZod(zodLikeError)).toEqual([
      {
        path: '/entity/spec/0/name',
        message: 'Expected string, received number',
        code: 'invalid_type',
      },
      { path: '/a~1b/c~0d', message: 'Invalid value' },
      { path: '', message: 'Invalid input', code: 'custom' },
    ]);

    const [prefixed, , root] = validationIssuesFromZod(zodLikeError, {
      pathPrefix: '/body',
    });
    expect(prefixed.path).toBe('/body/entity/spec/0/name');
    expect(root.path).toBe('/body');
  });
});

describe('InputError validation issues', () => {
  it('keeps validation issues through serialization', () => {
    const issues = [
      { path: '/body/location', message: 'must be string', code: 'type' },
    ];
    const error = new InputError('Invalid request', undefined, { issues });

    expect(error.issues).toBe(issues);
    expect(error.message).toBe('Invalid request');

    const serialized = serializeError(error);
    expect(serialized).toEqual({
      name: 'InputError',
      message: 'Invalid request',
      issues,
    });
    expect(JSON.parse(JSON.stringify(serialized)).issues).toEqual(issues);
    expect((deserializeError(serialized) as InputError).issues).toEqual(issues);

    const plain = new InputError('Invalid request');
    expect(plain.issues).toBeUndefined();
    expect(serializeError(plain)).not.toHaveProperty('issues');
  });
});
