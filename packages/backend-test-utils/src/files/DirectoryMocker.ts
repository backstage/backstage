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
import { join as joinPath } from 'path';

type FileNode = string | Buffer;

type DirectoryNode = {
  [name in string]: MockDirectoryNode;
};

type MockDirectoryNode = DirectoryNode | FileNode;

export class DirectoryMocker {
  static create() {
    const root = fs.mkdtempSync(
      joinPath(getTmpDir(), 'backstage-tmp-test-dir-'),
    );

    const mocker = new DirectoryMocker(root);

    process.on('beforeExit', mocker.#cleanupSync);

    afterAll(async () => {
      await mocker.cleanup();
    });

    return mocker;
  }

  readonly #root: string;

  private constructor(root: string) {
    this.#root = root;
  }

  get dir() {
    return this.#root;
  }

  async setContent(root: MockDirectoryNode) {
    await this.cleanup();

    async function createFiles(node: MockDirectoryNode, path: string) {
      if (typeof node === 'string' || node instanceof Buffer) {
        await fs.writeFile(path, node, 'utf8');
        return;
      }

      await fs.ensureDir(path);

      for (const [name, child] of Object.entries(node)) {
        await createFiles(child, resolveSafeChildPath(path, name));
      }
    }

    await createFiles(root, this.#root);
  }

  async cleanup() {
    await fs.rm(this.#root, { recursive: true, force: true });
  }

  #cleanupSync() {
    fs.rmSync(this.#root, { recursive: true, force: true });
  }
}
