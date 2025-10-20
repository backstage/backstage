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

import fs from 'fs-extra';
import os from 'os';
import path from 'path';

type SecretStore = {
  get(service: string, account: string): Promise<string | undefined>;
  set(service: string, account: string, secret: string): Promise<void>;
  delete(service: string, account: string): Promise<void>;
};

async function loadKeytar(): Promise<any | undefined> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const keytar = require('keytar');
    // Some environments may not have native bindings available
    if (keytar && typeof keytar.getPassword === 'function') {
      return keytar;
    }
  } catch {
    // ignore
  }
  return undefined;
}

class KeytarSecretStore implements SecretStore {
  private readonly keytar: any;
  constructor(keytar: any) {
    this.keytar = keytar;
  }
  async get(service: string, account: string): Promise<string | undefined> {
    return (await this.keytar.getPassword(service, account)) ?? undefined;
  }
  async set(service: string, account: string, secret: string): Promise<void> {
    await this.keytar.setPassword(service, account, secret);
  }
  async delete(service: string, account: string): Promise<void> {
    await this.keytar.deletePassword(service, account);
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
    this.baseDir = path.join(root, 'backstage-cli', 'secrets');
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
    if (!(await fs.pathExists(file))) return undefined;
    return await fs.readFile(file, 'utf8');
  }
  async set(service: string, account: string, secret: string): Promise<void> {
    const file = this.filePath(service, account);
    await fs.ensureDir(path.dirname(file));
    await fs.writeFile(file, secret, { encoding: 'utf8', mode: 0o600 });
  }
  async delete(service: string, account: string): Promise<void> {
    const file = this.filePath(service, account);
    await fs.remove(file);
  }
}

let singleton: SecretStore | undefined;

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
