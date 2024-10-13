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

import { Yarn } from './yarn';
import { Lockfile } from './lockfile';
import { SpawnOptionsPartialEnv } from '../run';

export interface PackageManager {
  name(): string;
  version(): string;
  lockfilePath(): string;
  run(args: string[], options?: SpawnOptionsPartialEnv): Promise<void>;
  fetchPackageInfo(name: string): Promise<PackageInfo>;
  loadLockfile(): Promise<Lockfile>;
  parseLockfile(contents: string): Promise<Lockfile>;
  supportsBackstageVersionProtocol(): Promise<boolean>;
}

export type PackageInfo = {
  name: string;
  'dist-tags': Record<string, string>;
  versions: string[];
  time: { [version: string]: string };
};

export async function detectPackageManager(): Promise<PackageManager> {
  return await Yarn.create();
}
