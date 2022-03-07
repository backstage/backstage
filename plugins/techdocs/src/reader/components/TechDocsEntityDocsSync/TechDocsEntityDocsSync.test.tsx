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
import { renderHook } from '@testing-library/react-hooks';

import { TestApiProvider } from '@backstage/test-utils';

import { techdocsStorageApiRef } from '../../../api';
import { EntityDocsProvider } from '../TechDocsEntityDocs';
import {
  reducer,
  EntityDocsSync,
  EntityDocsSyncTypes,
  EntityDocsSyncStatus,
  useEntityDocsSync,
  EntityDocsSyncProvider,
} from './TechDocsEntityDocsSync';

const getEntityDocs = jest.fn();
const syncEntityDocs = jest.fn();

const entityRef = {
  kind: 'Component',
  namespace: 'default',
  name: 'backstage',
};

const wrapper: FC = ({ children }) => (
  <TestApiProvider
    apis={[[techdocsStorageApiRef, { getEntityDocs, syncEntityDocs }]]}
  >
    <EntityDocsProvider entityRef={entityRef}>
      <EntityDocsSyncProvider entityRef={entityRef}>
        {children}
      </EntityDocsSyncProvider>
    </EntityDocsProvider>
  </TestApiProvider>
);

describe('reducer', () => {
  const initialState: EntityDocsSync = {
    status: EntityDocsSyncStatus.CHECKING,
    log: [],
  };

  it('should return a copy of the state', () => {
    const newState = reducer(initialState, {
      type: EntityDocsSyncTypes.LOG,
    });

    expect(newState).toEqual({
      status: EntityDocsSyncStatus.BUILDING,
      log: [],
    });

    expect(initialState).toEqual({
      status: EntityDocsSyncStatus.CHECKING,
      log: [],
    });
  });

  describe('"LOG" action', () => {
    it('Should set build status', () => {
      expect(
        reducer(initialState, {
          type: EntityDocsSyncTypes.LOG,
          line: 'line',
        }),
      ).toEqual({
        ...initialState,
        status: EntityDocsSyncStatus.BUILDING,
        log: ['line'],
      });
    });

    it('Should keep previous status', () => {
      expect(
        reducer(
          { status: EntityDocsSyncStatus.BUILD_READY, log: ['line1'] },
          { type: EntityDocsSyncTypes.LOG, line: 'line2' },
        ),
      ).toEqual({
        ...initialState,
        status: EntityDocsSyncStatus.BUILD_READY,
        log: ['line1', 'line2'],
      });
    });
  });

  describe('"FINISH" action', () => {
    it('should set up to date status', () => {
      expect(
        reducer(initialState, {
          type: EntityDocsSyncTypes.FINISH,
          result: 'cached',
        }),
      ).toEqual({
        ...initialState,
        status: EntityDocsSyncStatus.UP_TO_DATE,
      });
    });

    it('should set build ready status', () => {
      expect(
        reducer(initialState, {
          type: EntityDocsSyncTypes.FINISH,
          result: 'updated',
        }),
      ).toEqual({
        ...initialState,
        status: EntityDocsSyncStatus.BUILD_READY,
      });
    });
  });

  describe('"ERROR" action', () => {
    it('should set error status', () => {
      expect(
        reducer(initialState, {
          type: EntityDocsSyncTypes.ERROR,
          error: new Error('Error'),
        }),
      ).toEqual({
        ...initialState,
        status: EntityDocsSyncStatus.ERROR,
        error: new Error('Error'),
      });
    });
  });
});

describe('hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle invalid result', async () => {
    getEntityDocs.mockResolvedValue('<html/>');
    syncEntityDocs.mockResolvedValue('invalid');

    const { result, waitForValueToChange } = renderHook(
      () => useEntityDocsSync(),
      { wrapper },
    );

    await waitForValueToChange(() => result.current.status);

    expect(result.current).toEqual({
      status: EntityDocsSyncStatus.ERROR,
      error: new Error('Unexpected return state'),
      log: [],
    });
  });

  it('should handle fresh content', async () => {
    getEntityDocs.mockResolvedValue('<html/>');
    syncEntityDocs.mockResolvedValue('cached');

    const { result, waitForValueToChange } = renderHook(
      () => useEntityDocsSync(),
      { wrapper },
    );

    expect(result.current).toEqual({
      status: EntityDocsSyncStatus.CHECKING,
      log: [],
    });

    await waitForValueToChange(() => result.current.status);

    expect(result.current).toEqual({
      status: EntityDocsSyncStatus.UP_TO_DATE,
      log: [],
    });

    expect(getEntityDocs).toBeCalledTimes(1);
    expect(getEntityDocs).toBeCalledWith(entityRef, '');

    expect(getEntityDocs).toBeCalledWith(entityRef, '');
    expect(syncEntityDocs).toBeCalledWith(entityRef, expect.any(Function));
  });

  it('should handle stale content', async () => {
    getEntityDocs
      .mockResolvedValue('<h1>Content 2</h1>')
      .mockResolvedValueOnce('<h1>Content 1</h1>');
    syncEntityDocs.mockImplementation(async (_, logHandler) => {
      logHandler?.call(this, 'Line 1');
      logHandler?.call(this, 'Line 2');
      await new Promise(resolve => setTimeout(resolve, 100));
      return 'updated';
    });

    const { result, waitForValueToChange } = renderHook(
      () => useEntityDocsSync(),
      { wrapper },
    );

    expect(result.current).toEqual({
      status: EntityDocsSyncStatus.CHECKING,
      log: [],
    });

    await waitForValueToChange(() => result.current.status);

    expect(result.current).toEqual({
      status: EntityDocsSyncStatus.BUILDING,
      log: ['Line 1', 'Line 2'],
    });

    await waitForValueToChange(() => result.current.status);

    expect(result.current).toEqual({
      status: EntityDocsSyncStatus.BUILD_READY,
      log: [],
    });

    expect(getEntityDocs).toBeCalledTimes(1);
    expect(getEntityDocs).toBeCalledWith(entityRef, '');

    expect(getEntityDocs).toBeCalledWith(entityRef, '');
    expect(syncEntityDocs).toBeCalledWith(entityRef, expect.any(Function));
  });

  it('should reload initially missing content', async () => {
    getEntityDocs.mockResolvedValue('<html/>').mockResolvedValueOnce(undefined);
    syncEntityDocs.mockImplementation(async (_, logHandler) => {
      logHandler?.call(this, 'Line 1');
      logHandler?.call(this, 'Line 2');
      await new Promise(resolve => setTimeout(resolve, 100));
      return 'updated';
    });

    const { result, waitForValueToChange } = renderHook(
      () => useEntityDocsSync(),
      { wrapper },
    );

    expect(result.current).toEqual({
      status: EntityDocsSyncStatus.CHECKING,
      log: [],
    });

    await waitForValueToChange(() => result.current.status);

    expect(result.current).toEqual({
      status: EntityDocsSyncStatus.BUILDING,
      log: ['Line 1', 'Line 2'],
    });

    await waitForValueToChange(() => result.current.status);

    expect(result.current).toEqual({
      status: EntityDocsSyncStatus.UP_TO_DATE,
      error: undefined,
      log: [],
    });

    expect(getEntityDocs).toBeCalledTimes(2);
    expect(getEntityDocs).toBeCalledWith(entityRef, '');

    expect(syncEntityDocs).toBeCalledTimes(1);
    expect(syncEntityDocs).toBeCalledWith(entityRef, expect.any(Function));
  });
});
