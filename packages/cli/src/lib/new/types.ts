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

import { Answers, DistinctQuestion } from 'inquirer';

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
  /** License to use for new packages */
  license: string;

  /** Creates a temporary directory. This will always be deleted after creation is done. */
  createTemporaryDirectory(name: string): Promise<string>;

  /** Signal that the creation process got to a point where permanent modifications were made */
  markAsModified(): void;
}

export type Prompt<TOptions extends Answers> = DistinctQuestion<TOptions> & {
  name: string;
};
