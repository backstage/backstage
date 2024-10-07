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

import { useCallback } from 'react';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';

import {
  WebFileSystemStore,
  WebFileSystemAccess,
  WebDirectoryAccess,
  createExampleTemplate,
} from '../../../lib/filesystem';

export function useTemplateDirectory(): {
  directory?: WebDirectoryAccess;
  loading: boolean;
  error?: Error;
  openDirectory: () => Promise<void>;
  createDirectory: () => Promise<void>;
  closeDirectory: () => Promise<void>;
} {
  const { value, loading, error, retry } = useAsyncRetry(async () => {
    const directory = await WebFileSystemStore.getDirectory();
    if (!directory) return undefined;
    return WebFileSystemAccess.fromHandle(directory);
  }, []);

  const openDirectory = useCallback(() => {
    return WebFileSystemAccess.requestDirectoryAccess()
      .then(WebFileSystemStore.setDirectory)
      .then(retry);
  }, [retry]);

  const createDirectory = useCallback(() => {
    return WebFileSystemAccess.requestDirectoryAccess()
      .then(createExampleTemplate)
      .then(WebFileSystemStore.setDirectory)
      .then(retry);
  }, [retry]);

  const closeDirectory = useCallback(() => {
    return WebFileSystemStore.setDirectory(undefined).then(retry);
  }, [retry]);

  return {
    directory: value,
    loading,
    error,
    openDirectory,
    createDirectory,
    closeDirectory,
  };
}
