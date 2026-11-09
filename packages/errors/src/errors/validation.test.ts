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
import { validationErrorItemsFromZod } from './validation';

describe('validationErrorItemsFromZod', () => {
  it('converts zod issues into validation error items', () => {
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

    expect(validationErrorItemsFromZod(zodLikeError)).toEqual([
      {
        pointer: '/entity/spec/0/name',
        detail: 'Expected string, received number',
        code: 'invalid_type',
      },
      { pointer: '/a~1b/c~0d', detail: 'Invalid value' },
      { pointer: '', detail: 'Invalid input', code: 'custom' },
    ]);

    const [prefixed, , root] = validationErrorItemsFromZod(zodLikeError, {
      pointerPrefix: '/body',
    });
    expect(prefixed.pointer).toBe('/body/entity/spec/0/name');
    expect(root.pointer).toBe('/body');
  });
});

describe('InputError validation errors', () => {
  it('keeps validation errors through serialization', () => {
    const errors = [
      { pointer: '/body/location', detail: 'must be string', code: 'type' },
    ];
    const error = new InputError('Invalid request', undefined, { errors });

    expect(error.errors).toBe(errors);
    expect(error.message).toBe('Invalid request');

    const serialized = serializeError(error);
    expect(serialized).toEqual({
      name: 'InputError',
      message: 'Invalid request',
      errors,
    });
    expect(JSON.parse(JSON.stringify(serialized)).errors).toEqual(errors);
    expect((deserializeError(serialized) as InputError).errors).toEqual(errors);

    const plain = new InputError('Invalid request');
    expect(plain.errors).toBeUndefined();
    expect(serializeError(plain)).not.toHaveProperty('errors');
  });
});
