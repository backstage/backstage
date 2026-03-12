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
import os from 'node:os';
import path from 'node:path';
import lockfile from 'proper-lockfile';
import YAML from 'yaml';
import { z } from 'zod';

const CONFIG_FILE = 'actions-config.yaml';

const actionsConfigSchema = z.object({
  instances: z
    .record(
      z.string(),
      z.object({
        pluginSources: z.array(z.string()).default([]),
      }),
    )
    .default({}),
});

type ActionsConfig = z.infer<typeof actionsConfigSchema>;

function getConfigFilePath(): string {
  const root =
    process.env.XDG_CONFIG_HOME ||
    (process.platform === 'win32'
      ? process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
      : path.join(os.homedir(), '.config'));

  return path.join(root, 'backstage-cli', CONFIG_FILE);
}

async function readConfig(): Promise<ActionsConfig> {
  const file = getConfigFilePath();
  if (!(await fs.pathExists(file))) {
    return actionsConfigSchema.parse({});
  }
  const text = await fs.readFile(file, 'utf8');
  if (!text.trim()) {
    return actionsConfigSchema.parse({});
  }
  try {
    const doc = YAML.parse(text);
    const parsed = actionsConfigSchema.safeParse(doc);
    if (parsed.success) {
      return parsed.data;
    }
    return actionsConfigSchema.parse({});
  } catch {
    return actionsConfigSchema.parse({});
  }
}

async function writeConfig(data: ActionsConfig): Promise<void> {
  const file = getConfigFilePath();
  await fs.ensureDir(path.dirname(file));
  const yaml = YAML.stringify(actionsConfigSchema.parse(data), {
    indentSeq: false,
  });
  await fs.writeFile(file, yaml, { encoding: 'utf8', mode: 0o600 });
}

async function withConfigLock<T>(fn: () => Promise<T>): Promise<T> {
  const file = getConfigFilePath();
  await fs.ensureDir(path.dirname(file));
  if (!(await fs.pathExists(file))) {
    await fs.writeFile(file, '', { encoding: 'utf8', mode: 0o600 });
  }
  const release = await lockfile.lock(file, {
    retries: { retries: 5, factor: 1.5, minTimeout: 100, maxTimeout: 1000 },
  });
  try {
    return await fn();
  } finally {
    await release();
  }
}

export async function getPluginSources(
  instanceName: string,
): Promise<string[]> {
  const config = await readConfig();
  return config.instances[instanceName]?.pluginSources ?? [];
}

export async function addPluginSource(
  instanceName: string,
  pluginId: string,
): Promise<void> {
  return withConfigLock(async () => {
    const config = await readConfig();
    const instance = config.instances[instanceName] ?? { pluginSources: [] };
    if (!instance.pluginSources.includes(pluginId)) {
      instance.pluginSources = [...instance.pluginSources, pluginId];
      config.instances[instanceName] = instance;
      await writeConfig(config);
    }
  });
}

export async function removePluginSource(
  instanceName: string,
  pluginId: string,
): Promise<void> {
  return withConfigLock(async () => {
    const config = await readConfig();
    const instance = config.instances[instanceName];
    if (instance) {
      const next = instance.pluginSources.filter(s => s !== pluginId);
      if (next.length !== instance.pluginSources.length) {
        config.instances[instanceName] = { ...instance, pluginSources: next };
        await writeConfig(config);
      }
    }
  });
}
