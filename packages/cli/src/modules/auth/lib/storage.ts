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

import { NotFoundError } from '@backstage/errors';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import lockfile from 'proper-lockfile';
import YAML from 'yaml';
import { z } from 'zod';

const METADATA_FILE = 'instances.yaml';

const storedInstanceSchema = z.object({
  name: z.string().min(1),
  baseUrl: z.string().url(),
  clientId: z.string().min(1),
  issuedAt: z.number().int().nonnegative(),
  accessToken: z.string(),
  accessTokenExpiresAt: z.number().int().nonnegative(),
  selected: z.boolean().optional(),
});

export type StoredInstance = z.infer<typeof storedInstanceSchema>;

const authYamlSchema = z.object({
  instances: z.array(storedInstanceSchema).default([]),
});

function getMetadataFilePath(): string {
  const root =
    process.env.XDG_CONFIG_HOME ||
    (process.platform === 'win32'
      ? process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
      : path.join(os.homedir(), '.config'));

  return path.join(root, 'backstage-cli', METADATA_FILE);
}

async function readAll(): Promise<{ instances: StoredInstance[] }> {
  const file = getMetadataFilePath();
  if (!(await fs.pathExists(file))) {
    return { instances: [] };
  }
  const text = await fs.readFile(file, 'utf8');
  if (!text.trim()) {
    return { instances: [] };
  }
  try {
    const doc = YAML.parse(text);
    const parsed = authYamlSchema.safeParse(doc);
    if (parsed.success) {
      return parsed.data;
    }
    return { instances: [] };
  } catch {
    return { instances: [] };
  }
}

async function writeAll(data: { instances: StoredInstance[] }): Promise<void> {
  const file = getMetadataFilePath();
  await fs.ensureDir(path.dirname(file));
  const yaml = YAML.stringify(authYamlSchema.parse(data), { indentSeq: false });
  await fs.writeFile(file, yaml, { encoding: 'utf8', mode: 0o600 });
}

export async function getAllInstances(): Promise<{
  instances: StoredInstance[];
  selected: StoredInstance | undefined;
}> {
  const { instances } = await readAll();
  const selected = instances.find(i => i.selected) ?? instances[0];
  return {
    // Normalize selection prop
    instances: instances.map(i => ({
      ...i,
      selected: i.name === selected.name,
    })),
    selected,
  };
}

export async function getSelectedInstance(
  instanceName?: string,
): Promise<StoredInstance> {
  if (instanceName) {
    return await getInstanceByName(instanceName);
  }
  const { selected } = await getAllInstances();
  if (!selected) {
    throw new Error(
      'Not instances found. Run "auth login" to authenticate first.',
    );
  }
  return selected;
}

export async function getInstanceByName(name: string): Promise<StoredInstance> {
  const { instances } = await readAll();
  const instance = instances.find(i => i.name === name);
  if (!instance) {
    throw new NotFoundError(`Instance '${name}' not found`);
  }
  return instance;
}

export async function upsertInstance(instance: StoredInstance): Promise<void> {
  const data = await readAll();
  const idx = data.instances.findIndex(i => i.name === instance.name);
  if (idx === -1) {
    data.instances.push(instance);
  } else {
    data.instances[idx] = instance;
  }
  await writeAll(data);
}

export async function removeInstance(name: string): Promise<void> {
  const data = await readAll();
  const next = data.instances.filter(i => i.name !== name);
  if (next.length !== data.instances.length) {
    await writeAll({ instances: next });
  }
}

export async function setSelectedInstance(name: string): Promise<void> {
  const data = await readAll();
  let found = false;
  data.instances = data.instances.map(i => {
    if (i.name === name) {
      found = true;
      return { ...i, selected: true };
    }
    const { selected, ...rest } = i;
    return { ...rest, selected: false };
  });
  if (!found) {
    throw new Error(`Unknown instance '${name}'`);
  }
  await writeAll(data);
}

export async function withMetadataLock<T>(fn: () => Promise<T>): Promise<T> {
  const file = getMetadataFilePath();
  await fs.ensureDir(path.dirname(file));
  if (!(await fs.pathExists(file))) {
    await fs.writeFile(file, '', { encoding: 'utf8', mode: 0o600 });
  }
  const release = await lockfile.lock(file, {
    retries: { retries: 10, factor: 1.3, minTimeout: 50, maxTimeout: 500 },
  });
  try {
    return await fn();
  } finally {
    await release();
  }
}
