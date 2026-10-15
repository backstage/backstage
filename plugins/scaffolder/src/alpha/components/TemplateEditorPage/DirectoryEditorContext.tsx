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

import { ErrorPanel } from '@backstage/core-components';
import { toError } from '@backstage/errors';
import { useRerender } from '@react-hookz/web';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  TemplateDirectoryAccess,
  TemplateFileAccess,
} from '../../../lib/filesystem';

const MAX_SIZE = 1024 * 1024;
const MAX_SIZE_MESSAGE = 'This file is too large to be displayed';
// Keeps reads overlapping for slow file access without starting every read at once
const FILE_READ_CONCURRENCY = 6;

interface DirectoryEditorFile {
  /** The path of the file relative to the root directory */
  path: string;
  /** The staged content of the file */
  content: string;
  /** Whether the staged content matches what is on disk */
  dirty: boolean;

  /** Update the staged content of the file without saving */
  updateContent(content: string): void;
  /** Save the staged content of the file to disk */
  save(): Promise<void>;
  /** Reload the staged content of the file from disk */
  reload(options?: { silent?: boolean }): Promise<void>;
}

interface DirectoryEditor {
  /** A list of all files in the edited directory */
  files: Array<DirectoryEditorFile>;

  /** Whether the directory is being loaded from disk */
  loading: boolean;
  /** Number of files loaded so far during the current reload */
  loadedFileCount: number;
  /** Total number of files to load during the current reload */
  totalFileCount: number;

  /** The currently selected file */
  selectedFile: DirectoryEditorFile | undefined;
  /** Switch the selected file */
  setSelectedFile(path: string | undefined): void;

  /** Save all files to disk */
  save(): Promise<void>;
  /** Reload all files from disk */
  reload(): Promise<void>;

  subscribe(listener: () => void): () => void;
}

class DirectoryEditorFileManager implements DirectoryEditorFile {
  readonly #access: TemplateFileAccess;
  readonly #signalUpdate: () => void;

  #content?: string;
  #savedContent?: string;

  constructor(access: TemplateFileAccess, signalUpdate: () => void) {
    this.#access = access;
    this.#signalUpdate = signalUpdate;
  }

  get path() {
    return this.#access.path;
  }

  get content() {
    return this.#content ?? MAX_SIZE_MESSAGE;
  }

  updateContent(content: string): void {
    if (this.#content === undefined) {
      return;
    }
    this.#content = content;
    this.#signalUpdate();
  }

  get dirty() {
    return this.#content !== this.#savedContent;
  }

  async save(): Promise<void> {
    if (this.#content !== undefined) {
      await this.#access.save(this.#content);
      this.#savedContent = this.#content;
      this.#signalUpdate();
    }
  }

  async reload(options?: { silent?: boolean }): Promise<void> {
    const file = await this.#access.file();
    if (file.size > MAX_SIZE) {
      if (this.#content !== undefined) {
        this.#content = undefined;
        this.#savedContent = undefined;
        if (!options?.silent) {
          this.#signalUpdate();
        }
      }
      return;
    }

    const content = await file.text();
    if (this.#content !== content) {
      this.#content = content;
      this.#savedContent = content;
      if (!options?.silent) {
        this.#signalUpdate();
      }
    }
  }
}

class DirectoryEditorManager implements DirectoryEditor {
  readonly #access: TemplateDirectoryAccess;
  readonly #listeners = new Set<() => void>();

  #files: DirectoryEditorFile[] = [];
  #selectedFile: DirectoryEditorFile | undefined;
  #loading = false;
  #loadedFileCount = 0;
  #totalFileCount = 0;
  #reloadPromise: Promise<void> | null = null;

  constructor(access: TemplateDirectoryAccess) {
    this.#access = access;
  }

  get files() {
    return this.#files;
  }

  get loading() {
    return this.#loading;
  }

  get loadedFileCount() {
    return this.#loadedFileCount;
  }

  get totalFileCount() {
    return this.#totalFileCount;
  }

  get selectedFile() {
    return this.#selectedFile;
  }

  setSelectedFile = (path: string | undefined): void => {
    const prev = this.#selectedFile;
    const next = this.#files.find(file => file.path === path);
    if (prev !== next) {
      this.#selectedFile = next;
      this.#signalUpdate();
    }
  };

  get dirty() {
    return this.#files.some(file => file.dirty);
  }

  async save(): Promise<void> {
    if (this.#loading) {
      return;
    }
    await Promise.all(this.#files.map(file => file.save()));
  }

  reload(): Promise<void> {
    if (this.#reloadPromise) {
      return this.#reloadPromise;
    }

    this.#loading = true;
    this.#loadedFileCount = 0;
    this.#totalFileCount = 0;
    this.#signalUpdate();

    const doReload = async () => {
      const fileAccesses = await this.#access.listFiles();

      this.#totalFileCount = fileAccesses.length;
      this.#signalUpdate();

      const results = new Array<DirectoryEditorFileManager>(
        fileAccesses.length,
      );

      if (fileAccesses.length > 0) {
        await new Promise<void>((resolve, reject) => {
          let nextIndex = 0;
          let activeCount = 0;
          // Once a read fails the reload is abandoned, so reads that are
          // still in flight must not touch the results or the progress.
          let failed = false;

          const launchNext = () => {
            const runTask = (index: number) => {
              activeCount++;

              const manager = new DirectoryEditorFileManager(
                fileAccesses[index],
                this.#signalUpdate,
              );

              manager.reload({ silent: true }).then(
                () => {
                  activeCount--;
                  if (failed) {
                    return;
                  }
                  results[index] = manager;
                  this.#loadedFileCount++;
                  this.#signalUpdate();
                  if (nextIndex >= fileAccesses.length && activeCount === 0) {
                    resolve();
                  } else {
                    launchNext();
                  }
                },
                err => {
                  activeCount--;
                  if (failed) {
                    return;
                  }
                  failed = true;
                  reject(toError(err));
                },
              );
            };

            while (
              !failed &&
              activeCount < FILE_READ_CONCURRENCY &&
              nextIndex < fileAccesses.length
            ) {
              runTask(nextIndex++);
            }
          };

          launchNext();
        });
      }

      this.#files = results;
      // Keep whichever file is selected now, as it may have changed while
      // the files were loading.
      this.setSelectedFile(this.#selectedFile?.path);
    };

    // Clean up in a chained handler so that it always runs after the promise
    // has been stored, even if loading fails before the first await.
    this.#reloadPromise = doReload().finally(() => {
      this.#reloadPromise = null;
      this.#loading = false;
      this.#signalUpdate();
    });
    return this.#reloadPromise;
  }

  subscribe(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  #signalUpdate = () => {
    this.#listeners.forEach(listener => listener());
  };
}

const DirectoryEditorContext = createContext<DirectoryEditor | undefined>(
  undefined,
);

export function useDirectoryEditor(): DirectoryEditor | undefined {
  const value = useContext(DirectoryEditorContext);
  const rerender = useRerender();

  useEffect(() => value?.subscribe(rerender), [value, rerender]);

  return value;
}

interface DirectoryEditorProviderProps {
  directory?: TemplateDirectoryAccess;
  children?: ReactNode;
}

export function DirectoryEditorProvider(props: DirectoryEditorProviderProps) {
  const { directory } = props;

  const manager = useMemo(
    () => (directory ? new DirectoryEditorManager(directory) : undefined),
    [directory],
  );

  const [error, setError] = useState<Error>();

  useEffect(() => {
    let isCurrent = true;
    if (!manager) {
      setError(undefined);
      return undefined;
    }

    setError(undefined);

    manager
      .reload()
      .then(() => {
        if (!isCurrent) {
          return;
        }
        const firstYaml = manager.files.find(file =>
          file.path.match(/\.ya?ml$/),
        );
        if (firstYaml) {
          manager.setSelectedFile(firstYaml.path);
        }
      })
      .catch(cause => {
        if (!isCurrent) {
          return;
        }
        setError(cause instanceof Error ? cause : new Error(String(cause)));
      });

    return () => {
      isCurrent = false;
    };
  }, [manager]);

  if (error) {
    return <ErrorPanel error={error} />;
  }

  return (
    <DirectoryEditorContext.Provider value={manager}>
      {props.children}
    </DirectoryEditorContext.Provider>
  );
}
