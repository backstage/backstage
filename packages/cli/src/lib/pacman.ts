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

export interface PackageManager {
  name(): string;
  version(): string;
  install(): Promise<void>;
  runScript(scriptName: string): Promise<void>;
  fetchPackageInfo(name: string): Promise<PackageInfo>;
  loadLockfile(): Promise<Lockfile>;
  supportsBackstageVersionProtocol(): Promise<boolean>;
}

export interface Lockfile {
  get(name: string): LockfileQueryEntry[] | undefined;
  keys(): IterableIterator<string>;
  toString(): string;
}

export type PackageInfo = {
  name: string;
  'dist-tags': Record<string, string>;
  versions: string[];
  time: { [version: string]: string };
};

export type LockfileQueryEntry = {
  range: string;
  version: string;
  dataKey: string;
};

export async function detectPackageManager(): Promise<PackageManager> {
  return await Yarn.create();
}
