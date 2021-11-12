/*
 * Copyright 2021 The Backstage Authors
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

import { DistinctQuestion } from 'inquirer';

export interface CreateContext {
  /** The package scope to use for new packages */
  scope?: string;
  /** The NPM registry to use for new packages */
  npmRegistry?: string;
  /** Whether new packages should be marked as private */
  private: boolean;
  /** Whether we are creating something in a monorepo or not */
  isMonoRepo: boolean;
  /** The default version to use for new packages */
  defaultVersion: string;

  /** Creates a temporary directory. This will always be deleted after creation is done. */
  createTemporaryDirectory(name: string): Promise<string>;

  /** Signal that the creation process got to a point where permanent modifications were made */
  markAsModified(): void;
}

export type AnyOptions = Record<string, string>;

export interface Factory<Options extends AnyOptions> {
  name: string;
  description: string;
  optionsDiscovery?(): Promise<Partial<Options>>;
  optionsPrompts?: ReadonlyArray<DistinctQuestion<Options> & { name: string }>;
  create(options: Options, context?: CreateContext): Promise<void>;
}

export type AnyFactory = Factory<AnyOptions>;

export function createFactory<Options extends AnyOptions>(
  config: Factory<Options>,
): AnyFactory {
  return config as AnyFactory;
}
