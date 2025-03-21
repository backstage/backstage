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
import fs from 'fs';
import { Package } from '@manypkg/get-packages';
import {
  BackstagePackageJson as BackstagePackageJsonActual,
  PackageRole,
} from '@backstage/cli-node';
import { promisify } from 'util';

export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);

export type BackstagePackageJson = BackstagePackageJsonActual & {
  description?: string;
  backstage: {
    role: PackageRole;
  };
};

export function isBackstagePackage(
  packageJson: Package['packageJson'],
): packageJson is BackstagePackageJson {
  return (
    packageJson &&
    packageJson.hasOwnProperty('backstage') &&
    (packageJson as any)?.backstage?.role !== 'undefined'
  );
}

export const isRejected = (
  input: PromiseSettledResult<unknown>,
): input is PromiseRejectedResult => input.status === 'rejected';

export const isFulfilled = <T>(
  input: PromiseSettledResult<T>,
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';

/**
 * Generates a suitable entity name from a package name by slugifying the given package name.
 *
 * @param packageName - The package name to generate an entity name from.
 * @returns The generated entity name, a slugified version of the package name.
 */
export const safeEntityName = (packageName: string): string => {
  return packageName
    .replace(/^[^\w\s]|[^a-z0-9]$/g, '')
    .replace(/[^A-Za-z0-9_\-.]+/g, '-')
    .replace(
      /([a-z])([A-Z])/g,
      (_, a, b) => `${a}-${b.toLocaleLowerCase('en-US')}`,
    )
    .replace(/^(.)/, (_, a) => a.toLocaleLowerCase('en-US'));
};
