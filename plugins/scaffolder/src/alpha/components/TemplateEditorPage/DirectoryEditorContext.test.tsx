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
import { PropsWithChildren, StrictMode } from 'react';
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
  readonly file: jest.Mock<Promise<File>, []>;

  #resolveFile!: (file: File) => void;
  #rejectFile!: (error: Error) => void;
  #filePromise: Promise<File>;

  constructor(
    path: string,
    onFileStart?: (path: string) => void,
    onFileSettle?: (path: string) => void,
  ) {
    this.path = path;
    this.#filePromise = this.createPendingPromise();
    this.file = jest.fn(() => {
      onFileStart?.(this.path);
      return this.#filePromise.finally(() => {
        onFileSettle?.(this.path);
      });
    });
  }

  complete(content?: string): void {
    this.#resolveFile(createMockFile(this.path, content));
  }

  reject(error: Error): void {
    this.#rejectFile(error);
  }

  reset(): void {
    this.#filePromise = this.createPendingPromise();
  }

  private createPendingPromise(): Promise<File> {
    return new Promise((resolve, reject) => {
      this.#resolveFile = resolve;
      this.#rejectFile = reject;
    });
  }
}

class DeferredDirectoryAccess implements TemplateDirectoryAccess {
  readonly deferredFiles: Map<string, DeferredFileAccess>;
  readonly listFiles = jest.fn(async () => [...this.deferredFiles.values()]);
  readonly createFile = jest.fn();

  activeReads = 0;
  maxActiveReads = 0;
  fileStartOrder: string[] = [];

  constructor(paths: string[]) {
    this.deferredFiles = new Map(
      paths.map(path => [
        path,
        new DeferredFileAccess(
          path,
          filePath => {
            this.activeReads++;
            this.maxActiveReads = Math.max(
              this.maxActiveReads,
              this.activeReads,
            );
            this.fileStartOrder.push(filePath);
          },
          () => {
            this.activeReads--;
          },
        ),
      ]),
    );
  }

  resetTracking(): void {
    this.activeReads = 0;
    this.maxActiveReads = 0;
    this.fileStartOrder = [];
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

    it('selects the initial YAML file under React StrictMode', async () => {
      const paths = ['template.yaml', 'skeleton/README.md'];
      const directory = new DeferredDirectoryAccess(paths);

      const { result } = renderHook(() => useDirectoryEditor(), {
        wrapper: ({ children }: PropsWithChildren) => (
          <StrictMode>
            <DirectoryEditorProvider directory={directory}>
              {children}
            </DirectoryEditorProvider>
          </StrictMode>
        ),
      });

      for (const path of paths) {
        await act(async () => {
          directory.deferredFiles.get(path)!.complete();
          await new Promise<void>(resolve => setTimeout(resolve, 0));
        });
      }

      await waitFor(() => {
        expect(result.current?.selectedFile).toBeDefined();
        expect(result.current?.selectedFile?.path).toBe('template.yaml');
      });
    });

    it('suppresses error and completion when unmounted while reload is pending', async () => {
      const paths = ['template.yaml'];
      const directory = new DeferredDirectoryAccess(paths);

      const { result, unmount } = renderHook(() => useDirectoryEditor(), {
        wrapper: ({ children }: PropsWithChildren) => (
          <DirectoryEditorProvider directory={directory}>
            {children}
          </DirectoryEditorProvider>
        ),
      });

      const editor = result.current!;
      expect(editor).toBeDefined();

      unmount();

      // Completing or rejecting after unmount must not throw or update selected file
      await act(async () => {
        directory.deferredFiles
          .get('template.yaml')!
          .reject(new Error('Unmount test error'));
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      });

      expect(editor.selectedFile).toBeUndefined();
    });

    it('reuses in-flight reload promise for concurrent reload calls', async () => {
      const paths = ['template.yaml'];
      const directory = new DeferredDirectoryAccess(paths);

      const { result } = renderHook(() => useDirectoryEditor(), {
        wrapper: ({ children }: PropsWithChildren) => (
          <DirectoryEditorProvider directory={directory}>
            {children}
          </DirectoryEditorProvider>
        ),
      });

      const editor = result.current!;
      let p1!: Promise<void>;
      let p2!: Promise<void>;
      act(() => {
        p1 = editor.reload();
        p2 = editor.reload();
      });
      expect(p1).toBe(p2);

      await act(async () => {
        directory.deferredFiles.get('template.yaml')!.complete();
        await Promise.all([p1, p2]);
      });

      expect(directory.listFiles).toHaveBeenCalledTimes(1);
    });
  });

  describe('reload', () => {
    it('reports per-file progress and retains file tree until reload completes', async () => {
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
        deferredFile.file.mockClear();
      }
      directory.resetTracking();

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
      expect(editor.files).toHaveLength(10);

      // Assert that files 1..6 have started reading, and files 7..10 have NOT
      for (let i = 1; i <= 6; i++) {
        const path = `file-${String(i).padStart(2, '0')}.txt`;
        expect(directory.deferredFiles.get(path)!.file).toHaveBeenCalledTimes(
          1,
        );
      }
      for (let i = 7; i <= 10; i++) {
        const path = `file-${String(i).padStart(2, '0')}.txt`;
        expect(directory.deferredFiles.get(path)!.file).not.toHaveBeenCalled();
      }
      expect(directory.activeReads).toBe(6);
      expect(directory.maxActiveReads).toBe(6);

      const resolutionOrder: string[] = [];
      const loadedAfterEachResolve: number[] = [];

      // Resolving file-03 starts file-07 immediately (worker pool sliding window)
      await act(async () => {
        directory.deferredFiles.get('file-03.txt')!.complete();
        await new Promise<void>(resolve => {
          setTimeout(resolve, 0);
        });
      });
      resolutionOrder.push('file-03.txt');
      loadedAfterEachResolve.push(editor.loadedFileCount);

      expect(
        directory.deferredFiles.get('file-07.txt')!.file,
      ).toHaveBeenCalledTimes(1);
      for (let i = 8; i <= 10; i++) {
        const path = `file-${String(i).padStart(2, '0')}.txt`;
        expect(directory.deferredFiles.get(path)!.file).not.toHaveBeenCalled();
      }
      expect(directory.activeReads).toBe(6);
      expect(directory.maxActiveReads).toBe(6);

      // Resolving file-01 starts file-08 immediately
      await act(async () => {
        directory.deferredFiles.get('file-01.txt')!.complete();
        await new Promise<void>(resolve => {
          setTimeout(resolve, 0);
        });
      });
      resolutionOrder.push('file-01.txt');
      loadedAfterEachResolve.push(editor.loadedFileCount);

      expect(
        directory.deferredFiles.get('file-08.txt')!.file,
      ).toHaveBeenCalledTimes(1);
      for (let i = 9; i <= 10; i++) {
        const path = `file-${String(i).padStart(2, '0')}.txt`;
        expect(directory.deferredFiles.get(path)!.file).not.toHaveBeenCalled();
      }
      expect(directory.activeReads).toBe(6);
      expect(directory.maxActiveReads).toBe(6);

      // Resolving file-04 starts file-09 immediately
      await act(async () => {
        directory.deferredFiles.get('file-04.txt')!.complete();
        await new Promise<void>(resolve => {
          setTimeout(resolve, 0);
        });
      });
      resolutionOrder.push('file-04.txt');
      loadedAfterEachResolve.push(editor.loadedFileCount);

      expect(
        directory.deferredFiles.get('file-09.txt')!.file,
      ).toHaveBeenCalledTimes(1);
      expect(
        directory.deferredFiles.get('file-10.txt')!.file,
      ).not.toHaveBeenCalled();
      expect(directory.activeReads).toBe(6);
      expect(directory.maxActiveReads).toBe(6);

      // Resolving file-06 starts file-10 immediately
      await act(async () => {
        directory.deferredFiles.get('file-06.txt')!.complete();
        await new Promise<void>(resolve => {
          setTimeout(resolve, 0);
        });
      });
      resolutionOrder.push('file-06.txt');
      loadedAfterEachResolve.push(editor.loadedFileCount);

      expect(
        directory.deferredFiles.get('file-10.txt')!.file,
      ).toHaveBeenCalledTimes(1);
      expect(directory.activeReads).toBe(6);
      expect(directory.maxActiveReads).toBe(6);

      // Now all 10 files have been scheduled. Resolve the remaining 6 active reads.
      const remainingFiles = [
        'file-10.txt',
        'file-02.txt',
        'file-05.txt',
        'file-08.txt',
        'file-07.txt',
        'file-09.txt',
      ];
      for (const path of remainingFiles) {
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

      expect(directory.activeReads).toBe(0);
      expect(directory.maxActiveReads).toBe(6);

      expect(loadedAfterEachResolve).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(resolutionOrder).toEqual([
        'file-03.txt',
        'file-01.txt',
        'file-04.txt',
        'file-06.txt',
        ...remainingFiles,
      ]);

      const loadedValues = snapshots.map(snapshot => snapshot.loaded);
      const maxLoadedJump = loadedValues.reduce((maxJump, loaded, index) => {
        if (index === 0) {
          return maxJump;
        }
        return Math.max(maxJump, loaded - loadedValues[index - 1]!);
      }, 0);
      expect(maxLoadedJump).toBeLessThanOrEqual(1);

      expect(snapshots.every(snapshot => snapshot.files === 10)).toBe(true);
      expect(snapshots.every(snapshot => snapshot.loaded <= 10)).toBe(true);
    });

    it('isolates reload progress and counters across failed and subsequent reloads', async () => {
      const paths = ['file1.txt', 'file2.txt'];
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
          await new Promise<void>(resolve => setTimeout(resolve, 0));
        });
      }

      await waitFor(() => {
        expect(result.current!.files).toHaveLength(2);
      });

      const editor = result.current!;

      for (const deferredFile of directory.deferredFiles.values()) {
        deferredFile.reset();
      }

      // First reload: file1 fails, but file2 is still in-flight
      let reload1Promise!: Promise<void>;
      await act(async () => {
        reload1Promise = editor.reload();
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      });

      // Reject file1
      await act(async () => {
        directory.deferredFiles
          .get('file1.txt')!
          .reject(new Error('Reload 1 error'));
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      });

      // Reload 1 is still pending because Promise.allSettled waits for file2
      expect(editor.loading).toBe(true);

      // Now complete file2 from the first reload
      await act(async () => {
        directory.deferredFiles.get('file2.txt')!.complete('old content');
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      });

      // Now reload 1 rejects
      await expect(reload1Promise).rejects.toThrow('Reload 1 error');
      expect(editor.loading).toBe(false);

      // Reset files for the second reload
      for (const deferredFile of directory.deferredFiles.values()) {
        deferredFile.reset();
      }

      let reload2Promise!: Promise<void>;
      await act(async () => {
        reload2Promise = editor.reload();
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      });

      expect(editor.loading).toBe(true);
      expect(editor.loadedFileCount).toBe(0);
      expect(editor.totalFileCount).toBe(2);

      await act(async () => {
        directory.deferredFiles.get('file1.txt')!.complete('new content 1');
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      });
      expect(editor.loadedFileCount).toBe(1);

      await act(async () => {
        directory.deferredFiles.get('file2.txt')!.complete('new content 2');
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      });
      expect(editor.loadedFileCount).toBe(2);

      await act(async () => {
        await reload2Promise;
      });

      expect(editor.loading).toBe(false);
      expect(editor.loadedFileCount).toBe(2);
      expect(editor.files[0].content).toBe('new content 1');
      expect(editor.files[1].content).toBe('new content 2');
    });

    it('resets loading to false and propagates error when listFiles rejects', async () => {
      const paths = ['file1.txt'];
      const directory = new DeferredDirectoryAccess(paths);

      const { result } = renderHook(() => useDirectoryEditor(), {
        wrapper: ({ children }: PropsWithChildren) => (
          <DirectoryEditorProvider directory={directory}>
            {children}
          </DirectoryEditorProvider>
        ),
      });

      await act(async () => {
        directory.deferredFiles.get('file1.txt')!.complete();
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(result.current!.files).toHaveLength(1);
      });

      const editor = result.current!;
      directory.listFiles.mockRejectedValueOnce(new Error('listFiles error'));

      let error: Error | undefined;
      await act(async () => {
        try {
          await editor.reload();
        } catch (err) {
          error = err as Error;
        }
      });

      expect(error).toBeDefined();
      expect(error?.message).toBe('listFiles error');
      expect(editor.loading).toBe(false);
    });

    it('resets loading to false, preserves previous files and dirty state when a file read rejects inside a chunk', async () => {
      const paths = ['file1.txt', 'file2.txt'];
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
          await new Promise<void>(resolve => setTimeout(resolve, 0));
        });
      }

      await waitFor(() => {
        expect(result.current!.files).toHaveLength(2);
      });

      const editor = result.current!;
      act(() => {
        editor.files[0].updateContent('dirty content');
      });
      expect(editor.files[0].dirty).toBe(true);

      for (const deferredFile of directory.deferredFiles.values()) {
        deferredFile.reset();
      }

      let reloadPromise!: Promise<void>;
      await act(async () => {
        reloadPromise = editor.reload();
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      });

      expect(editor.loading).toBe(true);
      expect(editor.files).toHaveLength(2);
      expect(editor.files[0].dirty).toBe(true);

      await act(async () => {
        directory.deferredFiles.get('file1.txt')!.complete('content 1');
        directory.deferredFiles
          .get('file2.txt')!
          .reject(new Error('Read failed'));
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      });

      let error: Error | undefined;
      await act(async () => {
        try {
          await reloadPromise;
        } catch (err) {
          error = err as Error;
        }
      });

      expect(error).toBeDefined();
      expect(error?.message).toBe('Read failed');
      expect(editor.loading).toBe(false);
      expect(editor.files).toHaveLength(2);
      expect(editor.files[0].dirty).toBe(true);
    });

    it('ignores save calls while reload is in progress', async () => {
      const paths = ['file1.txt'];
      const directory = new DeferredDirectoryAccess(paths);

      const { result } = renderHook(() => useDirectoryEditor(), {
        wrapper: ({ children }: PropsWithChildren) => (
          <DirectoryEditorProvider directory={directory}>
            {children}
          </DirectoryEditorProvider>
        ),
      });

      await act(async () => {
        directory.deferredFiles.get('file1.txt')!.complete('initial content');
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(result.current!.files).toHaveLength(1);
      });

      const editor = result.current!;
      act(() => {
        editor.files[0].updateContent('modified content');
      });

      directory.deferredFiles.get('file1.txt')!.reset();
      let reloadPromise!: Promise<void>;
      await act(async () => {
        reloadPromise = editor.reload();
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      });

      expect(editor.loading).toBe(true);

      await act(async () => {
        await editor.save();
      });

      expect(
        directory.deferredFiles.get('file1.txt')!.save,
      ).not.toHaveBeenCalled();

      await act(async () => {
        directory.deferredFiles.get('file1.txt')!.complete('reloaded content');
        await reloadPromise;
      });

      expect(editor.loading).toBe(false);
    });
  });
});
