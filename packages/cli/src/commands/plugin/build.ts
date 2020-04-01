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

import { rollup, watch, RollupWatchOptions, OutputOptions } from 'rollup';
import conf from './rollup.config';
import { Command } from 'commander';

export default async (cmd: Command) => {
  if (cmd.watch) {
    const watcher = watch(conf as RollupWatchOptions);
    watcher.on('event', console.log);
    await new Promise(() => {});
  } else {
    const bundle = await rollup({
      input: conf.input,
      plugins: conf.plugins,
    });
    await bundle.generate(conf.output as OutputOptions);
    await bundle.write(conf.output as OutputOptions);
  }
};
