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
import { parseArgs, type ParseArgsConfig } from 'node:util';
import { parse as parseShellArgs } from 'shell-quote';

/**
 * Creates a parser for package.json script options that follow a known
 * command prefix, such as `backstage-cli package lint --fix`.
 *
 * The prefix is either a list of command path segments, which is joined onto
 * the `backstage-cli` command, or a full script prefix string for other
 * commands such as `node bin/backstage-cli-module-oxlint package lint`.
 *
 * @param commandPath - Command path segments, or an exact script prefix
 * @param options - The script options to parse, see `util.parseArgs`
 * @public
 */
export function createScriptOptionsParser(
  commandPath: string[] | string,
  options: ParseArgsConfig['options'],
) {
  const expectedScript =
    typeof commandPath === 'string'
      ? commandPath
      : `backstage-cli ${commandPath.join(' ')}`;

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
