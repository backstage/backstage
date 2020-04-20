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

import { rollup, watch, OutputOptions } from 'rollup';
import conf from './rollup.config';
import { Command } from 'commander';
import { withCache, getDefaultCacheOptions } from 'commands/build-cache';
import { paths } from 'helpers/paths';
import chalk from 'chalk';

function logError(error: any) {
  console.log('');

  if (error.code === 'PLUGIN_ERROR') {
    // typescript2 plugin has a complete message with all codeframes
    if (error.plugin === 'rpt2') {
      console.log(error.message);
    } else {
      // Log which plugin is causing errors to make it easier to identity.
      // If we see these in logs we likely want to provide some custom error
      // output for those plugins too.
      console.log(`(plugin ${error.plugin}) ${error}`);
    }
  } else {
    // Generic rollup errors, log what's available
    if (error.loc) {
      const file = `${paths.resolveTarget((error.loc.file || error.id)!)}`;
      const pos = `${error.loc.line}:${error.loc.column}`;
      console.log(`${file} [${pos}]`);
    } else if (error.id) {
      console.log(paths.resolveTarget(error.id));
    }

    console.log(String(error));

    if (error.url) {
      console.log(chalk.cyan(error.url));
    }

    if (error.frame) {
      console.log(chalk.dim(error.frame));
    }
  }
}

export default async (cmd: Command) => {
  if (cmd.watch) {
    // We're not resolving this promise because watch() doesn't have any exit event.
    // Instead we just wait until the user sends an interrupt signal.
    await new Promise(() => {
      const watcher = watch(conf);
      watcher.on('event', event => {
        //   START        — the watcher is (re)starting
        //   BUNDLE_START — building an individual bundle
        //   BUNDLE_END   — finished building a bundle
        //   END          — finished building all bundles
        //   ERROR        — encountered an error while bundling

        if (event.code === 'ERROR') {
          logError(event.error);
        } else if (event.code === 'BUNDLE_START') {
          console.log(chalk.dim(`building ${event.input}`));
        } else if (event.code === 'BUNDLE_END') {
          const { input, duration } = event;
          const s = (duration / 1000).toFixed(1);
          console.log(chalk.green(`built ${input} in ${s}s`));
        }
      });
    });
  }

  await withCache(getDefaultCacheOptions(), async () => {
    try {
      const bundle = await rollup({
        input: conf.input,
        plugins: conf.plugins,
      });
      await bundle.generate(conf.output as OutputOptions);
      await bundle.write(conf.output as OutputOptions);
    } catch (error) {
      logError(error);
      process.exit(1);
    }
  });
};
