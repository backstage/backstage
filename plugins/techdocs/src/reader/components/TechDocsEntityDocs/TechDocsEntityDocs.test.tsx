/*
 * Copyright 2022 The Backstage Authors
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

import React, { FC } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';

import { TestApiProvider } from '@backstage/test-utils';

import { techdocsStorageApiRef } from '../../../api';
import { EntityDocsProvider, useEntityDocs } from '../TechDocsEntityDocs';

const getEntityDocs = jest.fn();

const entityRef = {
  kind: 'Component',
  namespace: 'default',
  name: 'backstage',
};

const wrapper: FC = ({ children }) => (
  <TestApiProvider apis={[[techdocsStorageApiRef, { getEntityDocs }]]}>
    <EntityDocsProvider entityRef={entityRef}>{children}</EntityDocsProvider>
  </TestApiProvider>
);

describe('hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be loading initially', async () => {
    await act(async () => {
      const { result } = await renderHook(() => useEntityDocs(), {
        wrapper,
      });

      expect(result.current.loading).toBeTruthy();
    });
  });

  it('should handle response error', async () => {
    const error = new Error('Error');
    getEntityDocs.mockRejectedValue(error);

    const { result, waitForNextUpdate } = renderHook(() => useEntityDocs(), {
      wrapper,
    });

    await waitForNextUpdate();

    expect(result.current.error).toBe(error);
  });

  it('should return the content value', async () => {
    const content = '<html/>';
    getEntityDocs.mockResolvedValue(content);

    const { result, waitForNextUpdate } = renderHook(() => useEntityDocs(), {
      wrapper,
    });

    await waitForNextUpdate();

    expect(result.current.value).toBe(content);
  });
});
