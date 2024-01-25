/*
 * Copyright 2020 The Backstage Authors
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

import { AppConfig, Config } from '@backstage/config';
import { BundlingPathsOptions } from './paths';
import { ConfigSchema } from '@backstage/config-loader';

export type BundlingOptions = {
  checksEnabled: boolean;
  isDev: boolean;
  frontendConfig: Config;
  getFrontendAppConfigs(): AppConfig[];
  baseUrl: URL;
  parallelism?: number;
  additionalEntryPoints?: string[];
  // Path to append to the detected public path, e.g. '/public'
  publicSubPath?: string;
};

export type ServeOptions = BundlingPathsOptions & {
  checksEnabled: boolean;
  configPaths: string[];
  verifyVersions?: boolean;
};

export type BuildOptions = BundlingPathsOptions & {
  // Target directory, defaulting to paths.targetDir
  targetDir?: string;
  statsJsonEnabled: boolean;
  parallelism?: number;
  schema?: ConfigSchema;
  frontendConfig: Config;
  frontendAppConfigs: AppConfig[];
  fullConfig: Config;
};

export type BackendBundlingOptions = {
  checksEnabled: boolean;
  isDev: boolean;
  parallelism?: number;
  inspectEnabled: boolean;
  inspectBrkEnabled: boolean;
};

export type BackendServeOptions = BundlingPathsOptions & {
  checksEnabled: boolean;
  inspectEnabled: boolean;
  inspectBrkEnabled: boolean;
};
