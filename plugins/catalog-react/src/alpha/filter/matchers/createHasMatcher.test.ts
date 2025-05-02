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
import { createHasMatcher } from './createHasMatcher';

describe('createHasMatcher', () => {
  const empty1 = {
    metadata: {},
  } as unknown as Entity;
  const empty2 = {
    metadata: {
      labels: {},
      links: [],
    },
  } as unknown as Entity;
  const labels = {
    metadata: {
      labels: { a: 'b' },
    },
  } as unknown as Entity;
  const links = {
    metadata: { links: [{}] },
  } as unknown as Entity;

  const err = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('supports valid parameters', () => {
    expect(createHasMatcher(['labels'], err)(empty1)).toBe(false);
    expect(createHasMatcher(['labels'], err)(empty2)).toBe(false);
    expect(createHasMatcher(['labels'], err)(labels)).toBe(true);

    expect(createHasMatcher(['links'], err)(empty1)).toBe(false);
    expect(createHasMatcher(['links'], err)(empty2)).toBe(false);
    expect(createHasMatcher(['links'], err)(links)).toBe(true);

    expect(err).not.toHaveBeenCalled();
  });

  it('matches if ANY parameter matches', () => {
    expect(createHasMatcher(['labels', 'links'], err)(empty1)).toBe(false);
    expect(createHasMatcher(['labels', 'links'], err)(empty2)).toBe(false);
    expect(createHasMatcher(['labels', 'links'], err)(labels)).toBe(true);
    expect(createHasMatcher(['labels', 'links'], err)(links)).toBe(true);

    expect(err).not.toHaveBeenCalled();
  });

  it('emits errors properly, and skips over bad parameters', () => {
    // throw if callback throws
    expect(() =>
      createHasMatcher(['labels', 'bar'], e => {
        throw e;
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"'bar' is not a valid parameter for 'has' filter expressions, expected one of 'labels','links'"`,
    );
    expect(err).not.toHaveBeenCalled();

    // continue if callback does not throw, and skip over the bad parameter
    let matcher = createHasMatcher(['labels', 'foo', 'bar'], err);
    expect(err).toHaveBeenCalledTimes(2);
    expect(err).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `'foo' is not a valid parameter for 'has' filter expressions, expected one of 'labels','links'`,
      }),
    );
    expect(err).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `'bar' is not a valid parameter for 'has' filter expressions, expected one of 'labels','links'`,
      }),
    );
    expect(matcher(empty1)).toBe(false);
    expect(matcher(labels)).toBe(true);

    // when no parameters at all match, just return true
    matcher = createHasMatcher(['foo', 'bar'], err);
    expect(matcher(empty1)).toBe(true);
    expect(matcher(labels)).toBe(true);
  });
});
