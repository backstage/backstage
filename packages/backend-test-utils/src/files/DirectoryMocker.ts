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

import { resolveSafeChildPath } from '@backstage/backend-common';
import fs from 'fs-extra';
import { tmpdir as getTmpDir } from 'os';
import { dirname, join as joinPath, resolve as resolvePath } from 'path';

type MockEntry = {
  path: string;
  content: Buffer;
};

export type MockDirectory = {
  [name in string]: MockDirectory | string | Buffer;
};

interface DirectoryMockerOptions {
  /**
   * The root path to create the directory in. Defaults to a temporary directory.
   *
   * If an existing directory is provided, it will not be cleaned up after the test.
   */
  root?: string;
}

export class DirectoryMocker {
  static create(options?: DirectoryMockerOptions) {
    const root =
      options?.root ??
      fs.mkdtempSync(joinPath(getTmpDir(), 'backstage-tmp-test-dir-'));

    const mocker = new DirectoryMocker(root);

    const shouldCleanup = !options?.root || !fs.pathExistsSync(options.root);
    if (shouldCleanup) {
      process.on('beforeExit', mocker.#cleanupSync);

      try {
        afterAll(mocker.cleanup);
      } catch {
        /* ignore */
      }
    }

    return mocker;
  }

  readonly #root: string;

  private constructor(root: string) {
    this.#root = root;
  }

  get dir() {
    return this.#root;
  }

  async setContent(root: MockDirectory) {
    const entries = this.#transformInput(root);

    await this.cleanup();

    for (const { path, content } of entries) {
      const fullPath = resolveSafeChildPath(this.#root, path.slice(1)); // trim leading slash
      await fs.ensureDir(dirname(fullPath));
      await fs.writeFile(fullPath, content);
    }
  }

  async getContent(): Promise<MockDirectory | undefined> {
    async function read(path: string): Promise<MockDirectory | undefined> {
      if (!(await fs.pathExists(path))) {
        return undefined;
      }
      const entries = await fs.readdir(path);

      return Object.fromEntries(
        await Promise.all(
          entries.map(async entry => {
            const fullPath = resolvePath(path, entry);
            const stat = await fs.stat(fullPath);

            if (stat.isDirectory()) {
              return [entry, await read(fullPath)];
            }
            const content = await fs.readFile(fullPath);
            return [entry, content.toString('utf8')];
          }),
        ),
      );
    }

    return read(this.#root);
  }

  #transformInput(input: MockDirectory[string]): MockEntry[] {
    const entries: MockEntry[] = [];

    function traverse(node: MockDirectory[string], path: string) {
      if (typeof node === 'string') {
        entries.push({ path, content: Buffer.from(node, 'utf8') });
      } else if (node instanceof Buffer) {
        entries.push({ path, content: node });
      } else {
        for (const [name, child] of Object.entries(node)) {
          traverse(child, `${path}/${name}`);
        }
      }
    }

    traverse(input, '');

    return entries;
  }

  cleanup = async () => {
    await fs.rm(this.#root, { recursive: true, force: true });
  };

  #cleanupSync = () => {
    fs.rmSync(this.#root, { recursive: true, force: true });
  };
}
