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
import { createTypeMatcher } from './createTypeMatcher';

describe('createTypeMatcher', () => {
  const empty1 = {} as unknown as Entity;
  const empty2 = { spec: {} } as unknown as Entity;
  const service = { spec: { type: 'service' } } as unknown as Entity;
  const website = { spec: { type: 'website' } } as unknown as Entity;
  const pipeline = { spec: { type: 'pipeline' } } as unknown as Entity;

  const err = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('supports valid parameters', () => {
    expect(createTypeMatcher(['service'], err)(empty1)).toBe(false);
    expect(createTypeMatcher(['service'], err)(empty2)).toBe(false);

    expect(createTypeMatcher(['service'], err)(service)).toBe(true);
    expect(createTypeMatcher(['sErViCe'], err)(service)).toBe(true);
    expect(createTypeMatcher(['service'], err)(service)).toBe(true);
    expect(createTypeMatcher(['website'], err)(service)).toBe(false);

    expect(err).not.toHaveBeenCalled();
  });

  it('matches if ANY parameter matches', () => {
    expect(createTypeMatcher(['service', 'website'], err)(service)).toBe(true);
    expect(createTypeMatcher(['service', 'website'], err)(website)).toBe(true);
    expect(createTypeMatcher(['service', 'website'], err)(pipeline)).toBe(
      false,
    );

    expect(err).not.toHaveBeenCalled();
  });
});
