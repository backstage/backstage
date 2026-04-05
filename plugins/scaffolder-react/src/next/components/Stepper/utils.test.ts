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

import { vi } from 'vitest';
import { hasErrors } from './utils';

describe('hasErrors', () => {
  it('should return false for empty _errors', () => {
    expect(
      hasErrors({
        name: {
          __errors: [],
          addError: vi.fn() as any,
        },
      }),
    ).toBe(false);
  });

  it('should return true for a single error', () => {
    expect(
      hasErrors({
        name: {
          __errors: ['an error'],
          addError: vi.fn() as any,
        },
      }),
    ).toBe(true);
  });

  it('should return true for more than one error', () => {
    expect(
      hasErrors({
        name: {
          __errors: [],
          addError: vi.fn() as any,
        },
        general: {
          address: {
            __errors: [],
            addError: vi.fn() as any,
          },
          name: {
            __errors: ['something is broken here!'],
            addError: vi.fn() as any,
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
          'Accepts alphanumeric values along with _(underscore) and -(hyphen) as special characters',
        ],
        addError: vi.fn() as any,
      },
      someOtherName: {
        __errors: ['Must start with an alphabet & not contain .(period)'],
        addError: vi.fn() as any,
      },
      aName: {
        __errors: [],
        addError: vi.fn() as any,
      },
      bName: {
        __errors: [],
        addError: vi.fn() as any,
      },
      cName: {
        __errors: [],
        addError: vi.fn() as any,
      },
    };

    expect(hasErrors(errors)).toBe(true);
  });
});
