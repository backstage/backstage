/*
 * Copyright 2026 The Backstage Authors
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
import { PropsWithChildren } from 'react';
import {
  TemplateDirectoryAccess,
  TemplateFileAccess,
} from '../../../lib/filesystem';
import {
  DirectoryEditorProvider,
  useDirectoryEditor,
} from './DirectoryEditorContext';

function createMockFile(path: string, content = 'content'): File {
  const blob = new Blob([content]);
  return Object.assign(blob, {
    name: path.split('/').pop()!,
    lastModified: Date.now(),
    webkitRelativePath: path,
  });
}

class DeferredFileAccess implements TemplateFileAccess {
  readonly path: string;
  readonly save = jest.fn().mockResolvedValue(undefined);

  #resolveFile!: (file: File) => void;
  #filePromise: Promise<File>;

  constructor(path: string) {
    this.path = path;
    this.#filePromise = this.createPendingPromise();
  }

  file(): Promise<File> {
    return this.#filePromise;
  }

  complete(content?: string): void {
    this.#resolveFile(createMockFile(this.path, content));
  }

  reset(): void {
    this.#filePromise = this.createPendingPromise();
  }

  private createPendingPromise(): Promise<File> {
    return new Promise(resolve => {
      this.#resolveFile = resolve;
    });
  }
}

class DeferredDirectoryAccess implements TemplateDirectoryAccess {
  readonly deferredFiles: Map<string, DeferredFileAccess>;
  readonly listFiles = jest.fn(async () => [...this.deferredFiles.values()]);
  readonly createFile = jest.fn();

  constructor(paths: string[]) {
    this.deferredFiles = new Map(
      paths.map(path => [path, new DeferredFileAccess(path)]),
    );
  }
}

async function flushPromises(): Promise<void> {
  await act(async () => {
    await new Promise<void>(resolve => {
      setTimeout(resolve, 0);
    });
  });
}

describe('DirectoryEditorProvider', () => {
  describe('initial load', () => {
    it('exposes the manager with loading true before the initial reload completes', async () => {
      const paths = ['template.yaml', 'skeleton/README.md'];
      const directory = new DeferredDirectoryAccess(paths);

      const { result } = renderHook(() => useDirectoryEditor(), {
        wrapper: ({ children }: PropsWithChildren) => (
          <DirectoryEditorProvider directory={directory}>
            {children}
          </DirectoryEditorProvider>
        ),
      });

      expect(result.current).toBeDefined();

      await flushPromises();

      expect(result.current).toBeDefined();
      expect(result.current!.loading).toBe(true);
      expect(result.current!.totalFileCount).toBe(paths.length);
      expect(result.current!.files).toHaveLength(0);
    });
  });

  describe('reload', () => {
    it('reports per-file progress and chunk-level file tree updates', async () => {
      const paths = Array.from({ length: 10 }, (_, index) => {
        return `file-${String(index + 1).padStart(2, '0')}.txt`;
      });
      const directory = new DeferredDirectoryAccess(paths);

      const { result } = renderHook(() => useDirectoryEditor(), {
        wrapper: ({ children }: PropsWithChildren) => (
          <DirectoryEditorProvider directory={directory}>
            {children}
          </DirectoryEditorProvider>
        ),
      });

      for (const path of paths) {
        await act(async () => {
          directory.deferredFiles.get(path)!.complete();
          await new Promise<void>(resolve => {
            setTimeout(resolve, 0);
          });
        });
      }

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current!.files).toHaveLength(10);
      });

      for (const deferredFile of directory.deferredFiles.values()) {
        deferredFile.reset();
      }

      const snapshots: Array<{ loaded: number; files: number }> = [];
      const editor = result.current!;
      const unsubscribe = editor.subscribe(() => {
        snapshots.push({
          loaded: editor.loadedFileCount,
          files: editor.files.length,
        });
      });

      let reloadPromise!: Promise<void>;
      await act(async () => {
        reloadPromise = editor.reload();
        await new Promise<void>(resolve => {
          setTimeout(resolve, 0);
        });
      });

      expect(directory.listFiles).toHaveBeenCalledTimes(2);
      expect(editor.totalFileCount).toBe(10);
      expect(editor.files).toHaveLength(0);

      const resolutionOrder: string[] = [];
      const loadedAfterEachResolve: number[] = [];

      const chunkOneOrder = [
        'file-03.txt',
        'file-01.txt',
        'file-04.txt',
        'file-06.txt',
        'file-02.txt',
        'file-05.txt',
      ];
      for (const path of chunkOneOrder) {
        await act(async () => {
          directory.deferredFiles.get(path)!.complete();
          await new Promise<void>(resolve => {
            setTimeout(resolve, 0);
          });
        });
        resolutionOrder.push(path);
        loadedAfterEachResolve.push(editor.loadedFileCount);
      }

      expect(editor.loadedFileCount).toBe(6);
      expect(editor.files).toHaveLength(6);

      const chunkTwoOrder = [
        'file-10.txt',
        'file-08.txt',
        'file-07.txt',
        'file-09.txt',
      ];
      for (const path of chunkTwoOrder) {
        await act(async () => {
          directory.deferredFiles.get(path)!.complete();
          await new Promise<void>(resolve => {
            setTimeout(resolve, 0);
          });
        });
        resolutionOrder.push(path);
        loadedAfterEachResolve.push(editor.loadedFileCount);
      }

      await act(async () => {
        await reloadPromise;
      });
      unsubscribe();

      expect(editor.loading).toBe(false);
      expect(editor.loadedFileCount).toBe(10);
      expect(editor.files).toHaveLength(10);
      expect(editor.files.map(file => file.path)).toEqual(paths);

      expect(loadedAfterEachResolve).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(resolutionOrder).toEqual([...chunkOneOrder, ...chunkTwoOrder]);

      const loadedValues = snapshots.map(snapshot => snapshot.loaded);
      const maxLoadedJump = loadedValues.reduce((maxJump, loaded, index) => {
        if (index === 0) {
          return maxJump;
        }
        return Math.max(maxJump, loaded - loadedValues[index - 1]!);
      }, 0);
      expect(maxLoadedJump).toBeLessThanOrEqual(1);

      const fileCountIncreases = snapshots
        .map((snapshot, index) => {
          if (index === 0) {
            return 0;
          }
          return snapshot.files - snapshots[index - 1]!.files;
        })
        .filter(increase => increase > 0);

      expect(fileCountIncreases).toEqual([6, 4]);

      const loadedAheadOfTree = snapshots.filter(
        snapshot => snapshot.loaded > snapshot.files,
      );
      expect(loadedAheadOfTree.length).toBeGreaterThan(0);
      expect(loadedAheadOfTree.every(snapshot => snapshot.loaded <= 10)).toBe(
        true,
      );
    });
  });
});
