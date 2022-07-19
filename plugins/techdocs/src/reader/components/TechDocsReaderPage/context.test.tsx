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

import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { ThemeProvider } from '@material-ui/core';

import { lightTheme } from '@backstage/theme';
import { TestApiProvider } from '@backstage/test-utils';
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import {
  techdocsApiRef,
  TechDocsMetadata,
  TechDocsReaderPageProvider,
} from '@backstage/plugin-techdocs-react';

import { useEntityMetadata, useTechDocsMetadata } from './context';

const mockEntityMetadata: Entity = {
  apiVersion: 'v1',
  kind: 'Component',
  metadata: {
    name: 'test',
    namespace: 'default',
  },
  spec: {
    owner: 'test',
  },
};

const mockTechDocsMetadata: TechDocsMetadata = {
  site_name: 'test-componnet',
  site_description: 'this is a test component',
};

const techdocsApiMock = {
  getEntityMetadata: jest.fn().mockResolvedValue(mockEntityMetadata),
  getTechDocsMetadata: jest.fn().mockResolvedValue(mockTechDocsMetadata),
};

const wrapper = ({
  entityRef = {
    kind: mockEntityMetadata.kind,
    name: mockEntityMetadata.metadata.name,
    namespace: mockEntityMetadata.metadata.namespace!!,
  },
  children,
}: {
  entityRef?: CompoundEntityRef;
  children: React.ReactNode;
}) => (
  <ThemeProvider theme={lightTheme}>
    <TestApiProvider apis={[[techdocsApiRef, techdocsApiMock]]}>
      <TechDocsReaderPageProvider entityRef={entityRef}>
        {children}
      </TechDocsReaderPageProvider>
    </TestApiProvider>
  </ThemeProvider>
);

describe('context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useEntityMetadata', () => {
    it('should return loading state', async () => {
      const { result } = renderHook(() => useEntityMetadata());

      await expect(result.current.loading).toEqual(true);
    });

    it('should return expected entity values', async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => useEntityMetadata(),
        { wrapper },
      );

      await waitForNextUpdate();

      expect(result.current.value).toBeDefined();
      expect(result.current.error).toBeUndefined();
      expect(result.current.value).toMatchObject(mockEntityMetadata);
    });
  });

  describe('useTechDocsMetadata', () => {
    it('should return loading state', async () => {
      const { result } = renderHook(() => useTechDocsMetadata());

      await expect(result.current.loading).toEqual(true);
    });

    it('should return expected techdocs metadata values', async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => useTechDocsMetadata(),
        { wrapper },
      );

      await waitForNextUpdate();

      expect(result.current.value).toBeDefined();
      expect(result.current.error).toBeUndefined();
      expect(result.current.value).toMatchObject(mockTechDocsMetadata);
    });
  });
});
