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
import { useAsync, useRerender } from '@react-hookz/web';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import {
  TemplateDirectoryAccess,
  TemplateFileAccess,
} from '../../../lib/filesystem';

const MAX_SIZE = 1024 * 1024;
const MAX_SIZE_MESSAGE = 'This file is too large to be displayed';
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
    await Promise.all(this.#files.map(file => file.save()));
  }

  async reload(): Promise<void> {
    if (this.#loading) {
      return;
    }

    const selectedPath = this.#selectedFile?.path;

    this.#loading = true;
    this.#loadedFileCount = 0;
    this.#totalFileCount = 0;
    this.#signalUpdate();

    const fileAccesses = await this.#access.listFiles();

    this.#files.length = 0;
    this.#totalFileCount = fileAccesses.length;
    this.#signalUpdate();

    for (let i = 0; i < fileAccesses.length; i += FILE_READ_CONCURRENCY) {
      const chunk = fileAccesses.slice(i, i + FILE_READ_CONCURRENCY);
      const managers = await Promise.all(
        chunk.map(async fileAccess => {
          const manager = new DirectoryEditorFileManager(
            fileAccess,
            this.#signalUpdate,
          );
          await manager.reload({ silent: true });
          this.#loadedFileCount++;
          this.#signalUpdate();
          return manager;
        }),
      );
      this.#files.push(...managers);
      this.#signalUpdate();
    }

    this.#loading = false;
    this.setSelectedFile(selectedPath);
    this.#signalUpdate();
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

  const [{ result, error }, { execute }] = useAsync(
    async (dir?: TemplateDirectoryAccess) => {
      if (!dir) {
        return undefined;
      }

      const manager = new DirectoryEditorManager(dir);
      await manager.reload();

      const firstYaml = manager.files.find(file => file.path.match(/\.ya?ml$/));
      if (firstYaml) {
        manager.setSelectedFile(firstYaml.path);
      }

      return manager;
    },
  );

  useEffect(() => {
    execute(directory);
  }, [execute, directory]);

  if (error) {
    return <ErrorPanel error={error} />;
  }

  return (
    <DirectoryEditorContext.Provider value={result}>
      {props.children}
    </DirectoryEditorContext.Provider>
  );
}
