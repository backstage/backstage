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

import { OpaqueCliModule } from '@internal/cli';
import { ForwardedError, InputError, NotFoundError } from '@backstage/errors';
import fs from 'fs-extra';
import { dirname, resolve as resolvePath } from 'node:path';
import type { CliCommand, CliModule, CliPackageContext } from './types';

/** A single implementation of a command path. */
export interface CommandVariant {
  command: CliCommand;
  module?: CliModule;
}

/**
 * Finds the nearest `package.json` at or above the given directory and
 * returns the package context for it, or `undefined` if there is none.
 */
export async function findCliPackageContext(
  startDir: string,
): Promise<CliPackageContext | undefined> {
  let dir = resolvePath(startDir);
  for (;;) {
    const packageJsonPath = resolvePath(dir, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        return { dir, packageJson: await fs.readJson(packageJsonPath) };
      } catch (error) {
        throw new ForwardedError(`Failed to read ${packageJsonPath}`, error);
      }
    }
    const parent = dirname(dir);
    if (parent === dir) {
      return undefined;
    }
    dir = parent;
  }
}

function describeModule(variant: CommandVariant): string {
  if (variant.module && OpaqueCliModule.isType(variant.module)) {
    return `"${OpaqueCliModule.toInternal(variant.module).packageName}"`;
  }
  return '<unknown module>';
}

/**
 * Selects which variant of a command to run.
 *
 * A single variant without `isEnabled` is returned directly without looking
 * up the package context. Otherwise, the `isEnabled` predicates are evaluated
 * against the package context: exactly one enabled variant is selected, more
 * than one is an error, and none falls back to the variant without
 * `isEnabled`, or is an error if there is no fallback.
 */
export async function resolveCommandVariant(
  variants: ReadonlyArray<CommandVariant>,
  getPackageContext: () => Promise<CliPackageContext | undefined>,
): Promise<CliCommand> {
  if (variants.length === 0) {
    throw new Error('Command has no implementations');
  }
  const fallback = variants.find(v => !v.command.isEnabled);
  const toggled = variants.filter(v => v.command.isEnabled);
  if (toggled.length === 0) {
    return variants[0].command;
  }

  const commandName = variants[0].command.path.join(' ');
  const context = await getPackageContext();

  const enabled: CommandVariant[] = [];
  if (context) {
    for (const variant of toggled) {
      if (await variant.command.isEnabled!(context)) {
        enabled.push(variant);
      }
    }
  }

  const packageDescription = context
    ? `package "${context.packageJson.name ?? context.dir}"`
    : 'the current directory, which is not inside a package';

  if (enabled.length > 1) {
    throw new InputError(
      `Command "${commandName}" is enabled by multiple modules for ${packageDescription}: ${enabled
        .map(describeModule)
        .join(', ')}. Only one module may enable this command per package.`,
    );
  }
  if (enabled.length === 1) {
    return enabled[0].command;
  }
  if (fallback) {
    return fallback.command;
  }
  throw new NotFoundError(
    `Command "${commandName}" is not enabled for ${packageDescription}. Candidate modules: ${toggled
      .map(describeModule)
      .join(', ')}`,
  );
}
