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

type WritableFileHandle = FileSystemFileHandle & {
  createWritable(): Promise<{
    write(data: string | Blob | BufferSource): Promise<void>;
    close(): Promise<void>;
  }>;
};

// A nicer type than the one from the TS lib
interface IterableDirectoryHandle extends FileSystemDirectoryHandle {
  values(): AsyncIterable<
    | ({ kind: 'file' } & WritableFileHandle)
    | ({ kind: 'directory' } & IterableDirectoryHandle)
  >;
}

const showDirectoryPicker = (window as any).showDirectoryPicker as
  | (() => Promise<IterableDirectoryHandle>)
  | undefined;

const picker = (window as any).showDirectoryPicker;
// https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker

class WebFileAccess implements TemplateFileAccess {
  constructor(
    readonly path: string,
    private readonly handle: WritableFileHandle,
  ) {}

  file(): Promise<File> {
    return this.handle.getFile();
  }

  async save(data: string | Blob | BufferSource): Promise<void> {
    const writable = await this.handle.createWritable();
    await writable.write(data);
    await writable.close();
  }
}

class WebDirectoryAccess implements TemplateDirectoryAccess {
  constructor(private readonly handle: IterableDirectoryHandle) {}

  async createFile(options: { filename: string; data: string }): Promise<void> {
    const { filename, data } = options;
    const fileHandle = await this.handle.getFileHandle(filename, {
      create: true,
    });

    const writable = await fileHandle.createWritable();
    await writable.write(data);

    await writable.close();

    // const draftHandle = await root.getFileHandle("draft.txt", { create: true });
    // // Get sync access handle
    // const accessHandle = await draftHandle.createSyncAccessHandle();

    // // Get size of the file.
    // const fileSize = accessHandle.getSize();
    // // Read file content to a buffer.
    // const buffer = new DataView(new ArrayBuffer(fileSize));
    // const readBuffer = accessHandle.read(buffer, { at: 0 });

    // // Write the message to the end of the file.
    // const encoder = new TextEncoder();
    // const encodedMessage = encoder.encode(message);
    // const writeBuffer = accessHandle.write(encodedMessage, { at: readBuffer });

    // // Persist changes to disk.
    // accessHandle.flush();

    // // Always close FileSystemSyncAccessHandle if done.
    // accessHandle.close();
  }

  async listFiles(): Promise<TemplateFileAccess[]> {
    const content = [];
    for await (const entry of this.listDirectoryContents(this.handle)) {
      content.push(entry);
    }
    return content;
  }

  private async *listDirectoryContents(
    dirHandle: IterableDirectoryHandle,
    basePath: string[] = [],
  ): AsyncIterable<TemplateFileAccess> {
    for await (const handle of dirHandle.values()) {
      if (handle.kind === 'file') {
        yield new WebFileAccess([...basePath, handle.name].join('/'), handle);
      } else if (handle.kind === 'directory') {
        // Skip git storage directory
        if (handle.name === '.git') {
          continue;
        }
        yield* this.listDirectoryContents(handle, [...basePath, handle.name]);
      }
    }
  }
}

/** @internal */
export class WebFileSystemAccess {
  static isSupported(): boolean {
    return Boolean(showDirectoryPicker);
  }

  static async requestDirectoryAccess(): Promise<TemplateDirectoryAccess> {
    if (!showDirectoryPicker) {
      throw new Error('File system access is not supported');
    }
    const handle = await showDirectoryPicker();
    return new WebDirectoryAccess(handle);
  }

  private constructor() {}
}
