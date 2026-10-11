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

import chalk from 'chalk';

// chalk 4 does not read NO_COLOR itself, and plain output is the safe default
// for pipes, which chalk already detects.
if (process.env.NO_COLOR) {
  chalk.level = 0;
}

export const symbols = {
  ok: chalk.green('✔'),
  fail: chalk.red('✖'),
  skip: chalk.dim('○'),
};

export const style = {
  heading: (text: string) => chalk.bold(text),
  label: (text: string) => chalk.dim(text),
  ref: (text: string) => chalk.cyan(text),
  muted: (text: string) => chalk.dim(text),
};

/** Strips the kind and namespace from an entity ref, `kind:default/name`. */
export function shortName(ref: string): string {
  return ref.slice(ref.lastIndexOf('/') + 1);
}
