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
import { isChildPath } from '@backstage/backend-plugin-api';
import fs from 'fs-extra';
import textextensions from 'textextensions';
import {
  dirname,
  extname,
  join as joinPath,
  resolve as resolvePath,
  relative as relativePath,
  win32,
  posix,
} from 'path';

const tmpdirMarker = Symbol('os-tmpdir-mock');

/**
 * A context that allows for more advanced file system operations when writing mock directory content.
 *
 * @public
 */
export interface MockDirectoryContentCallbackContext {
  /** Absolute path to the location of this piece of content on the filesystem */
  path: string;

  /** Creates a symbolic link at the current location */
  symlink(target: string): void;
}

/**
 * A callback that allows for more advanced file system operations when writing mock directory content.
 *
 * @public
 */
export type MockDirectoryContentCallback = (
  ctx: MockDirectoryContentCallbackContext,
) => void;

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
  [name in string]:
    | MockDirectoryContent
    | string
    | Buffer
    | MockDirectoryContentCallback;
};

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

/**
 * A utility for creating a mock directory that is automatically cleaned up.
 *
 * @public
 */
export interface MockDirectory {
  /**
   * The path to the root of the mock directory
   */
  readonly path: string;

  /**
   * Resolves a path relative to the root of the mock directory.
   */
  resolve(...paths: string[]): string;

  /**
   * Sets the content of the mock directory. This will remove any existing content.
   *
   * @example
   * ```ts
   * mockDir.setContent({
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
  setContent(root: MockDirectoryContent): void;

  /**
   * Adds content of the mock directory. This will overwrite existing files.
   *
   * @example
   * ```ts
   * mockDir.addContent({
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
  addContent(root: MockDirectoryContent): void;

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
   * expect(mockDir.content()).toEqual({
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
  content(
    options?: MockDirectoryContentOptions,
  ): MockDirectoryContent | undefined;

  /**
   * Clears the content of the mock directory, ensuring that the directory itself exists.
   */
  clear(): void;

  /**
   * Removes the mock directory and all its contents.
   */
  remove(): void;
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
    }
  | {
      type: 'callback';
      path: string;
      callback: MockDirectoryContentCallback;
    };

/** @internal */
class MockDirectoryImpl {
  readonly #root: string;

  constructor(root: string) {
    this.#root = root;
  }

  get path(): string {
    return this.#root;
  }

  resolve(...paths: string[]): string {
    return resolvePath(this.#root, ...paths);
  }

  setContent(root: MockDirectoryContent): void {
    this.remove();

    return this.addContent(root);
  }

  addContent(root: MockDirectoryContent): void {
    const entries = this.#transformInput(root);

    for (const entry of entries) {
      const fullPath = resolvePath(this.#root, entry.path);
      if (!isChildPath(this.#root, fullPath)) {
        throw new Error(
          `Provided path must resolve to a child path of the mock directory, got '${fullPath}'`,
        );
      }

      if (entry.type === 'dir') {
        fs.ensureDirSync(fullPath);
      } else if (entry.type === 'file') {
        fs.ensureDirSync(dirname(fullPath));
        fs.writeFileSync(fullPath, entry.content);
      } else if (entry.type === 'callback') {
        fs.ensureDirSync(dirname(fullPath));
        entry.callback({
          path: fullPath,
          symlink(target: string) {
            fs.symlinkSync(target, fullPath);
          },
        });
      }
    }
  }

  content(
    options?: MockDirectoryContentOptions,
  ): MockDirectoryContent | undefined {
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

    function read(path: string): MockDirectoryContent | undefined {
      if (!fs.pathExistsSync(path)) {
        return undefined;
      }

      const entries = fs.readdirSync(path, { withFileTypes: true });
      return Object.fromEntries(
        entries.map(entry => {
          const fullPath = resolvePath(path, entry.name);

          if (entry.isDirectory()) {
            return [entry.name, read(fullPath)];
          }
          const content = fs.readFileSync(fullPath);
          const relativePosixPath = relativePath(root, fullPath)
            .split(win32.sep)
            .join(posix.sep);

          if (shouldReadAsText(relativePosixPath, content)) {
            return [entry.name, content.toString('utf8')];
          }
          return [entry.name, content];
        }),
      );
    }

    return read(root);
  }

  clear = (): void => {
    this.setContent({});
  };

  remove = (): void => {
    fs.rmSync(this.#root, { recursive: true, force: true, maxRetries: 10 });
  };

  #transformInput(input: MockDirectoryContent[string]): MockEntry[] {
    const entries: MockEntry[] = [];

    function traverse(node: MockDirectoryContent[string], path: string) {
      if (typeof node === 'string') {
        entries.push({
          type: 'file',
          path,
          content: Buffer.from(node, 'utf8'),
        });
      } else if (node instanceof Buffer) {
        entries.push({ type: 'file', path, content: node });
      } else if (typeof node === 'function') {
        entries.push({ type: 'callback', path, callback: node });
      } else {
        entries.push({ type: 'dir', path });
        for (const [name, child] of Object.entries(node)) {
          traverse(child, path ? `${path}/${name}` : name);
        }
      }
    }

    traverse(input, '');

    return entries;
  }
}

/**
 * Options for {@link createMockDirectory}.
 *
 * @public
 */
export interface MockDirectoryOptions {
  /**
   * In addition to creating a temporary directory, also mock `os.tmpdir()` to return the
   * mock directory path until the end of the test suite.
   *
   * @returns
   */
  mockOsTmpDir?: boolean;

  /**
   * Initializes the directory with the given content, see {@link MockDirectory.setContent}.
   */
  content?: MockDirectoryContent;
}

/**
 * Creates a new temporary mock directory that will be removed after the tests have completed.
 *
 * @public
 * @remarks
 *
 * This method is intended to be called outside of any test, either at top-level or
 * within a `describe` block. It will call `afterAll` to make sure that the mock directory
 * is removed after the tests have run.
 *
 * @example
 * ```ts
 * describe('MySubject', () => {
 *   const mockDir = createMockDirectory();
 *
 *   beforeEach(mockDir.clear);
 *
 *   it('should work', () => {
 *     // ... use mockDir
 *   })
 * })
 * ```
 */
export function createMockDirectory(
  options?: MockDirectoryOptions,
): MockDirectory {
  const tmpDir = process.env.RUNNER_TEMP || os.tmpdir(); // GitHub Actions
  const root = fs.mkdtempSync(joinPath(tmpDir, 'backstage-tmp-test-dir-'));

  const mocker = new MockDirectoryImpl(root);

  const origTmpdir = options?.mockOsTmpDir ? os.tmpdir : undefined;
  if (origTmpdir) {
    if (Object.hasOwn(origTmpdir, tmpdirMarker)) {
      throw new Error(
        'Cannot mock os.tmpdir() when it has already been mocked',
      );
    }
    const mock = Object.assign(() => mocker.path, { [tmpdirMarker]: true });
    os.tmpdir = mock;
  }

  // In CI we expect there to be no need to clean up temporary directories
  const needsCleanup = !process.env.CI;
  if (needsCleanup) {
    process.on('beforeExit', mocker.remove);
  }

  try {
    afterAll(() => {
      if (origTmpdir) {
        os.tmpdir = origTmpdir;
      }
      if (needsCleanup) {
        mocker.remove();
      }
    });
  } catch {
    /* ignore */
  }

  if (options?.content) {
    mocker.setContent(options.content);
  }

  return mocker;
}
