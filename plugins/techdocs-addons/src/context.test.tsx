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
import { TechDocsMetadata } from './types';
import {
  useEntityMetadata,
  useTechDocsMetadata,
  useTechDocsReaderPage,
  TechDocsEntityProvider,
  TechDocsMetadataProvider,
  TechDocsReaderPageProvider,
} from './context';
import { renderHook, act } from '@testing-library/react-hooks';

import { Entity, CompoundEntityRef } from '@backstage/catalog-model';

const mockEntity: Entity = {
  apiVersion: 'v1',
  kind: 'Component',
  metadata: { name: 'test-component', namespace: 'default' },
};

const mockTechDocsMetadata: TechDocsMetadata = {
  site_name: 'test-componnet',
  site_description: 'this is a test component',
};

const mockShadowRoot = () => {
  const div = document.createElement('div');
  const shadowRoot = div.attachShadow({ mode: 'open' });
  shadowRoot.innerHTML = '<h1>Shadow DOM Mock</h1>';
  return shadowRoot;
};

const wrapper = ({
  entityName = {
    namespace: mockEntity.metadata.namespace!!,
    kind: mockEntity.kind,
    name: mockEntity.metadata.name,
  },
  children,
}: {
  entityName: CompoundEntityRef;
  children: React.ReactNode;
}) => (
  <TechDocsMetadataProvider
    asyncValue={{
      loading: false,
      error: undefined,
      value: mockTechDocsMetadata,
    }}
  >
    <TechDocsEntityProvider
      asyncValue={{
        loading: false,
        error: undefined,
        value: mockEntity,
      }}
    >
      <TechDocsReaderPageProvider entityName={entityName}>
        {children}
      </TechDocsReaderPageProvider>
    </TechDocsEntityProvider>
  </TechDocsMetadataProvider>
);

describe('context', () => {
  describe('useEntityMetadata', () => {
    it('should return loading state', async () => {
      const { result } = renderHook(() => useEntityMetadata());

      await expect(result.current.loading).toEqual(true);
    });

    it('should return expected entity values', async () => {
      const { result } = renderHook(() => useEntityMetadata(), { wrapper });

      expect(result.current.value).toBeDefined();
      expect(result.current.error).toBeUndefined();
      expect(result.current.value).toMatchObject(mockEntity);
    });
  });

  describe('useTechDocsMetadata', () => {
    it('should return loading state', async () => {
      const { result } = renderHook(() => useTechDocsMetadata());

      await expect(result.current.loading).toEqual(true);
    });

    it('should return expected techdocs metadata values', async () => {
      const { result } = renderHook(() => useTechDocsMetadata(), { wrapper });

      expect(result.current.value).toBeDefined();
      expect(result.current.error).toBeUndefined();
      expect(result.current.value).toMatchObject(mockTechDocsMetadata);
    });
  });

  describe('useTechDocsReaderPage', () => {
    it('should set title', () => {
      const { result } = renderHook(() => useTechDocsReaderPage(), { wrapper });

      expect(result.current.title).toBe('');

      act(() => result.current.setTitle('test site title'));
      expect(result.current.title).toBe('test site title');
    });

    it('should set subtitle', () => {
      const { result } = renderHook(() => useTechDocsReaderPage(), { wrapper });

      expect(result.current.subtitle).toBe('');

      act(() => result.current.setSubtitle('test site subtitle'));
      expect(result.current.subtitle).toBe('test site subtitle');
    });

    it('should set shadow root', async () => {
      const { result } = renderHook(() => useTechDocsReaderPage(), { wrapper });

      // mock shadowroot
      const shadowRoot = mockShadowRoot();

      act(() => result.current.setShadowRoot(shadowRoot));

      expect(result.current.shadowRoot?.innerHTML).toBe(
        '<h1>Shadow DOM Mock</h1>',
      );
    });
  });
});
