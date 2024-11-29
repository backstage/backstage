/*
 * Copyright 2023 The Backstage Authors
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

export { ConfigSources } from './ConfigSources';
export type {
  BaseConfigSourcesOptions,
  ClosableConfig,
  ConfigSourceTarget,
  ConfigSourcesDefaultForTargetsOptions,
  ConfigSourcesDefaultOptions,
} from './ConfigSources';
export { EnvConfigSource, readEnvConfig } from './EnvConfigSource';
export type { EnvConfigSourceOptions } from './EnvConfigSource';
export { FileConfigSource } from './FileConfigSource';
export type { FileConfigSourceOptions } from './FileConfigSource';
export { MutableConfigSource } from './MutableConfigSource';
export type { MutableConfigSourceOptions } from './MutableConfigSource';
export { RemoteConfigSource } from './RemoteConfigSource';
export type { RemoteConfigSourceOptions } from './RemoteConfigSource';
export { StaticConfigSource } from './StaticConfigSource';
export type { StaticConfigSourceOptions } from './StaticConfigSource';
export type {
  SubstitutionFunc as EnvFunc,
  ConfigSource,
  ConfigSourceData,
  ReadConfigDataOptions,
  AsyncConfigSourceGenerator,
  Parser,
} from './types';
