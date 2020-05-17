/*
 * Copyright 2020 Spotify AB
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

import { rollup, OutputOptions } from 'rollup';
import chalk from 'chalk';
import { paths } from '../paths';
import { makeConfig } from './config';

function formatErrorMessage(error: any) {
  let msg = '';

  if (error.code === 'PLUGIN_ERROR') {
    // typescript2 plugin has a complete message with all codeframes
    if (error.plugin === 'rpt2') {
      msg += `${error.message}\n`;
    } else {
      // Log which plugin is causing errors to make it easier to identity.
      // If we see these in logs we likely want to provide some custom error
      // output for those plugins too.
      msg += `(plugin ${error.plugin}) ${error}\n`;
    }
  } else {
    // Generic rollup errors, log what's available
    if (error.loc) {
      const file = `${paths.resolveTarget((error.loc.file || error.id)!)}`;
      const pos = `${error.loc.line}:${error.loc.column}`;
      msg += `${file} [${pos}]\n`;
    } else if (error.id) {
      msg += `${paths.resolveTarget(error.id)}\n`;
    }

    msg += `${error}\n`;

    if (error.url) {
      msg += `${chalk.cyan(error.url)}\n`;
    }

    if (error.frame) {
      msg += `${chalk.dim(error.frame)}\n`;
    }
  }
  return msg;
}

export const buildPackage = async () => {
  try {
    const config = makeConfig();
    const bundle = await rollup(config);
    await bundle.generate(config.output as OutputOptions);
    await bundle.write(config.output as OutputOptions);
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};
