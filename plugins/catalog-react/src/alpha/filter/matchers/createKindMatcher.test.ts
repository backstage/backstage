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
import { createKindMatcher } from './createKindMatcher';

describe('createKindMatcher', () => {
  const component = { kind: 'Component' } as unknown as Entity;
  const user = { kind: 'User' } as unknown as Entity;
  const resource = { kind: 'Resource' } as unknown as Entity;

  const err = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('supports valid parameters', () => {
    expect(createKindMatcher(['component'], err)(component)).toBe(true);
    expect(createKindMatcher(['componenT'], err)(component)).toBe(true);
    expect(createKindMatcher(['user'], err)(component)).toBe(false);

    expect(err).not.toHaveBeenCalled();
  });

  it('matches if ANY parameter matches', () => {
    expect(createKindMatcher(['user', 'component'], err)(user)).toBe(true);
    expect(createKindMatcher(['user', 'component'], err)(component)).toBe(true);
    expect(createKindMatcher(['user', 'component'], err)(resource)).toBe(false);

    expect(err).not.toHaveBeenCalled();
  });
});
