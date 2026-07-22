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
import { useEntity } from '@backstage/plugin-catalog-react';
import { renderHook } from '@testing-library/react';
import { stringifyEntityRef } from '@backstage/catalog-model';

import { useGoldenPathRef } from './useGoldenPathRef';
import { mockedEntity } from '../mocks';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: jest.fn(() => ({ entity: mockedEntity })),
}));

jest.mock('@backstage/catalog-model', () => ({
  stringifyEntityRef: jest.fn(() => 123),
}));

describe('useGoldenPathRef', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call useEntity', () => {
    renderHook(() => useGoldenPathRef());

    expect(useEntity).toHaveBeenCalled();
  });

  it('should call stringifyEntityRef with data received from useEntity', () => {
    renderHook(() => useGoldenPathRef());

    const {
      metadata: { namespace, name },
    } = mockedEntity;

    expect(stringifyEntityRef).toHaveBeenCalledWith({
      kind: 'GoldenPath',
      namespace,
      name,
    });
  });

  it('should return the result of stringifyEntityRef', () => {
    const { result } = renderHook(() => useGoldenPathRef());

    expect(result.current).toBe(123);
  });
});
