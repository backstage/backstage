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

import { Entity } from '@backstage/catalog-model';
import { createIsMatcher } from './createIsMatcher';

describe('createIsMatcher', () => {
  const empty = {
    metadata: {},
  } as unknown as Entity;
  const orphan = {
    metadata: {
      annotations: { ['backstage.io/orphan']: 'true' },
    },
  } as unknown as Entity;

  const err = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('supports valid parameters', () => {
    expect(createIsMatcher(['orphan'], err)(empty)).toBe(false);
    expect(createIsMatcher(['orphan'], err)(orphan)).toBe(true);

    expect(err).not.toHaveBeenCalled();
  });

  it('emits errors properly, and skips over bad parameters', () => {
    // throw if callback throws
    expect(() =>
      createIsMatcher(['orphan', 'foo'], e => {
        throw e;
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"'foo' is not a valid parameter for 'is' filter expressions, expected one of 'orphan'"`,
    );
    expect(err).not.toHaveBeenCalled();

    // continue if callback does not throw, and skip over the bad parameter
    let matcher = createIsMatcher(['orphan', 'foo', 'bar'], err);
    expect(err).toHaveBeenCalledTimes(2);
    expect(err).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `'foo' is not a valid parameter for 'is' filter expressions, expected one of 'orphan'`,
      }),
    );
    expect(err).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `'bar' is not a valid parameter for 'is' filter expressions, expected one of 'orphan'`,
      }),
    );
    expect(matcher(empty)).toBe(false);
    expect(matcher(orphan)).toBe(true);

    // when no parameters at all match, just return true
    matcher = createIsMatcher(['foo', 'bar'], err);
    expect(matcher(empty)).toBe(true);
    expect(matcher(orphan)).toBe(true);
  });
});
