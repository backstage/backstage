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

import { paths } from '../../../lib/paths';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'node:path';
import {
  discoverFrontendPackages,
  readTargetPackage,
} from '../lib/discoverPackages';
import {
  createTranslationProject,
  extractTranslationRefsFromSourceFile,
  TranslationRefInfo,
} from '../lib/extractTranslations';

interface ExportOptions {
  output: string;
}

export default async (options: ExportOptions) => {
  const targetPackageJson = await readTargetPackage(
    paths.targetDir,
    paths.targetRoot,
  );

  const outputDir = resolvePath(paths.targetDir, options.output, 'messages');
  const manifestPath = resolvePath(
    paths.targetDir,
    options.output,
    'manifest.json',
  );

  const tsconfigPath = paths.resolveTargetRoot('tsconfig.json');
  if (!(await fs.pathExists(tsconfigPath))) {
    throw new Error(
      `No tsconfig.json found at ${tsconfigPath}. ` +
        'The translations export command requires a tsconfig.json in the repo root.',
    );
  }

  console.log(
    `Discovering frontend dependencies of ${targetPackageJson.name}...`,
  );
  const packages = await discoverFrontendPackages(
    targetPackageJson,
    paths.targetDir,
  );
  console.log(`Found ${packages.length} frontend packages to scan`);

  console.log('Creating TypeScript project...');
  const project = createTranslationProject(tsconfigPath);

  const allRefs: TranslationRefInfo[] = [];

  for (const pkg of packages) {
    for (const [exportPath, filePath] of pkg.entryPoints) {
      try {
        const sourceFile = project.addSourceFileAtPath(filePath);
        const refs = extractTranslationRefsFromSourceFile(
          sourceFile,
          pkg.name,
          exportPath,
        );
        allRefs.push(...refs);
      } catch (error) {
        console.warn(
          `  Warning: failed to process ${pkg.name} (${exportPath}): ${error}`,
        );
      }
    }
  }

  if (allRefs.length === 0) {
    console.log('No translation refs found.');
    return;
  }

  console.log(`Found ${allRefs.length} translation ref(s):`);
  for (const ref of allRefs) {
    const messageCount = Object.keys(ref.messages).length;
    console.log(`  ${ref.id} (${ref.packageName}, ${messageCount} messages)`);
  }

  // Write message files
  await fs.ensureDir(outputDir);

  for (const ref of allRefs) {
    const filePath = resolvePath(outputDir, `${ref.id}.en.json`);
    await fs.writeJson(filePath, ref.messages, { spaces: 2 });
  }

  // Write manifest
  const manifest: Record<string, object> = {};
  for (const ref of allRefs) {
    manifest[ref.id] = {
      package: ref.packageName,
      exportPath: ref.exportPath,
      exportName: ref.exportName,
    };
  }
  await fs.writeJson(manifestPath, { refs: manifest }, { spaces: 2 });

  console.log(
    `\nExported ${allRefs.length} translation ref(s) to ${options.output}/`,
  );
  console.log(`  Messages: ${options.output}/messages/<ref-id>.en.json`);
  console.log(`  Manifest: ${options.output}/manifest.json`);
};
