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
import { SpawnOptionsPartialEnv } from '../run';
import { Lockfile, LockfileQueryEntry } from './lockfile';
import { PackageInfo, PackageManager } from './pacman';

export class MockPackageManager implements PackageManager {
  name(): string {
    return 'mock';
  }

  version(): string {
    return '0.1';
  }

  lockfilePath(): string {
    return 'mock.lock';
  }

  run(_args: string[], _options: SpawnOptionsPartialEnv): Promise<void> {
    throw new Error('Method not implemented.');
  }

  fetchPackageInfo(_name: string): Promise<PackageInfo> {
    throw new Error('Method not implemented.');
  }

  loadLockfile(): Promise<Lockfile> {
    throw new Error('Method not implemented.');
  }

  parseLockfile(_contents: string): Promise<Lockfile> {
    throw new Error('Method not implemented.');
  }

  supportsBackstageVersionProtocol(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

export class MockLockfile extends Lockfile {
  get(_name: string): LockfileQueryEntry[] | undefined {
    throw new Error('Method not implemented.');
  }
  keys(): IterableIterator<string> {
    throw new Error('Method not implemented.');
  }
  toString(): string {
    throw new Error('Method not implemented.');
  }
}
