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

/* eslint-disable no-console */

/**
 * Generates tree-shakeable React icon modules from vendored Remix Icon SVG files.
 *
 * SVG sources live in ../svg/ and are listed in ../icons.manifest.json.
 * When adding a new icon:
 *   1. Copy the SVG from Remix Icon (https://github.com/Remix-Design/RemixIcon) into svg/
 *   2. Add an entry to icons.manifest.json
 *   3. Run: yarn workspace @backstage/ui-icons generate
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const svgDir = join(rootDir, 'svg');
const iconsDir = join(rootDir, 'src/icons');
const manifestPath = join(rootDir, 'icons.manifest.json');

const header = `/*
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

`;

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const iconNames = Object.keys(manifest.icons).sort();

mkdirSync(iconsDir, { recursive: true });

const generated = [];

for (const name of iconNames) {
  const { svg } = manifest.icons[name];
  const svgContent = readFileSync(join(svgDir, svg), 'utf8');
  const pathMatch = svgContent.match(/<path[^>]*\sd="([^"]+)"/);
  if (!pathMatch) {
    throw new Error(`Could not extract <path d="..."> from svg/${svg}`);
  }

  const pathData = pathMatch[1];
  const content = `${header}import { createIcon } from '../createIcon';

/**
 * @public
 */
export const ${name} = createIcon(
  '${pathData}',
  '${name}',
);
`;

  writeFileSync(join(iconsDir, `${name}.tsx`), content);
  generated.push(name);
  console.log(`Generated ${name} from svg/${svg}`);
}

const indexContent = `${header}export type { IconProps } from './createIcon';
export type { RemixiconComponentType } from './types';
export { createIcon } from './createIcon';
${generated.map(n => `export { ${n} } from './icons/${n}';`).join('\n')}
`;

writeFileSync(join(rootDir, 'src/index.ts'), indexContent);

// Sync package.json exports for per-icon subpath imports
const pkgPath = join(rootDir, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
pkg.exports = {
  '.': './src/index.ts',
  './package.json': './package.json',
  ...Object.fromEntries(
    generated.map(name => [`./${name}`, `./src/icons/${name}.tsx`]),
  ),
};
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

console.log(
  `\nDone. Generated ${generated.length} icons from Remix Icon SVG sources.`,
);
