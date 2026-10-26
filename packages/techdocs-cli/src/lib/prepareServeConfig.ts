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

import { EngineConfig } from './engines';

/**
 * Lets the engine rewrite its config before serving and registers cleanup of
 * any temporary files on exit. Returns the config path to serve.
 */
export async function prepareServeConfig(
  engineConfig: EngineConfig,
  configPath: string,
  logger: { info(message: string): void },
): Promise<string> {
  if (!engineConfig.prepareServeConfig) {
    return configPath;
  }

  const prepared = await engineConfig.prepareServeConfig(configPath, logger);
  process.on('exit', () => prepared.cleanup());
  // Signals skip the 'exit' event unless we exit explicitly. Exit with the
  // conventional 128 + signal number.
  const exitCodes = { SIGINT: 130, SIGTERM: 143 } as const;
  for (const [signal, code] of Object.entries(exitCodes)) {
    process.once(signal, () => process.exit(code));
  }
  return prepared.configPath;
}
