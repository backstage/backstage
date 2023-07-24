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
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { MockStorageApi, TestApiProvider } from '@backstage/test-utils';
import { featureFlagsApiRef, storageApiRef } from '@backstage/core-plugin-api';
import { useHomeStorage } from './CustomHomepageGrid';
import { GridWidget } from './types';
import { LocalStorageFeatureFlags } from '@backstage/core-app-api';

describe('CustomHomepageGrid', () => {
  describe('useHomeStorage', () => {
    const storageApi = MockStorageApi.create();

    const Wrapper = (props: { children?: React.ReactNode }) => (
      <TestApiProvider
        apis={[
          [storageApiRef, storageApi],
          [featureFlagsApiRef, new LocalStorageFeatureFlags()],
        ]}
      >
        {props.children}
      </TestApiProvider>
    );

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should change widgets', async () => {
      const { result } = renderHook(() => useHomeStorage([]), {
        wrapper: Wrapper,
      });

      expect(result.current[0]).toStrictEqual([]);

      const settings: GridWidget[] = [
        {
          id: 'test',
          layout: { i: 'id', h: 3, w: 3, x: 0, y: 0 },
          settings: {},
        },
      ];
      act(() => {
        result.current[1](settings);
      });
      expect(result.current[0]).toStrictEqual(settings);
    });
  });
});
