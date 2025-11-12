/*
 * Copyright 2025 The Backstage Authors
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
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBackstageStreamedDownload } from './useBackstageStreamedDownload';
import { downloadBlob } from './downloadBlob';

jest.mock('./downloadBlob');
const mockDownloadBlob = downloadBlob as jest.Mock;

const mockFetchApi = {
  fetch: jest.fn(),
};

jest.mock('@backstage/core-plugin-api', () => {
  const actual = jest.requireActual('@backstage/core-plugin-api');
  return {
    ...actual,
    useApi: jest.fn(ref => {
      if (ref === actual.fetchApiRef) {
        return mockFetchApi;
      }
      return actual.useApi(ref);
    }),
  };
});

describe('useBackstageStreamedDownload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully downloads a file', async () => {
    const mockBlob = new Blob(['test content'], { type: 'text/plain' });
    const mockResponse = {
      ok: true,
      blob: () => Promise.resolve(mockBlob),
      body: true,
    };
    mockFetchApi.fetch.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useBackstageStreamedDownload());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    act(() => {
      result.current.download({
        url: '/api/download',
        filename: 'file.txt',
      });
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockDownloadBlob).toHaveBeenCalledWith(mockResponse, 'file.txt');

    expect(mockFetchApi.fetch).toHaveBeenCalledWith('/api/download', {
      method: 'POST',
    });
    expect(result.current.error).toBeNull();
  });

  it('successfully downloads a file with search params', async () => {
    const mockBlob = new Blob(['test content'], { type: 'text/plain' });
    const mockResponse = {
      ok: true,
      blob: () => Promise.resolve(mockBlob),
      body: true,
    };
    mockFetchApi.fetch.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useBackstageStreamedDownload());

    act(() => {
      result.current.download({
        url: '/api/download',
        filename: 'file.txt',
        searchParams: new URLSearchParams({ month: 'january', year: '2023' }),
      });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockDownloadBlob).toHaveBeenCalledWith(mockResponse, 'file.txt');

    expect(mockFetchApi.fetch).toHaveBeenCalledWith(
      '/api/download?month=january&year=2023',
      {
        method: 'POST',
      },
    );
    expect(result.current.error).toBeNull();
  });

  it('throws error on failed response', async () => {
    mockFetchApi.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      body: null,
    });

    const { result } = renderHook(() => useBackstageStreamedDownload());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    act(() => {
      result.current.download({
        url: '/api/bad',
        filename: 'bad.txt',
      });
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toEqual(
      new Error('Download failed with status 500'),
    );
    expect(mockDownloadBlob).not.toHaveBeenCalled();
  });
});
