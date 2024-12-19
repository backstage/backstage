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
import { paths } from '../paths';
import { Task } from '../tasks';

interface AdditionalActionsOptions {
  name: string;
  version: string;
  id: string;
  extensionName: string;
}

export async function runAdditionalActions(
  additionalActions: string[],
  options: AdditionalActionsOptions,
) {
  for (const action of additionalActions) {
    switch (action) {
      case 'install-frontend':
        await installFrontend(options);
        break;
      case 'add-frontend-legacy':
        await addFrontendLegacy(options);
        break;
      case 'install-backend':
        await installBackend(options);
        break;
      case 'add-backend':
        await addBackend(options);
        break;
      default:
        throw new Error(`${action} is not a valid additional action`);
    }
  }
}

async function addPackageDependency(
  path: string,
  options: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  },
) {
  try {
    const pkgJson = await fs.readJson(path);

    const normalize = (obj: Record<string, string>) => {
      if (Object.keys(obj).length === 0) {
        return undefined;
      }
      return Object.fromEntries(
        Object.keys(obj)
          .sort()
          .map(key => [key, obj[key]]),
      );
    };

    pkgJson.dependencies = normalize({
      ...pkgJson.dependencies,
      ...options.dependencies,
    });
    pkgJson.devDependencies = normalize({
      ...pkgJson.devDependencies,
      ...options.devDependencies,
    });
    pkgJson.peerDependencies = normalize({
      ...pkgJson.peerDependencies,
      ...options.peerDependencies,
    });

    await fs.writeJson(path, pkgJson, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to add package dependencies, ${error}`);
  }
}

async function installFrontend(options: AdditionalActionsOptions) {
  if (await fs.pathExists(paths.resolveTargetRoot('packages/app'))) {
    await Task.forItem('app', 'adding dependency', async () => {
      await addPackageDependency(
        paths.resolveTargetRoot('packages/app/package.json'),
        {
          dependencies: {
            [options.name]: `^${options.version}`,
          },
        },
      );
    });
  }
}

async function addFrontendLegacy(options: AdditionalActionsOptions) {
  await Task.forItem('app', 'adding import', async () => {
    const pluginsFilePath = paths.resolveTargetRoot('packages/app/src/App.tsx');
    if (!(await fs.pathExists(pluginsFilePath))) {
      return;
    }

    const content = await fs.readFile(pluginsFilePath, 'utf8');
    const revLines = content.split('\n').reverse();

    const lastImportIndex = revLines.findIndex(line =>
      line.match(/ from ("|').*("|')/),
    );
    const lastRouteIndex = revLines.findIndex(line =>
      line.match(/<\/FlatRoutes/),
    );

    if (lastImportIndex !== -1 && lastRouteIndex !== -1) {
      const importLine = `import { ${options.extensionName} } from '${options.name}';`;
      if (!content.includes(importLine)) {
        revLines.splice(lastImportIndex, 0, importLine);
      }

      const componentLine = `<Route path="/${options.id}" element={<${options.extensionName} />} />`;
      if (!content.includes(componentLine)) {
        const [indentation] = revLines[lastRouteIndex + 1].match(/^\s*/) ?? [];
        revLines.splice(lastRouteIndex + 1, 0, indentation + componentLine);
      }

      const newContent = revLines.reverse().join('\n');
      await fs.writeFile(pluginsFilePath, newContent, 'utf8');
    }
  });
}

async function installBackend(options: AdditionalActionsOptions) {
  if (await fs.pathExists(paths.resolveTargetRoot('packages/backend'))) {
    await Task.forItem('backend', 'adding dependency', async () => {
      await addPackageDependency(
        paths.resolveTargetRoot('packages/backend/package.json'),
        {
          dependencies: {
            [options.name]: `^${options.version}`,
          },
        },
      );
    });
  }
}

async function addBackend({ name }: AdditionalActionsOptions) {
  if (await fs.pathExists(paths.resolveTargetRoot('packages/backend'))) {
    await Task.forItem('backend', `adding ${name}`, async () => {
      const backendFilePath = paths.resolveTargetRoot(
        'packages/backend/src/index.ts',
      );
      if (!(await fs.pathExists(backendFilePath))) {
        return;
      }

      const content = await fs.readFile(backendFilePath, 'utf8');
      const lines = content.split('\n');
      const backendAddLine = `backend.add(import('${name}'));`;

      const backendStartIndex = lines.findIndex(line =>
        line.match(/backend.start/),
      );

      if (backendStartIndex !== -1) {
        const [indentation] = lines[backendStartIndex].match(/^\s*/)!;
        lines.splice(backendStartIndex, 0, `${indentation}${backendAddLine}`);

        const newContent = lines.join('\n');
        await fs.writeFile(backendFilePath, newContent, 'utf8');
      }
    });
  }
}
