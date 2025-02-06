/*
 * Copyright 2025 The Backstage Authors
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
import fs from 'fs-extra';
import { join as joinPath } from 'path';

export class TemporaryDirectoryManager {
  #dirs = new Array<string>();

  static create() {
    const manager = new TemporaryDirectoryManager();
    process.on('beforeExit', manager.cleanup);
    return manager;
  }

  private constructor() {}

  createDir = async (name: string): Promise<string> => {
    const dir = await fs.mkdtemp(joinPath(os.tmpdir(), name));
    this.#dirs.push(dir);
    return dir;
  };

  cleanup = () => {
    for (const dir of this.#dirs) {
      fs.rmSync(dir, { recursive: true, force: true, maxRetries: 10 });
    }
  };
}
