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
import fs from 'fs-extra';
import { Project } from 'ts-morph';
import { resolvePackagePaths } from '../../lib/paths';

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

function readPackageJson(pkg: string) {
  return JSON.parse(fs.readFileSync(`${pkg}/package.json`, 'utf-8'));
}

export async function lint(paths: string[]) {
  const pkgs = (await resolvePackagePaths()).filter(pkg => {
    const role = readPackageJson(pkg).backstage?.role;
    return role === 'backend-plugin' || role === 'backend-plugin-module';
  });

  if (paths.length > 0) {
    paths.forEach(verifyIndex);
    return;
  }
  pkgs.forEach(verifyIndex);
}

function verifyIndex(pkg: string) {
  console.log(`Verifying ${pkg}`);
  const sourceFile = project.getSourceFile(`${pkg}/src/index.ts`);
  if (!sourceFile) {
    console.log(`Could not find ${pkg}/src/index.ts`);
    process.exit(1);
  }
  const symbols = sourceFile?.getExportSymbols();

  const exportCount = symbols?.length || 0;
  if (exportCount > 1) {
    console.log(
      `   ⚠️ Warning: ${exportCount} exports found, ${symbols
        .map(symbol => symbol.getName())
        .join(', ')}`,
    );
  }

  const createRouterExport = symbols?.find(
    symbol => symbol.getName() === 'createRouter',
  );

  if (!sourceFile.getDefaultExportSymbol()) {
    console.log('   ❌ Missing default export');
  }
  let createRouterDeprecated = undefined;
  if (createRouterExport) {
    createRouterDeprecated = createRouterExport
      .getJsDocTags()
      .find(tag => tag.getName() === 'deprecated');
  }

  if (createRouterExport) {
    console.log('   ❌ createRouter is exported');
    if (!createRouterDeprecated)
      console.log('   ❌ createRouter is NOT deprecated');
  }

  const pkgJson = readPackageJson(pkg);
  if (
    '@backstage/backend-common' in pkgJson.dependencies ||
    '@backstage/backend-common' in pkgJson.devDependencies
  ) {
    console.log('   ❌ Stop depending on "@backstage/backend-common"');
  }

  if (
    '@backstage/backend-tasks' in pkgJson.dependencies ||
    '@backstage/backend-tasks' in pkgJson.devDependencies
  ) {
    console.log('   ❌ Stop depending on "@backstage/backend-tasks"');
  }
}
