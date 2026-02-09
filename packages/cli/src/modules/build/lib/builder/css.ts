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
import { bundle, transform } from 'lightningcss';
import { resolve as resolvePath, dirname } from 'node:path';
import { EntryPoint } from '../../../../lib/entryPoints';

/**
 * Bundles a CSS entry point, resolving @import statements and preserving @layer declarations.
 */
export async function buildCSSEntryPoint(
  entryPoint: EntryPoint,
  targetDir: string,
): Promise<void> {
  const sourcePath = resolvePath(targetDir, entryPoint.path);
  // Convert src/ path to dist/ path
  const outputPath = resolvePath(
    targetDir,
    entryPoint.path.replace(/^(\.\/)?src\//, 'dist/'),
  );

  // Read source to extract @layer declaration before bundling
  const source = await fs.readFile(sourcePath, 'utf8');
  const layerMatch = source.match(/@layer\s+[^;]+;/);

  // Bundle @import statements using lightningcss
  const { code: bundledCode } = bundle({
    filename: sourcePath,
  });

  // Transform the bundled CSS
  const { code } = transform({
    filename: outputPath,
    code: bundledCode,
    minify: false,
  });

  // Restore @layer declaration if it was removed during bundling
  let finalCode = code.toString();
  if (layerMatch && !finalCode.includes(layerMatch[0])) {
    finalCode = `${layerMatch[0]}\n\n${finalCode}`;
  }

  // Ensure output directory exists
  await fs.mkdir(dirname(outputPath), { recursive: true });

  // Write the bundled CSS
  await fs.writeFile(outputPath, finalCode);
}

/**
 * Builds all CSS entry points for a package.
 */
export async function buildCSSEntryPoints(
  entryPoints: EntryPoint[],
  targetDir: string,
): Promise<void> {
  const cssEntryPoints = entryPoints.filter(ep => ep.ext === '.css');

  for (const entryPoint of cssEntryPoints) {
    await buildCSSEntryPoint(entryPoint, targetDir);
  }
}
