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
/* We want to maintain the same information as an enum, so we disable the redeclaration warning */
/* eslint-disable @typescript-eslint/no-redeclare */

import { BackstagePackage, BackstagePackageJson } from '@backstage/cli-node';

export const Output = {
  esm: 0,
  cjs: 1,
  types: 2,
} as const;

/**
 * @public
 */
export type Output = (typeof Output)[keyof typeof Output];

/**
 * @public
 */
export namespace Output {
  export type esm = typeof Output.esm;
  export type cjs = typeof Output.cjs;
  export type types = typeof Output.types;
}

export type BuildOptions = {
  logPrefix?: string;
  targetDir?: string;
  packageJson?: BackstagePackageJson;
  outputs: Set<Output>;
  minify?: boolean;
  workspacePackages: BackstagePackage[];
};
