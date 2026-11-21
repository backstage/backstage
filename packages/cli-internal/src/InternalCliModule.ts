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

import { CliCommand, CliModule, CliPackageContext } from '@backstage/cli-node';
import { OpaqueType } from '@internal/opaque';

/** @internal */
export interface CliCommandEntry {
  readonly $$type: '@backstage/CliCommand';
}

/** @internal */
export interface CliPackageCommandEntry {
  readonly $$type: '@backstage/CliPackageCommand';
}

/** A command registered with `addCommand`. */
export const OpaqueCliCommand = OpaqueType.create<{
  public: CliCommandEntry;
  versions: {
    readonly version: 'v1';
    readonly command: CliCommand;
  };
}>({
  type: '@backstage/CliCommand',
  versions: ['v1'],
});

/**
 * A command registered with `addPackageCommand`. The command path is already
 * prefixed with `package`.
 */
export const OpaqueCliPackageCommand = OpaqueType.create<{
  public: CliPackageCommandEntry;
  versions: {
    readonly version: 'v1';
    readonly command: CliCommand;
    readonly if?: (context: CliPackageContext) => boolean | Promise<boolean>;
  };
}>({
  type: '@backstage/CliPackageCommand',
  versions: ['v1'],
});

/** @internal */
export type CliCommandRegistration = CliCommandEntry | CliPackageCommandEntry;

/**
 * Unwraps a registered command into its command definition and the optional
 * condition, which only package commands can have.
 */
export function unwrapCliCommand(entry: CliCommandRegistration): {
  command: CliCommand;
  if?: (context: CliPackageContext) => boolean | Promise<boolean>;
} {
  if (OpaqueCliPackageCommand.isType(entry)) {
    const { command, if: condition } =
      OpaqueCliPackageCommand.toInternal(entry);
    return { command, if: condition };
  }
  return { command: OpaqueCliCommand.toInternal(entry).command };
}

export const OpaqueCliModule = OpaqueType.create<{
  public: CliModule;
  versions: {
    readonly version: 'v1';
    readonly packageName: string;
    readonly commands: Promise<ReadonlyArray<CliCommandRegistration>>;
  };
}>({
  type: '@backstage/CliModule',
  versions: ['v1'],
});
