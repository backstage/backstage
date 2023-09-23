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

import {
  BackstagePackage,
  PackageGraph,
  PackageRoles,
} from '@backstage/cli-node';
import { rollup, Plugin, defineConfig, OutputOptions } from 'rollup';
import fs from 'fs-extra';
import vm from 'vm';
import { walk, Node } from 'estree-walker';
import MagicString from 'magic-string';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import svgr from '@svgr/rollup';
import json from '@rollup/plugin-json';
import yaml from '@rollup/plugin-yaml';
import { resolve as resolvePath, posix as posixPath } from 'path';
import { readEntryPoints } from '../../lib/entryPoints';
import { forwardFileImports } from '../../lib/builder/plugins';
import { svgrTemplate } from '../../lib/svgrTemplate';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { type BackstagePlugin } from '../../../../frontend-plugin-api/src';

const DOC_MARKER = '<!-- @backstage-docgen -->';

const SCRIPT_EXTS = ['.js', '.jsx', '.ts', '.tsx'];

const trimDynamicImports: Plugin = {
  name: 'trim-dynamic-imports',
  transform(code) {
    if (!code.includes('import(')) {
      return undefined;
    }
    const parsed = this.parse(code);
    let magicString: MagicString | undefined = undefined;

    walk(parsed, {
      enter: node => {
        if (node.type !== 'ImportExpression') {
          return;
        }

        if (!magicString) {
          magicString = new MagicString(code);
        }
        magicString.overwrite(node.start, node.end, 'Promise.resolve(void 0)');
      },
    });

    if (magicString) {
      return { code: String(magicString) };
    }
    return undefined;
  },
};

const trimEntryExports: Plugin = {
  name: 'trim-entry-exports',
  transform(code, id) {
    if (!this.getModuleInfo(id)?.isEntry) {
      return undefined;
    }

    const parsed = this.parse(code) as Node;
    let magicString: MagicString | undefined = undefined;

    for (const node of parsed.body as Node[]) {
      if (!magicString) {
        magicString = new MagicString(code);
      }
      if (node.type === 'ExportAllDeclaration') {
        magicString.remove(node.start, node.end);
      } else if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration) {
          magicString.overwrite(
            node.start,
            node.end,
            magicString.slice(node.declaration.start, node.declaration.end),
          );
        } else {
          magicString.remove(node.start, node.end);
        }
      }
    }

    if (magicString) {
      return { code: String(magicString) };
    }
    return undefined;
  },
};

async function findReadme(dir: string): Promise<string | undefined> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.match(/^readme\.md/i)) {
      return resolvePath(dir, entry.name);
    }
  }
  return undefined;
}

async function scanPackage(pkg: BackstagePackage) {
  for (const entry of readEntryPoints(pkg.packageJson)) {
    if (!SCRIPT_EXTS.includes(entry.ext)) {
      continue;
    }

    const config = defineConfig({
      input: resolvePath(pkg.dir, entry.path),
      output: {
        name: 'exports',
        format: 'iife',
        exports: 'named',
        sourcemap: false,
        generatedCode: 'es2015',
        extend: true,
      },
      onwarn: () => {},
      treeshake: true,
      preserveEntrySignatures: 'strict',
      watch: false,
      cache: false,
      plugins: [
        resolve({ mainFields: ['module', 'main'] }),
        commonjs({
          sourceMap: false,
          include: /node_modules/,
          exclude: [/\/[^/]+\.(?:stories|test)\.[^/]+$/],
        }),
        postcss(),
        forwardFileImports({
          exclude: /\.icon\.svg$/,
          include: [
            /\.svg$/,
            /\.png$/,
            /\.gif$/,
            /\.jpg$/,
            /\.jpeg$/,
            /\.eot$/,
            /\.woff$/,
            /\.woff2$/,
            /\.ttf$/,
            /\.md$/,
          ],
        }),
        json(),
        yaml(),
        svgr({
          include: /\.icon\.svg$/,
          template: svgrTemplate,
        }),
        esbuild({
          target: 'es2022',
          minify: false,
          sourceMap: false,
          treeShaking: true,
        }),
        trimEntryExports,
        trimDynamicImports,
      ],
    });

    const bundle = await rollup(config);
    const {
      output: [output],
    } = await bundle.generate(config.output as OutputOptions);

    const exportObj: { default?: BackstagePlugin } = {};
    vm.runInNewContext(output.code, {
      global: {},
      exports: exportObj,
      process: { env: { NODE_ENV: 'production' } },
    });

    const feature = exportObj?.default;
    if (
      typeof feature === 'object' &&
      feature &&
      '$$type' in feature &&
      feature.$$type === '@backstage/BackstagePlugin'
    ) {
      return {
        import: posixPath.join(pkg.packageJson.name, entry.name),
        entryName: entry.name,
        feature,
      };
    }
  }

  return undefined;
}

async function generateFrontendPluginDocs(pkg: BackstagePackage) {
  const readmePath = await findReadme(pkg.dir);
  const readme = readmePath && (await fs.readFile(readmePath, 'utf8'));
  if (!readme?.includes(DOC_MARKER)) {
    return;
  }

  const result = await scanPackage(pkg);
  console.log(`DEBUG: result=`, result);
}

async function generateBackendPluginDocs(pkg: BackstagePackage) {
  const readmePath = await findReadme(pkg.dir);
  const readme = readmePath && (await fs.readFile(readmePath, 'utf8'));
  if (!readme?.includes(DOC_MARKER)) {
    return;
  }
}

async function generatePackageDocs(pkg: BackstagePackage) {
  const role = PackageRoles.getRoleFromPackage(pkg.packageJson);
  switch (role) {
    case 'frontend':
    case 'backend':
    case 'cli':
    case 'web-library':
    case 'node-library':
    case 'common-library':
      return;
    case 'frontend-plugin':
    case 'frontend-plugin-module':
      await generateFrontendPluginDocs(pkg);
      return;
    case 'backend-plugin':
    case 'backend-plugin-module':
      await generateBackendPluginDocs(pkg);
      return;
    default:
      return;
  }
}

export async function command(): Promise<void> {
  const packages = await PackageGraph.listTargetPackages();

  await Promise.all(packages.map(generatePackageDocs));
}
