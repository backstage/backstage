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
import { OptionValues } from 'commander';
import { command as generateClient } from './client';
import { command as generateServer } from './server';

export async function command(opts: OptionValues) {
  if (!opts.clientPackage && !opts.server) {
    console.log(
      chalk.red('Either --client-package or --server must be defined.'),
    );
    process.exit(1);
  }
  if (opts.clientPackage) {
    await generateClient(opts.clientPackage);
  }
  if (opts.server) {
    await generateServer();
  }
}
