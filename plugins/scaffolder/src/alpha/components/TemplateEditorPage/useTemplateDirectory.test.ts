/*
 * Copyright 2024 The Backstage Authors
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

import { act, renderHook, waitFor } from '@testing-library/react';
import { useTemplateDirectory } from './useTemplateDirectory';
import {
  createExampleTemplate,
  TemplateDirectoryAccess,
  WebFileSystemStore,
} from '../../../lib/filesystem';
import {
  IterableDirectoryHandle,
  WebFileSystemAccess,
} from '../../../lib/filesystem/WebFileSystemAccess';

jest.mock('../../../lib/filesystem/createExampleTemplate');

describe('useTemplateDirectory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined when there is no existing directory in the file system store', async () => {
    jest.spyOn(WebFileSystemStore, 'getDirectory').mockResolvedValue(undefined);

    const { result } = renderHook(() => useTemplateDirectory());

    expect(result.current.directory).toBeUndefined();
    expect(result.current.loading).toBeTruthy();
    expect(result.current.error).toBeUndefined();

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    expect(result.current.directory).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it('should return an access when there is  existing directory in the file system store', async () => {
    const handle = {} as IterableDirectoryHandle;

    jest.spyOn(WebFileSystemStore, 'getDirectory').mockResolvedValue(handle);

    const { result } = renderHook(() => useTemplateDirectory());

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    expect(result.current.directory).toMatchObject({ handle });
    expect(result.current.error).toBeUndefined();
  });

  it('should handle opening a directory', async () => {
    const handle = {};
    jest
      .spyOn(WebFileSystemStore, 'getDirectory')
      .mockResolvedValue(handle as IterableDirectoryHandle);
    const setDirectory = jest
      .spyOn(WebFileSystemStore, 'setDirectory')
      .mockResolvedValue(undefined);
    const requestDirectoryAccess = jest
      .spyOn(WebFileSystemAccess, 'requestDirectoryAccess')
      .mockResolvedValue(handle as TemplateDirectoryAccess);

    const { result } = renderHook(() => useTemplateDirectory());

    expect(result.current.directory).toBeUndefined();

    await act(async () => {
      result.current.openDirectory();
    });

    expect(requestDirectoryAccess).toHaveBeenCalled();
    expect(setDirectory).toHaveBeenCalledWith(handle);

    await waitFor(() => expect(result.current.directory).toBeDefined());
  });

  it('should handle creating a directory', async () => {
    const handle = {};
    (createExampleTemplate as jest.Mock).mockResolvedValue(handle);
    jest
      .spyOn(WebFileSystemStore, 'getDirectory')
      .mockResolvedValue(handle as IterableDirectoryHandle);
    const setDirectory = jest
      .spyOn(WebFileSystemStore, 'setDirectory')
      .mockResolvedValue(undefined);
    const requestDirectoryAccess = jest
      .spyOn(WebFileSystemAccess, 'requestDirectoryAccess')
      .mockResolvedValue(handle as TemplateDirectoryAccess);

    const { result } = renderHook(() => useTemplateDirectory());

    await act(async () => {
      result.current.createDirectory();
    });

    expect(requestDirectoryAccess).toHaveBeenCalled();
    expect(setDirectory).toHaveBeenCalledWith(handle);
    expect(createExampleTemplate).toHaveBeenCalledWith(handle);
  });

  it('should handle closing a directory', async () => {
    jest.spyOn(WebFileSystemStore, 'getDirectory').mockResolvedValue(undefined);

    const setDirectory = jest
      .spyOn(WebFileSystemStore, 'setDirectory')
      .mockResolvedValue(undefined);

    const { result } = renderHook(() => useTemplateDirectory());

    expect(setDirectory).not.toHaveBeenCalled();
    expect(result.current.directory).toBeUndefined();

    await act(async () => {
      result.current.closeDirectory();
    });

    expect(setDirectory).toHaveBeenCalledWith(undefined);
    await waitFor(() => expect(result.current.directory).toBeUndefined());
  });
});
