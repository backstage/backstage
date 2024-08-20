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

import chalk from 'chalk';
import { ModuleFederationOptions } from './types';

export function getModuleFederationOptions(
  name: string,
  isModuleFederationRemote?: boolean,
): ModuleFederationOptions | undefined {
  if (
    !isModuleFederationRemote &&
    !process.env.EXPERIMENTAL_MODULE_FEDERATION
  ) {
    return undefined;
  }

  console.log(
    chalk.yellow(
      `⚠️  WARNING: Module federation is experimental and will receive immediate breaking changes in the future.`,
    ),
  );

  return {
    mode: isModuleFederationRemote ? 'remote' : 'host',
    // The default output mode requires the name to be a usable as a code
    // symbol, there might be better options here but for now we need to
    // sanitize the name.
    name: name.replaceAll('@', '').replaceAll('/', '__').replaceAll('-', '_'),
  };
}
