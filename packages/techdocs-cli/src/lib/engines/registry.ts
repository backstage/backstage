/*
 * Copyright 2026 The Backstage Authors
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

import { EngineConfig } from './types';
import { mkdocsConfig } from './mkdocs';
import { zensicalConfig } from './zensical';

const engineConfigs: Record<string, EngineConfig> = {
  mkdocs: mkdocsConfig,
  zensical: zensicalConfig,
};

export function getEngineConfig(engine: string): EngineConfig {
  const config = engineConfigs[engine];
  if (!config) {
    const supported = Object.keys(engineConfigs).join(', ');
    throw new Error(
      `Unknown engine: "${engine}". Supported engines: ${supported}`,
    );
  }
  return config;
}
