/*
 * Copyright 2026 The Backstage Authors
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
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, join, resolve, sep } from 'node:path';
import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import { globSync } from 'glob';
import { Node, Project, SyntaxKind } from 'ts-morph';
import { watch } from 'chokidar';

const sourcePattern = 'src/**/*.{js,jsx,ts,tsx}';
const watchPattern = 'src/**/*';
const actionNamePattern = /^[a-z0-9][a-z0-9._-]*$/;
const scriptExtensions = ['.js', '.jsx', '.ts', '.tsx'];
const loaderPattern =
  /import\(\s*['"]([^'"]+)['"]\s*\)\.then\(\s*([A-Za-z_$][\w$]*)\s*=>\s*(?:\2\.([A-Za-z_$][\w$]*)|<\2\.([A-Za-z_$][\w$]*)\s*\/>),?\s*\)/;

export type ActionUiResource = {
  actionName: string;
  entry: string;
  exportName: string;
};

async function resolveEntry(sourceFilePath: string, request: string) {
  const base = resolve(dirname(sourceFilePath), request);
  const candidates = [
    base,
    ...scriptExtensions.map(extension => `${base}${extension}`),
    ...scriptExtensions.map(extension => join(base, `index${extension}`)),
  ];
  for (const candidate of candidates) {
    if (await fs.pathExists(candidate)) {
      return candidate;
    }
  }
  throw new Error(
    `Unable to resolve action UI module '${request}' from ${sourceFilePath}`,
  );
}

function readStringProperty(object: Node, name: string): string | undefined {
  if (!Node.isObjectLiteralExpression(object)) {
    return undefined;
  }
  const property = object.getProperty(name);
  if (!property || !Node.isPropertyAssignment(property)) {
    return undefined;
  }
  const value = property.getInitializer();
  return value && Node.isStringLiteral(value)
    ? value.getLiteralValue()
    : undefined;
}

function findActionName(uiProperty: Node): string | undefined {
  for (const ancestor of uiProperty.getAncestors()) {
    const name = readStringProperty(ancestor, 'name');
    if (name) {
      return name;
    }
  }
  return undefined;
}

function isActionDeclaration(uiProperty: Node): boolean {
  return uiProperty
    .getAncestors()
    .some(
      ancestor =>
        Node.isObjectLiteralExpression(ancestor) &&
        Boolean(ancestor.getProperty('name')) &&
        Boolean(ancestor.getProperty('action')),
    );
}

export async function discoverActionUis(
  targetDir: string,
): Promise<ActionUiResource[]> {
  const packageJson = await fs.readJson(resolve(targetDir, 'package.json'));
  if (
    packageJson.backstage?.role !== 'backend-plugin' &&
    packageJson.backstage?.role !== 'backend-plugin-module'
  ) {
    return [];
  }
  const paths = globSync(sourcePattern, {
    cwd: targetDir,
    absolute: true,
    nodir: true,
    ignore: [
      'src/**/*.test.*',
      'src/**/*.spec.*',
      'src/**/__tests__/**',
      'src/**/fixtures/**',
    ],
  });
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  for (const path of paths) {
    const source = await fs.readFile(path, 'utf8');
    if (source.includes('component') && source.includes('ui')) {
      project.createSourceFile(path, source, { overwrite: true });
    }
  }

  const resources: ActionUiResource[] = [];
  const actionNames = new Map<string, string>();
  for (const sourceFile of project.getSourceFiles()) {
    for (const property of sourceFile.getDescendantsOfKind(
      SyntaxKind.PropertyAssignment,
    )) {
      if (property.getName() !== 'ui') {
        continue;
      }
      const ui = property.getInitializer();
      if (!ui || !Node.isObjectLiteralExpression(ui)) {
        continue;
      }
      const component = ui.getProperty('component');
      if (!component || !Node.isPropertyAssignment(component)) {
        continue;
      }
      if (!isActionDeclaration(property)) {
        continue;
      }
      const actionName = findActionName(property);
      if (!actionName) {
        throw new Error(
          `${sourceFile.getFilePath()}:${property.getStartLineNumber()} action UI must be declared inside an action with a literal name`,
        );
      }
      if (!actionNamePattern.test(actionName)) {
        throw new Error(
          `${sourceFile.getFilePath()}:${property.getStartLineNumber()} action name '${actionName}' must match ${actionNamePattern}`,
        );
      }
      const match = component.getInitializer()?.getText().match(loaderPattern);
      if (!match) {
        throw new Error(
          `${sourceFile.getFilePath()}:${component.getStartLineNumber()} action UI component must use () => import('./module').then(module => module.Component)`,
        );
      }
      const previous = actionNames.get(actionName);
      if (previous) {
        throw new Error(
          `Duplicate action UI for '${actionName}' in ${previous} and ${sourceFile.getFilePath()}`,
        );
      }
      actionNames.set(actionName, sourceFile.getFilePath());
      resources.push({
        actionName,
        entry: await resolveEntry(sourceFile.getFilePath(), match[1]),
        exportName: match[3] ?? match[4],
      });
    }
  }
  return resources;
}

function escapeInline(source: string, tag: string) {
  return source.replaceAll(`</${tag}`, `<\\/${tag}`);
}

async function bundleActionUi(resource: ActionUiResource, targetDir: string) {
  const virtualId = `\0backstage-action-ui:${resource.actionName}`;
  const packageRequire = createRequire(resolve(targetDir, 'package.json'));
  const react = packageRequire.resolve('react');
  const reactDom = packageRequire.resolve('react-dom/client');
  const bundle = await rollup({
    input: virtualId,
    onwarn(warning, warn) {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        warn(warning);
      }
    },
    plugins: [
      {
        name: 'backstage-action-ui-entry',
        resolveId(id) {
          return id === virtualId ? id : null;
        },
        load(id) {
          if (id !== virtualId) {
            return null;
          }
          return [
            `import React from ${JSON.stringify(react)};`,
            `import { createRoot } from ${JSON.stringify(reactDom)};`,
            `import { ${
              resource.exportName
            } as Component } from ${JSON.stringify(resource.entry)};`,
            `const root = document.getElementById('app');`,
            `if (!root) throw new Error('Action UI root not found');`,
            `createRoot(root).render(React.createElement(Component));`,
          ].join('');
        },
      },
      nodeResolve({ browser: true, extensions: scriptExtensions }),
      commonjs({ include: /node_modules/ }),
      json(),
      postcss({ inject: true, minimize: true }),
      esbuild({
        target: 'es2022',
        minify: true,
        jsx: 'automatic',
        define: { 'process.env.NODE_ENV': JSON.stringify('production') },
      }),
    ],
  });
  const generated = await bundle.generate({
    format: 'iife',
    inlineDynamicImports: true,
  });
  await bundle.close();
  const chunks = generated.output.filter(output => output.type === 'chunk');
  if (
    chunks.length !== 1 ||
    generated.output.some(output => output.type === 'asset')
  ) {
    throw new Error(
      `Action UI '${resource.actionName}' did not produce one self-contained script`,
    );
  }
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${
    resource.actionName
  }</title></head><body><main id="app"></main><script>${escapeInline(
    chunks[0].code,
    'script',
  )}</script></body></html>`;
}

export async function buildActionUis(options: { targetDir: string }) {
  const resources = await discoverActionUis(options.targetDir);
  const outputDir = resolve(options.targetDir, 'dist/action-ui');
  const temporaryDir = resolve(
    options.targetDir,
    `dist/.action-ui-${process.pid}-${Date.now()}`,
  );
  if (resources.length === 0) {
    await fs.remove(outputDir);
    return { count: 0 };
  }
  await fs.ensureDir(temporaryDir);
  const manifest: {
    version: 1;
    resources: Record<string, { path: string; integrity: string }>;
  } = { version: 1, resources: {} };
  try {
    for (const resource of resources) {
      const filename = `${resource.actionName}.html`;
      const html = await bundleActionUi(resource, options.targetDir);
      await fs.writeFile(join(temporaryDir, filename), html, 'utf8');
      manifest.resources[resource.actionName] = {
        path: filename,
        integrity: `sha256-${createHash('sha256')
          .update(html)
          .digest('base64')}`,
      };
    }
    await fs.writeJson(join(temporaryDir, 'manifest.json'), manifest, {
      spaces: 2,
    });
    await fs.remove(outputDir);
    await fs.move(temporaryDir, outputDir);
  } catch (error) {
    await fs.remove(temporaryDir);
    throw error;
  }
  return { count: resources.length };
}

export async function watchActionUis(options: { targetDirs: string[] }) {
  let building = Promise.resolve();
  const rebuild = (targetDir: string) => {
    building = building
      .then(async () => {
        await buildActionUis({ targetDir });
      })
      .catch(error =>
        console.error(`Action UI build failed in ${targetDir}:`, error),
      );
  };
  await Promise.all(
    options.targetDirs.map(targetDir => buildActionUis({ targetDir })),
  );
  const watchers = options.targetDirs.map(targetDir => {
    const watcher = watch(watchPattern, {
      cwd: targetDir,
      ignoreInitial: true,
    });
    const rebuildTarget = () => rebuild(targetDir);
    watcher
      .on('add', rebuildTarget)
      .on('change', rebuildTarget)
      .on('unlink', rebuildTarget);
    return watcher;
  });
  return async () => {
    await Promise.all(watchers.map(watcher => watcher.close()));
    await building;
  };
}

export function resolveActionUiPath(outputDir: string, relativePath: string) {
  const path = resolve(outputDir, relativePath);
  if (!path.startsWith(`${outputDir}${sep}`)) {
    throw new Error('Action UI resource resolves outside its output directory');
  }
  return path;
}
