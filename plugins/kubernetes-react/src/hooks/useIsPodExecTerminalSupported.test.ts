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
import { useApi } from '@backstage/core-plugin-api';
import { renderHook, waitFor } from '@testing-library/react';

import { useIsPodExecTerminalSupported } from './useIsPodExecTerminalSupported';

jest.mock('@backstage/core-plugin-api');

describe('useIsPodExecTerminalSupported', () => {
  let clusters: { authProvider: string }[] = [];

  beforeEach(() => {
    (useApi as any).mockReturnValue({
      getClusters: () => Promise.resolve(clusters),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each([
    {
      condition: 'valid Shell setup',
      returnValue: true,
      testClusters: [{ authProvider: 'localKubectlProxy' }],
    },
    { condition: 'clusters empty', returnValue: false, testClusters: [] },
    {
      condition: 'multi cluster setup',
      returnValue: false,
      testClusters: [
        { authProvider: 'localKubectlProxy' },
        { authProvider: 'serviceAccount' },
      ],
    },
    {
      condition: 'AuthProvider is aks',
      returnValue: false,
      testClusters: [{ authProvider: 'aks' }],
    },
    {
      condition: 'AuthProvider is google',
      returnValue: false,
      testClusters: [{ authProvider: 'google' }],
    },
    {
      condition: 'AuthProvider start with oidc',
      returnValue: false,
      testClusters: [{ authProvider: 'oidc.okta' }],
    },
  ])(
    'Should return $returnValue if $condition',
    async ({ testClusters, returnValue }) => {
      clusters = testClusters;

      const { result } = renderHook(() => useIsPodExecTerminalSupported());

      expect(result.current.loading).toEqual(true);

      await waitFor(() => {
        expect(result.current.loading).toEqual(false);
      });

      expect(result.current.value).toBe(returnValue);
    },
  );
});
