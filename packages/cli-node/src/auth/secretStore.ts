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

import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/** @internal */
export type SecretStore = {
  get(service: string, account: string): Promise<string | undefined>;
  set(service: string, account: string, secret: string): Promise<void>;
  delete(service: string, account: string): Promise<void>;
};

async function loadKeytar(): Promise<typeof import('keytar') | undefined> {
  try {
    // eslint-disable-next-line import/no-extraneous-dependencies, @backstage/no-undeclared-imports
    const keytar = require('keytar') as typeof import('keytar');
    if (keytar && typeof keytar.getPassword === 'function') {
      return keytar;
    }
  } catch {
    // keytar not available
  }
  return undefined;
}

class KeytarSecretStore implements SecretStore {
  private readonly keytar: typeof import('keytar');
  constructor(keytar: typeof import('keytar')) {
    this.keytar = keytar;
  }
  async get(service: string, account: string): Promise<string | undefined> {
    const result = await this.keytar.getPassword(service, account);
    return result ?? undefined;
  }
  async set(service: string, account: string, secret: string): Promise<void> {
    await this.keytar.setPassword(service, account, secret);
  }
  async delete(service: string, account: string): Promise<void> {
    await this.keytar.deletePassword(service, account);
  }
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

class FileSecretStore implements SecretStore {
  private readonly baseDir: string;
  constructor() {
    const root =
      process.env.XDG_DATA_HOME ||
      (process.platform === 'win32'
        ? process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
        : path.join(os.homedir(), '.local', 'share'));
    this.baseDir = path.join(root, 'backstage-cli', 'auth-secrets');
  }
  private filePath(service: string, account: string): string {
    return path.join(
      this.baseDir,
      encodeURIComponent(service),
      `${encodeURIComponent(account)}.secret`,
    );
  }
  async get(service: string, account: string): Promise<string | undefined> {
    const file = this.filePath(service, account);
    if (!(await pathExists(file))) {
      return undefined;
    }
    return await fs.readFile(file, 'utf8');
  }
  async set(service: string, account: string, secret: string): Promise<void> {
    const file = this.filePath(service, account);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, secret, { encoding: 'utf8', mode: 0o600 });
  }
  async delete(service: string, account: string): Promise<void> {
    const file = this.filePath(service, account);
    try {
      await fs.unlink(file);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw err;
      }
    }
  }
}

let singleton: SecretStore | undefined;

/** @internal */
export async function getSecretStore(): Promise<SecretStore> {
  if (!singleton) {
    const keytar = await loadKeytar();
    if (keytar) {
      singleton = new KeytarSecretStore(keytar);
    } else {
      singleton = new FileSecretStore();
    }
  }
  return singleton;
}

/**
 * Reset the singleton instance (for testing purposes only)
 * @internal
 */
export function resetSecretStore(): void {
  singleton = undefined;
}
