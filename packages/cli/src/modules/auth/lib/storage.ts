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
import lockfile from 'proper-lockfile';

export type StoredAuthMetadata = {
  clientId: string;
  issuedAt: number;
  accessTokenExpiresAt: number;
};

function metadataDir(): string {
  const root =
    process.env.XDG_CONFIG_HOME ||
    (process.platform === 'win32'
      ? process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
      : path.join(os.homedir(), '.config'));
  return path.join(root, 'backstage-cli', 'auth');
}

function backendKey(backendBaseUrl: string): string {
  return encodeURIComponent(backendBaseUrl.replace(/\/?$/, ''));
}

function filePath(backendBaseUrl: string): string {
  return path.join(metadataDir(), `${backendKey(backendBaseUrl)}.json`);
}

export async function readMetadata(
  backendBaseUrl: string,
): Promise<StoredAuthMetadata | undefined> {
  const file = filePath(backendBaseUrl);
  if (!(await fs.pathExists(file))) return undefined;
  return await fs.readJSON(file);
}

export async function writeMetadata(
  backendBaseUrl: string,
  data: StoredAuthMetadata,
): Promise<void> {
  const file = filePath(backendBaseUrl);
  await fs.ensureDir(path.dirname(file));
  await fs.writeJSON(file, data, { spaces: 2, mode: 0o600 });
}

export async function removeMetadata(backendBaseUrl: string): Promise<void> {
  await fs.remove(filePath(backendBaseUrl));
}

export async function withMetadataLock<T>(
  backendBaseUrl: string,
  fn: () => Promise<T>,
): Promise<T> {
  const file = filePath(backendBaseUrl);
  await fs.ensureFile(file);
  const release = await lockfile.lock(file, {
    retries: { retries: 10, factor: 1.3, minTimeout: 50, maxTimeout: 500 },
  });
  try {
    return await fn();
  } finally {
    await release();
  }
}
