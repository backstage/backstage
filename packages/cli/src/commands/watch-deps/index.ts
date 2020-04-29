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

import { Command } from 'commander';
import { run } from 'lib/run';
import { createLogPipe } from 'lib/logging';
import { watchDeps, Options } from 'lib/watchDeps';

/*
 * The watch-deps command is meant to improve iteration speed while working in a large monorepo
 * with packages that are built independently, meaning packages depends on each other's build output.
 *
 * The command traverses all dependencies of the current package within the monorepo, and starts
 * watching for updates in all those packages. If a change is detected, we stop listening for changes,
 * and instead start up watch mode for that package. Starting watch mode means running the first
 * available yarn script out of "build:watch", "watch", or "build" --watch.
 */
export default async (cmd: Command, args: string[]) => {
  const options: Options = {};

  if (cmd.build) {
    options.build = true;
  }

  await watchDeps(options);

  if (args?.length) {
    // Use log pipe to avoid clearing the terminal
    const logPipe = createLogPipe();

    await run(args[0], args.slice(1), {
      stdoutLogFunc: logPipe(process.stdout),
      stderrLogFunc: logPipe(process.stderr),
    });
  }
};
