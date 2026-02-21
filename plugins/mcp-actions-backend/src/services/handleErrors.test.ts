/*
 * Copyright 2025 The Backstage Authors
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

import {
  CustomErrorBase,
  ForwardedError,
  InputError,
  NotFoundError,
} from '@backstage/errors';
import { handleErrors } from './handleErrors';

describe('HandleErrors', () => {
  it('should properly handle built-in Backstage errors', async () => {
    let result = await handleErrors(() => {
      throw new InputError('some input error');
    });

    expect(result).toEqual({
      content: [{ type: 'text', text: 'InputError: some input error' }],
      isError: true,
    });

    result = await handleErrors(() => {
      throw new ForwardedError(
        'Failed to fetch entity',
        new NotFoundError('Entity not found'),
      );
    });

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: 'NotFoundError: Failed to fetch entity; caused by NotFoundError: Entity not found',
        },
      ],
      isError: true,
    });
  });

  it('should properly handle custom Backstage errors', async () => {
    class CustomBackstageError extends CustomErrorBase {}

    const result = await handleErrors(() => {
      throw new CustomBackstageError('some custom error');
    });

    expect(result).toEqual({
      content: [
        { type: 'text', text: 'CustomBackstageError: some custom error' },
      ],
      isError: true,
    });
  });

  it('should throw all other kinds of errors', async () => {
    await expect(
      handleErrors(() => {
        throw new Error('this is an error');
      }),
    ).rejects.toThrow('this is an error');
  });
});
