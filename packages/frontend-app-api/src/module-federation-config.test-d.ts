/*
 * Copyright 2025 The Backstage Authors
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
 * Type-level tests to ensure that module-federation-related types in config.d.ts match the runtime types in @backstage/module-federation-common.
 *
 * This file validates that the inlined types in ../config.d.ts
 * (which cannot import from @backstage/module-federation-common due to schema
 * generation limi) remain consistent with the actual runtime types.
 *
 * If these tests fail to compile, it means the config.d.ts and
 * @backstage/module-federation-common/src/types.ts have diverged.
 */

import type { Config } from '../config';
import type {
  ConfiguredSharedDependencies,
  Host,
  sharedDependenciesConfigKey,
} from '@backstage/module-federation-common';

type ConfigKey = typeof sharedDependenciesConfigKey;

// Format path as a string without the Config prefix
type PathToString<Path extends readonly string[]> = Path extends readonly [
  infer First extends string,
  ...infer Rest extends readonly string[],
]
  ? Rest extends readonly []
    ? First
    : `${First}.${PathToString<Rest>}`
  : '';

// Type to extract the SharedDependencies type from our Config
type ConfigSharedDeps<
  T = Config,
  Keys extends readonly string[] = ConfigKey,
  OnSuccess = never,
  Path extends readonly string[] = [],
> = Keys extends readonly [
  infer First extends string,
  ...infer Rest extends readonly string[],
]
  ? First extends keyof T
    ? ConfigSharedDeps<NonNullable<T[First]>, Rest, OnSuccess, [...Path, First]>
    : OnSuccess extends string
    ? {
        error: `❌ Config key '${First}' not found at '${PathToString<Path>}'`;
        availableKeys: keyof T;
      }
    : never
  : [OnSuccess] extends [never]
  ? T
  : OnSuccess;

// Test 1: Validate that all config keys exist in the Config type
const _testKeysExist: 'Config key found' = {} as ConfigSharedDeps<
  Config,
  ConfigKey,
  'Config key found'
>;
void _testKeysExist;

// Test 2: ConfigSharedDeps should be assignable to ConfiguredSharedDependencies<Host>
const _testConfigToRuntime: ConfiguredSharedDependencies<Host> =
  {} as ConfigSharedDeps;
void _testConfigToRuntime;

// Test 3: ConfiguredSharedDependencies<Host> should be assignable to ConfigSharedDeps
const _testRuntimeToConfig: ConfigSharedDeps =
  {} as ConfiguredSharedDependencies<Host>;
void _testRuntimeToConfig;
