/*
 * Copyright 2021 Spotify AB
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

import { ApiProvider, ApiRegistry } from '@backstage/core';
import { NotFoundError } from '@backstage/errors';
import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { techdocsStorageApiRef } from '../../api';
import {
  calculateDisplayState,
  reducer,
  useReaderState,
} from './useReaderState';

describe('useReaderState', () => {
  let Wrapper: React.ComponentType;

  const techdocsStorageApi: jest.Mocked<typeof techdocsStorageApiRef.T> = {
    getApiOrigin: jest.fn(),
    getBaseUrl: jest.fn(),
    getBuilder: jest.fn(),
    getEntityDocs: jest.fn(),
    getStorageUrl: jest.fn(),
    syncEntityDocs: jest.fn(),
  };

  beforeEach(() => {
    const apis = ApiRegistry.with(techdocsStorageApiRef, techdocsStorageApi);

    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <ApiProvider apis={apis}>{children}</ApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  describe('calculateDisplayState', () => {
    it.each`
      contentLoading | content      | activeSyncState      | expected
      ${true}        | ${''}        | ${''}                | ${'CHECKING'}
      ${false}       | ${undefined} | ${'CHECKING'}        | ${'CHECKING'}
      ${false}       | ${undefined} | ${'BUILDING'}        | ${'INITIAL_BUILD'}
      ${false}       | ${undefined} | ${'BUILD_READY'}     | ${'CONTENT_NOT_FOUND'}
      ${false}       | ${undefined} | ${'BUILD_TIMED_OUT'} | ${'CONTENT_NOT_FOUND'}
      ${false}       | ${undefined} | ${'UP_TO_DATE'}      | ${'CONTENT_NOT_FOUND'}
      ${false}       | ${undefined} | ${'ERROR'}           | ${'CONTENT_NOT_FOUND'}
      ${false}       | ${'asdf'}    | ${'CHECKING'}        | ${'CONTENT_FRESH'}
      ${false}       | ${'asdf'}    | ${'BUILDING'}        | ${'CONTENT_STALE_REFRESHING'}
      ${false}       | ${'asdf'}    | ${'BUILD_READY'}     | ${'CONTENT_STALE_READY'}
      ${false}       | ${'asdf'}    | ${'BUILD_TIMED_OUT'} | ${'CONTENT_STALE_TIMEOUT'}
      ${false}       | ${'asdf'}    | ${'UP_TO_DATE'}      | ${'CONTENT_FRESH'}
      ${false}       | ${'asdf'}    | ${'ERROR'}           | ${'CONTENT_STALE_ERROR'}
    `(
      'should, when contentLoading=$contentLoading and content="$content" and activeSyncState=$activeSyncState, resolve to $expected',
      ({ contentLoading, content, activeSyncState, expected }) => {
        expect(
          calculateDisplayState({
            contentLoading,
            content,
            activeSyncState,
          }),
        ).toEqual(expected);
      },
    );
  });

  describe('reducer', () => {
    const contentReloadFn = jest.fn();
    const oldState: Parameters<typeof reducer>[0] = {
      activeSyncState: 'CHECKING',
      contentIsStale: false,
      contentLoading: false,
      path: '',
      contentReload: contentReloadFn,
    };

    it('should return a copy of the state', () => {
      expect(reducer(oldState, { type: 'navigate', path: '/' })).toEqual({
        activeSyncState: 'CHECKING',
        contentIsStale: false,
        contentLoading: false,
        path: '/',
        contentReload: contentReloadFn,
      });

      expect(oldState).toEqual({
        activeSyncState: 'CHECKING',
        contentIsStale: false,
        contentLoading: false,
        path: '',
        contentReload: contentReloadFn,
      });
    });

    describe('"content" action', () => {
      it('should work', () => {
        expect(
          reducer(
            {
              ...oldState,
              content: undefined,
              contentLoading: true,
              contentReload: undefined,
            },
            {
              type: 'content',
              content: 'asdf',
              contentLoading: false,
              contentReload: contentReloadFn,
            },
          ),
        ).toEqual({
          ...oldState,
          contentLoading: false,
          content: 'asdf',
        });

        expect(contentReloadFn).toBeCalledTimes(0);
      });

      it('should reset staleness', () => {
        expect(
          reducer(
            {
              ...oldState,
              contentIsStale: true,
              activeSyncState: 'BUILD_READY',
            },
            {
              type: 'content',
              content: 'asdf',
              contentLoading: false,
              contentReload: contentReloadFn,
            },
          ),
        ).toEqual({
          ...oldState,
          content: 'asdf',
          contentIsStale: false,
          activeSyncState: 'UP_TO_DATE',
        });
      });
    });

    describe('"navigate" action', () => {
      it('should work', () => {
        expect(
          reducer(oldState, {
            type: 'navigate',
            path: '/',
          }),
        ).toEqual({
          ...oldState,
          path: '/',
        });

        expect(contentReloadFn).toBeCalledTimes(0);
      });

      it('should reset staleness', () => {
        expect(
          reducer(
            {
              ...oldState,
              contentIsStale: true,
              activeSyncState: 'BUILD_READY',
            },
            {
              type: 'navigate',
              path: '',
            },
          ),
        ).toEqual({
          ...oldState,
          contentIsStale: false,
          activeSyncState: 'UP_TO_DATE',
        });
      });
    });

    describe('"sync" action', () => {
      it('should update state', () => {
        expect(
          reducer(oldState, {
            type: 'sync',
            state: 'BUILDING',
          }),
        ).toEqual({
          ...oldState,
          activeSyncState: 'BUILDING',
        });

        expect(contentReloadFn).toBeCalledTimes(0);
      });

      it('should set content to be stale but not reload', () => {
        expect(
          reducer(
            {
              ...oldState,
              contentReload: undefined,
            },
            {
              type: 'sync',
              state: 'BUILD_READY',
            },
          ),
        ).toEqual({
          ...oldState,
          activeSyncState: 'BUILD_READY',
          contentIsStale: true,
          contentReload: undefined,
        });

        expect(contentReloadFn).toBeCalledTimes(0);
      });

      it('should not reload existing content', () => {
        expect(
          reducer(
            {
              ...oldState,
              content: 'any content',
            },
            {
              type: 'sync',
              state: 'BUILD_READY',
            },
          ),
        ).toEqual({
          ...oldState,
          activeSyncState: 'BUILD_READY',
          contentIsStale: true,
          content: 'any content',
        });

        expect(contentReloadFn).toBeCalledTimes(0);
      });

      it('should trigger a reload', () => {
        expect(
          reducer(oldState, {
            type: 'sync',
            state: 'BUILD_READY',
          }),
        ).toEqual({
          ...oldState,
          activeSyncState: 'BUILD_READY',
          contentIsStale: true,
          contentLoading: true,
        });

        expect(contentReloadFn).toBeCalledTimes(1);
      });

      it('should NOT reset staleness', () => {
        expect(
          reducer(
            {
              ...oldState,
              contentIsStale: true,
              activeSyncState: 'BUILD_READY',
            },
            {
              type: 'sync',
              state: 'BUILDING',
            },
          ),
        ).toEqual({
          ...oldState,
          contentIsStale: true,
          activeSyncState: 'BUILDING',
        });
      });
    });
  });

  describe('hook', () => {
    it('should handle up-to-date content', async () => {
      techdocsStorageApi.getEntityDocs.mockResolvedValue('my content');
      techdocsStorageApi.syncEntityDocs.mockImplementation(async () => {
        return 'cached';
      });

      await act(async () => {
        const { result, waitForValueToChange } = await renderHook(
          () => useReaderState('Component', 'default', 'backstage', '/example'),
          { wrapper: Wrapper },
        );

        expect(result.current).toEqual({
          state: 'CHECKING',
          content: undefined,
          errorMessage: '',
        });

        await waitForValueToChange(() => result.current.state);

        expect(result.current).toEqual({
          state: 'CONTENT_FRESH',
          content: 'my content',
          errorMessage: '',
        });

        expect(techdocsStorageApi.getEntityDocs).toBeCalledWith(
          { kind: 'Component', namespace: 'default', name: 'backstage' },
          '/example',
        );
        expect(techdocsStorageApi.syncEntityDocs).toBeCalledWith({
          kind: 'Component',
          namespace: 'default',
          name: 'backstage',
        });
      });
    });

    it('should handle stale content', async () => {
      techdocsStorageApi.getEntityDocs.mockResolvedValue('my content');
      techdocsStorageApi.syncEntityDocs.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 1100));
        return 'updated';
      });

      await act(async () => {
        const { result, waitForValueToChange } = await renderHook(
          () => useReaderState('Component', 'default', 'backstage', '/example'),
          { wrapper: Wrapper },
        );

        expect(result.current).toEqual({
          state: 'CHECKING',
          content: undefined,
          errorMessage: '',
        });

        // the content is returned but the sync is in progress
        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_FRESH',
          content: 'my content',
          errorMessage: '',
        });

        // the sync takes longer than 1 seconds so the refreshing state starts
        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_STALE_REFRESHING',
          content: 'my content',
          errorMessage: '',
        });

        // the content is up-to-date
        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_STALE_READY',
          content: 'my content',
          errorMessage: '',
        });

        expect(techdocsStorageApi.getEntityDocs).toBeCalledWith(
          { kind: 'Component', namespace: 'default', name: 'backstage' },
          '/example',
        );
        expect(techdocsStorageApi.syncEntityDocs).toBeCalledWith({
          kind: 'Component',
          namespace: 'default',
          name: 'backstage',
        });
      });
    });

    it('should handle timed-out refresh', async () => {
      techdocsStorageApi.getEntityDocs.mockResolvedValue('my content');
      techdocsStorageApi.syncEntityDocs.mockResolvedValue('timeout');

      await act(async () => {
        const { result, waitForValueToChange } = await renderHook(
          () => useReaderState('Component', 'default', 'backstage', '/example'),
          { wrapper: Wrapper },
        );

        expect(result.current).toEqual({
          state: 'CHECKING',
          content: undefined,
          errorMessage: '',
        });

        // the content is returned but the sync is in progress
        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_STALE_TIMEOUT',
          content: 'my content',
          errorMessage: '',
        });

        expect(techdocsStorageApi.getEntityDocs).toBeCalledWith(
          { kind: 'Component', namespace: 'default', name: 'backstage' },
          '/example',
        );
        expect(techdocsStorageApi.syncEntityDocs).toBeCalledWith({
          kind: 'Component',
          namespace: 'default',
          name: 'backstage',
        });
      });
    });

    it('should handle content error', async () => {
      techdocsStorageApi.getEntityDocs.mockRejectedValue(
        new NotFoundError('Some error description'),
      );
      techdocsStorageApi.syncEntityDocs.mockResolvedValue('cached');

      await act(async () => {
        const { result, waitForValueToChange } = await renderHook(
          () => useReaderState('Component', 'default', 'backstage', '/example'),
          { wrapper: Wrapper },
        );

        expect(result.current).toEqual({
          state: 'CHECKING',
          content: undefined,
          errorMessage: '',
        });

        // the content loading threw an error
        await waitForValueToChange(() => result.current.state);
        expect(result.current).toEqual({
          state: 'CONTENT_NOT_FOUND',
          content: undefined,
          errorMessage: ' Load error: NotFoundError: Some error description',
        });

        expect(techdocsStorageApi.getEntityDocs).toBeCalledWith(
          { kind: 'Component', namespace: 'default', name: 'backstage' },
          '/example',
        );
        expect(techdocsStorageApi.syncEntityDocs).toBeCalledWith({
          kind: 'Component',
          namespace: 'default',
          name: 'backstage',
        });
      });
    });
  });
});
