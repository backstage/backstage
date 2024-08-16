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

import { BackstagePackageFeatureType, PackageRole } from '@backstage/cli-node';
import path from 'path';
import { Project } from 'ts-morph';
import { EntryPoint } from '../lib/entryPoints';

type CreateFeatureEnvironmentOptions = {
  $$type?: BackstagePackageFeatureType;
  exports?: Record<string, string>;
  format?:
    | 'DefaultExport'
    | 'DefaultExportLinked'
    | 'DefaultExportLinkedWithSibling'
    | 'NamedExport'
    | 'WildCardExport';
  role?: PackageRole;
};

type FeatureEnvironment = {
  project: Project;
  role: PackageRole;
  dir: string;
  entryPoints: EntryPoint[];
};

type File = {
  path: string;
  content: string;
};

const createForExports = (
  exports: Record<string, string>,
  content: string,
): File[] => {
  return Object.entries(exports).map(([_, filePath]) => ({
    path: `./${filePath}`,
    content,
  }));
};

const createTestType = ($$type: BackstagePackageFeatureType): File[] => [
  {
    path: './src/createTestType.ts',
    content: `
export interface TestType {
  readonly $$type: '${$$type}';
};

export function createTestType(): TestType {
  return {
    $$type: '${$$type}',
  };
};
  `,
  },
];

const createTestDefaultExport = (exports: Record<string, string>): File[] =>
  createForExports(
    exports,
    `
import { createTestType } from './createTestType';

export { TestType } from './createTestType';
export default createTestType();
    `,
  );

const createTestDefaultExportLinked = (
  exports: Record<string, string>,
): File[] => [
  ...createForExports(
    exports,
    `
export { TestType } from './createTestType';
export { default } from './linked';
  `,
  ),
  {
    path: './src/linked.ts',
    content: `
import { createTestType } from './createTestType';

export default createTestType();
  `,
  },
];

const createTestDefaultExportLinkedWithSibling = (
  exports: Record<string, string>,
): File[] => [
  ...createForExports(
    exports,
    `
export { TestType } from './createTestType';
export { default, test } from './linked';
  `,
  ),
  {
    path: './src/linked.ts',
    content: `
import { createTestType } from './createTestType';

export const test = createTestType();
export default createTestType();
  `,
  },
];

const createTestNamedExport = (exports: Record<string, string>): File[] => [
  ...createForExports(
    exports,
    `
import { createTestType } from './createTestType';

export { TestType } from './createTestType';
export const test = createTestType();
  `,
  ),
];

const createTestWildCardExport = (exports: Record<string, string>): File[] => [
  ...createForExports(
    exports,
    `
export * from './linked';
  `,
  ),
  {
    path: './src/linked.ts',
    content: `
import { createTestType } from './createTestType';

export { TestType } from './createTestType';
export const test = createTestType();
export default createTestType();
  `,
  },
];

const formatToFiles = {
  DefaultExport: createTestDefaultExport,
  DefaultExportLinked: createTestDefaultExportLinked,
  DefaultExportLinkedWithSibling: createTestDefaultExportLinkedWithSibling,
  NamedExport: createTestNamedExport,
  WildCardExport: createTestWildCardExport,
};

export default function createFeatureEnvironment(
  options?: CreateFeatureEnvironmentOptions,
): FeatureEnvironment {
  const {
    $$type = '@backstage/BackendFeature',
    exports = { '.': 'src/index.ts' },
    format = 'DefaultExport',
    role = 'backend-plugin',
  } = options ?? {};

  const project = new Project();
  const entryPoints: EntryPoint[] = Object.entries(exports ?? {}).map(
    ([mount, filePath]) => ({
      mount,
      path: filePath,
      name: mount,
      ext: path.extname(filePath),
    }),
  );

  const files = [...createTestType($$type), ...formatToFiles[format](exports)];

  for (const file of files) {
    project.createSourceFile(file.path, file.content);
  }

  return {
    project,
    role,
    dir: project.getFileSystem().getCurrentDirectory(),
    entryPoints,
  };
}
