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

/**
 * Scans args for deprecated camelCase flag names and logs a warning for each
 * match. Since type-flag accepts both camelCase and kebab-case, the old names
 * still work — this just nudges users toward the new spelling.
 */
export function warnDeprecatedFlags(
  args: string[],
  flags: Record<string, unknown>,
) {
  for (const key of Object.keys(flags)) {
    const kebab = key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
    if (kebab === key) {
      continue;
    }
    const deprecated = `--${key}`;
    if (args.some(a => a === deprecated || a.startsWith(`${deprecated}=`))) {
      process.stderr.write(
        `DEPRECATION WARNING: ${deprecated} has been renamed to --${kebab}\n`,
      );
    }
  }
}
