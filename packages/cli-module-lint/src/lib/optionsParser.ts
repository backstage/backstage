/*
 * Copyright 2024 The Backstage Authors
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
import { parseArgs, type ParseArgsConfig } from 'node:util';
import { parse as parseShellArgs } from 'shell-quote';

export function createScriptOptionsParser(
  commandPath: string[],
  options: ParseArgsConfig['options'],
) {
  const expectedScript = `backstage-cli ${commandPath.join(' ')}`;

  return (scriptStr?: string) => {
    if (!scriptStr || !scriptStr.startsWith(expectedScript)) {
      return undefined;
    }

    const argsStr = scriptStr.slice(expectedScript.length).trim();
    const args = argsStr
      ? parseShellArgs(argsStr).filter(
          (e): e is string => typeof e === 'string',
        )
      : [];

    const { values } = parseArgs({ args, strict: false, options });
    return values;
  };
}
