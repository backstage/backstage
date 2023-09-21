/*
 * Copyright 2023 The Backstage Authors
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

import os from 'os';
import { isChildPath } from '@backstage/backend-common';
import fs from 'fs-extra';
import textextensions from 'textextensions';
import { tmpdir as getTmpDir } from 'os';
import {
  dirname,
  extname,
  join as joinPath,
  resolve as resolvePath,
  relative as relativePath,
  win32,
  posix,
} from 'path';
import { isError } from '@backstage/errors';

/**
 * The content of a mock directory represented by a nested object structure.
 *
 * @remarks
 *
 * When used as input, the keys may contain forward slashes to indicate nested directories.
 * Then returned as output, each directory will always be represented as a separate object.
 *
 * @example
 * ```ts
 * {
 *   'test.txt': 'content',
 *   'sub-dir': {
 *     'file.txt': 'content',
 *     'nested-dir/file.txt': 'content',
 *   },
 *   'empty-dir': {},
 *   'binary-file': Buffer.from([0, 1, 2]),
 * }
 * ```
 *
 * @public
 */
export type MockDirectoryContent = {
  [name in string]: MockDirectoryContent | string | Buffer;
};

/**
 * Options for {@link MockDirectory.create}.
 *
 * @public
 */
export interface MockDirectoryCreateOptions {
  /**
   * The root path to create the directory in. Defaults to a temporary directory.
   *
   * If an existing directory is provided, it will not be cleaned up after the test.
   */
  root?: string;
}

/**
 * Options for {@link MockDirectory.content}.
 *
 * @public
 */
export interface MockDirectoryContentOptions {
  /**
   * The path to read content from. Defaults to the root of the mock directory.
   *
   * An absolute path can also be provided, as long as it is a child path of the mock directory.
   */
  path?: string;

  /**
   * Whether or not to return files as text rather than buffers.
   *
   * Defaults to checking the file extension against a list of known text extensions.
   */
  shouldReadAsText?: boolean | ((path: string, buffer: Buffer) => boolean);
}

/** @internal */
type MockEntry =
  | {
      type: 'file';
      path: string;
      content: Buffer;
    }
  | {
      type: 'dir';
      path: string;
    };

/**
 * A utility for creating a mock directory that is automatically cleaned up.
 *
 * @public
 */
export class MockDirectory {
  /**
   * Creates a new temporary mock directory that will be removed after the tests have completed.
   *
   * @remarks
   *
   * This method is intended to be called outside of any test, either at top-level or
   * within a `describe` block. It will call `afterAll` to make sure that the mock directory
   * is removed after the tests have run.
   *
   * @example
   * ```ts
   * describe('MySubject', () => {
   *   const mockDir = MockDirectory.create();
   *
   *   beforeEach(() => mockDir.clear());
   *
   *   it('should work', async () => {
   *     // ... use mockDir
   *   })
   * })
   * ```
   */
  static create(options?: MockDirectoryCreateOptions): MockDirectory {
    const root =
      options?.root ??
      fs.mkdtempSync(joinPath(getTmpDir(), 'backstage-tmp-test-dir-'));

    const mocker = new MockDirectory(root);

    const shouldCleanup = !options?.root || !fs.pathExistsSync(options.root);
    if (shouldCleanup) {
      process.on('beforeExit', mocker.#removeSync);

      try {
        afterAll(mocker.remove);
      } catch {
        /* ignore */
      }
    }

    return mocker;
  }

  /**
   * Like {@link MockDirectory.create}, but also mocks `os.tmpdir()` to return the
   * mock directory path until the end of the test suite.
   *
   * @returns
   */
  static mockOsTmpDir(): MockDirectory {
    const mocker = MockDirectory.create();
    const origTmpdir = os.tmpdir;
    os.tmpdir = () => mocker.path;

    try {
      afterAll(() => {
        os.tmpdir = origTmpdir;
      });
    } catch {
      /* ignore */
    }
    return mocker;
  }

  readonly #root: string;

  private constructor(root: string) {
    this.#root = root;
  }

  /**
   * The path to the root of the mock directory
   */
  get path(): string {
    return this.#root;
  }

  /**
   * Resolves a path relative to the root of the mock directory.
   */
  resolve(...paths: string[]): string {
    return resolvePath(this.#root, ...paths);
  }

  /**
   * Sets the content of the mock directory. This will remove any existing content.
   *
   * @example
   * ```ts
   * await mockDir.setContent({
   *   'test.txt': 'content',
   *   'sub-dir': {
   *     'file.txt': 'content',
   *     'nested-dir/file.txt': 'content',
   *   },
   *   'empty-dir': {},
   *   'binary-file': Buffer.from([0, 1, 2]),
   * });
   * ```
   */
  async setContent(root: MockDirectoryContent): Promise<void> {
    await this.remove();

    return this.addContent(root);
  }

  /**
   * Adds content of the mock directory. This will overwrite existing files.
   *
   * @example
   * ```ts
   * await mockDir.addContent({
   *   'test.txt': 'content',
   *   'sub-dir': {
   *     'file.txt': 'content',
   *     'nested-dir/file.txt': 'content',
   *   },
   *   'empty-dir': {},
   *   'binary-file': Buffer.from([0, 1, 2]),
   * });
   * ```
   */
  async addContent(root: MockDirectoryContent): Promise<void> {
    const entries = this.#transformInput(root);

    for (const entry of entries) {
      const fullPath = resolvePath(this.#root, entry.path);
      if (!isChildPath(this.#root, fullPath)) {
        throw new Error(
          `Provided path must resolve to a child path of the mock directory, got '${entry.path}'`,
        );
      }

      if (entry.type === 'dir') {
        await fs.ensureDir(fullPath);
      } else if (entry.type === 'file') {
        await fs.ensureDir(dirname(fullPath));
        await fs.writeFile(fullPath, entry.content);
      }
    }
  }

  /**
   * Reads the content of the mock directory.
   *
   * @remarks
   *
   * Text files will be returned as strings, while binary files will be returned as buffers.
   * By default the file extension is used to determine whether a file should be read as text.
   *
   * @example
   * ```ts
   * await expect(mockDir.content()).resolves.toEqual({
   *   'test.txt': 'content',
   *   'sub-dir': {
   *     'file.txt': 'content',
   *     'nested-dir': {
   *       'file.txt': 'content',
   *     },
   *   },
   *   'empty-dir': {},
   *   'binary-file': Buffer.from([0, 1, 2]),
   * });
   * ```
   */
  async content(
    options?: MockDirectoryContentOptions,
  ): Promise<MockDirectoryContent | undefined> {
    const shouldReadAsText =
      (typeof options?.shouldReadAsText === 'boolean'
        ? () => options?.shouldReadAsText
        : options?.shouldReadAsText) ??
      ((path: string) => textextensions.includes(extname(path).slice(1)));

    const root = resolvePath(this.#root, options?.path ?? '');
    if (!isChildPath(this.#root, root)) {
      throw new Error(
        `Provided path must resolve to a child path of the mock directory, got '${root}'`,
      );
    }

    async function read(
      path: string,
    ): Promise<MockDirectoryContent | undefined> {
      if (!(await fs.pathExists(path))) {
        return undefined;
      }

      const entries = await fs.readdir(path, { withFileTypes: true });
      return Object.fromEntries(
        await Promise.all(
          entries.map(async entry => {
            const fullPath = resolvePath(path, entry.name);

            if (entry.isDirectory()) {
              return [entry.name, await read(fullPath)];
            }
            const content = await fs.readFile(fullPath);
            const relativePosixPath = relativePath(root, fullPath)
              .split(win32.sep)
              .join(posix.sep);

            if (shouldReadAsText(relativePosixPath, content)) {
              return [entry.name, content.toString('utf8')];
            }
            return [entry.name, content];
          }),
        ),
      );
    }

    return read(root);
  }

  /**
   * Clears the content of the mock directory, ensuring that the directory itself exists.
   */
  clear = async (): Promise<void> => {
    await this.setContent({});
  };

  /**
   * Removes the mock directory and all its contents.
   */
  remove = async (): Promise<void> => {
    try {
      await fs.rm(this.#root, { recursive: true, force: true });
    } catch (error: unknown) {
      if (isError(error) && error.code === 'ENOTEMPTY') {
        // Windows can be a bit flaky, give it another go
        await fs.rm(this.#root, { recursive: true, force: true });
      } else {
        throw error;
      }
    }
  };

  #transformInput(input: MockDirectoryContent[string]): MockEntry[] {
    const entries: MockEntry[] = [];

    function traverse(node: MockDirectoryContent[string], path: string) {
      const trimmedPath = path.startsWith('/') ? path.slice(1) : path; // trim leading slash
      if (typeof node === 'string') {
        entries.push({
          type: 'file',
          path: trimmedPath,
          content: Buffer.from(node, 'utf8'),
        });
      } else if (node instanceof Buffer) {
        entries.push({ type: 'file', path: trimmedPath, content: node });
      } else {
        entries.push({ type: 'dir', path: trimmedPath });
        for (const [name, child] of Object.entries(node)) {
          traverse(child, `${trimmedPath}/${name}`);
        }
      }
    }

    traverse(input, '');

    return entries;
  }

  #removeSync = () => {
    fs.rmSync(this.#root, { recursive: true, force: true });
  };
}
