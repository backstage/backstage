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
import { Command } from 'commander';

export function createScriptOptionsParser(
  anyCmd: Command,
  commandPath: string[],
) {
  // Regardless of what command instance is passed in we want to find
  // the root command and resolve the path from there
  let rootCmd = anyCmd;
  while (rootCmd.parent) {
    rootCmd = rootCmd.parent;
  }

  // Now find the command that was requested
  let targetCmd = rootCmd as Command | undefined;
  for (const name of commandPath) {
    targetCmd = targetCmd?.commands.find(c => c.name() === name) as
      | Command
      | undefined;
  }

  if (!targetCmd) {
    throw new Error(
      `Could not find package command '${commandPath.join(' ')}'`,
    );
  }
  const cmd = targetCmd;

  const expectedScript = `backstage-cli ${commandPath.join(' ')}`;

  return (scriptStr?: string) => {
    if (!scriptStr || !scriptStr.startsWith(expectedScript)) {
      return undefined;
    }

    const argsStr = scriptStr.slice(expectedScript.length).trim();

    // Can't clone or copy or even use commands as prototype, so we mutate
    // the necessary members instead, and then reset them once we're done
    const currentOpts = (cmd as any)._optionValues;
    const currentStore = (cmd as any)._storeOptionsAsProperties;

    const result: Record<string, any> = {};
    (cmd as any)._storeOptionsAsProperties = false;
    (cmd as any)._optionValues = result;

    // Triggers the writing of options to the result object
    cmd.parseOptions(argsStr.split(' '));

    (cmd as any)._storeOptionsAsProperties = currentOpts;
    (cmd as any)._optionValues = currentStore;

    return result;
  };
}
