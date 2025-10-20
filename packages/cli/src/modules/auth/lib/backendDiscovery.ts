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

import { loadCliConfig } from '../../config/lib/config';
import { ConfigReader } from '@backstage/config';
import inquirer from 'inquirer';

export async function resolveBackendBaseUrl(options: {
  args: string[];
  explicit?: string;
}): Promise<string> {
  if (options.explicit) return normalize(options.explicit);
  const { appConfigs } = await loadCliConfig({ args: options.args });
  const candidates = new Set<string>();
  for (const c of appConfigs) {
    const cfg = ConfigReader.fromConfigs([c]);
    const url = cfg.getOptionalString('backend.baseUrl');
    if (url) candidates.add(normalize(url));
  }
  const list = Array.from(candidates);
  const choices = [
    ...list.map(u => ({ name: u, value: u })),
    { name: 'Enter URL manually', value: '__manual__' },
  ];
  const { picked } = await inquirer.prompt<{
    picked: string;
  }>([
    {
      type: 'list',
      name: 'picked',
      message: 'Select backend base URL',
      choices,
    },
  ]);
  if (picked === '__manual__') {
    const { manual } = await inquirer.prompt<{
      manual: string;
    }>([{ type: 'input', name: 'manual', message: 'Enter backend base URL' }]);
    return normalize(manual);
  }
  return picked;
}

function normalize(u: string): string {
  try {
    const url = new URL(u);
    url.pathname = url.pathname.replace(/\/$/, '');
    return url.toString();
  } catch {
    throw new Error(`Invalid backend URL: ${u}`);
  }
}
