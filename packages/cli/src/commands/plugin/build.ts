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
          console.log(event.error);
        } else {
          console.log(event.code);
        }
      });
    });
  }

  const bundle = await rollup({
    input: conf.input,
    plugins: conf.plugins,
  });
  await bundle.generate(conf.output as OutputOptions);
  await bundle.write(conf.output as OutputOptions);
};
