/*
 * Copyright 2020 The Backstage Authors
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
import { resolve as resolvePath } from 'path';
import { InjectOptions } from './types';

/**
 * Injects configs into the app bundle, replacing any existing injected config.
 */
export async function injectConfigIntoStatic(
  options: InjectOptions,
): Promise<string | undefined> {
  const { staticDir, logger, appConfigs } = options;

  const files = await fs.readdir(staticDir);
  const jsFiles = files.filter(file => file.endsWith('.js'));

  const escapedData = JSON.stringify(appConfigs).replace(/("|'|\\)/g, '\\$1');
  const injected = `/*__APP_INJECTED_CONFIG_MARKER__*/"${escapedData}"/*__INJECTED_END__*/`;

  for (const jsFile of jsFiles) {
    const path = resolvePath(staticDir, jsFile);

    const content = await fs.readFile(path, 'utf8');
    if (content.includes('__APP_INJECTED_RUNTIME_CONFIG__')) {
      logger.info(`Injecting env config into ${jsFile}`);

      const newContent = content.replaceAll(
        '"__APP_INJECTED_RUNTIME_CONFIG__"',
        injected,
      );
      await fs.writeFile(path, newContent, 'utf8');
      return path;
    } else if (content.includes('__APP_INJECTED_CONFIG_MARKER__')) {
      logger.info(`Replacing injected env config in ${jsFile}`);

      const newContent = content.replaceAll(
        /\/\*__APP_INJECTED_CONFIG_MARKER__\*\/.*?\/\*__INJECTED_END__\*\//g,
        injected,
      );
      await fs.writeFile(path, newContent, 'utf8');
      return path;
    }
  }
  logger.info('Env config not injected');
  return undefined;
}
