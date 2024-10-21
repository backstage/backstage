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

import { get, set } from 'idb-keyval';
import { TemplateDirectoryAccess } from './types';
import { IterableDirectoryHandle } from './WebFileSystemAccess';

export class WebFileSystemStore {
  private static readonly key = 'scalfolder-template-editor-directory';

  static async getDirectory(): Promise<IterableDirectoryHandle | undefined> {
    const directory = await get(WebFileSystemStore.key);
    return directory.handle;
  }

  static async setDirectory(directory: TemplateDirectoryAccess | undefined) {
    return set(WebFileSystemStore.key, directory);
  }
}
