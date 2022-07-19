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

import { TemplateDirectoryAccess, TemplateFileAccess } from './types';

class MockFileAccess implements TemplateFileAccess {
  constructor(readonly path: string, private content: string) {}

  async file(): Promise<File> {
    const blob = new Blob([this.content]);
    return Object.assign(blob, {
      name: this.path.split('/').pop()!,
      lastModified: Date.now(),
      webkitRelativePath: this.path,
    });
  }

  async save(data: string | Blob | BufferSource): Promise<void> {
    this.content = await new Response(data).text();
  }
}

class MockDirectoryAccess implements TemplateDirectoryAccess {
  private readonly files = new Array<TemplateFileAccess>();

  constructor(inputFiles: Record<string, string>) {
    this.files = Object.entries(inputFiles).map(
      ([path, content]) => new MockFileAccess(path, content),
    );
  }

  async listFiles(): Promise<TemplateFileAccess[]> {
    return this.files;
  }
}

/** @internal */
export class MockFileSystemAccess {
  private constructor() {}

  static createMockDirectory(files: Record<string, string>) {
    return new MockDirectoryAccess(files);
  }
}
