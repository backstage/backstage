/*
 * Copyright 2020 The Backstage Authors
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

import { renderHook } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { createVersionedContextForTesting } from '@backstage/version-bridge';
import {
  appTreeApiRef,
  iconsApiRef,
  AppTreeApi,
  IconsApi,
  AppTree,
  AppNode,
} from '@backstage/frontend-plugin-api';
import { useApp } from './useApp';
import { TestApiProvider, withLogCollector } from '@backstage/test-utils';

describe('useApp', () => {
  describe('old system', () => {
    const context = createVersionedContextForTesting('app-context');

    afterEach(() => {
      context.reset();
    });

    it('should provide an app context', () => {
      const wrapper = ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[]}>{children}</TestApiProvider>
      );
      context.set({ 1: 'context-value' });

      const renderedHook = renderHook(() => useApp(), { wrapper });
      expect(renderedHook.result.current).toBe('context-value');
    });
  });

  describe('new system', () => {
    const mockIcon = () => null;
    const mockIconsApi: IconsApi = {
      getIcon: jest.fn((key: string) =>
        key === 'test-icon' ? mockIcon : undefined,
      ),
      listIconKeys: jest.fn(() => ['test-icon']),
    };

    const mockPlugin = {
      id: 'test-plugin',
    };

    const mockAppNode: AppNode = {
      spec: {
        id: 'test-node',
        attachTo: { id: 'root', input: 'children' },
        extension: {} as any,
        disabled: false,
        plugin: mockPlugin as any,
      },
      edges: {
        attachments: new Map(),
      },
    };

    const mockAppTree: AppTree = {
      root: mockAppNode,
      nodes: new Map([['test-node', mockAppNode]]),
      orphans: [],
    };

    const mockAppTreeApi: AppTreeApi = {
      getTree: jest.fn(() => ({ tree: mockAppTree })),
      getNodesByRoutePath: jest.fn(() => ({ nodes: [] })),
    };

    it('should provide an app context from new app system', () => {
      const wrapper = ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider
          apis={[
            [appTreeApiRef, mockAppTreeApi],
            [iconsApiRef, mockIconsApi],
          ]}
        >
          {children}
        </TestApiProvider>
      );

      const renderedHook = renderHook(() => useApp(), { wrapper });

      const appContext = renderedHook.result.current;
      expect(appContext).toBeDefined();
      expect(appContext.getPlugins()).toHaveLength(1);
      expect(appContext.getPlugins()[0].getId()).toBe('test-plugin');
      expect(appContext.getSystemIcon('test-icon')).toBe(mockIcon);
      expect(appContext.getSystemIcons()).toEqual({ 'test-icon': mockIcon });
      expect(appContext.getComponents().Progress).toBeDefined();
      expect(appContext.getComponents().NotFoundErrorPage).toBeDefined();
    });

    it('should error on missing appTreeApi or iconsApi', () => {
      withLogCollector(['error'], () => {
        expect(() =>
          renderHook(() => useApp(), {
            wrapper: ({ children }: PropsWithChildren<{}>) => (
              <TestApiProvider apis={[]}>{children}</TestApiProvider>
            ),
          }),
        ).toThrow('App context is not available');

        expect(() =>
          renderHook(() => useApp(), {
            wrapper: ({ children }: PropsWithChildren<{}>) => (
              <TestApiProvider apis={[[appTreeApiRef, mockAppTreeApi]]}>
                {children}
              </TestApiProvider>
            ),
          }),
        ).toThrow('App context is not available');

        expect(() =>
          renderHook(() => useApp(), {
            wrapper: ({ children }: PropsWithChildren<{}>) => (
              <TestApiProvider apis={[[iconsApiRef, mockIconsApi]]}>
                {children}
              </TestApiProvider>
            ),
          }),
        ).toThrow('App context is not available');
      });
    });
  });
});
