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

import * as fs from 'node:fs';
import * as path from 'node:path';
import { CatalogModelRegistry } from '@backstage/catalog-model-extensions';
import { scanForCatalogModelExports } from '../scanner';
import { registerBuiltinKinds } from '../builtins';
import { emitTypeScript } from '../emitter';

export default async function generate(opts: {
  config?: string;
  output?: string;
}) {
  const rootDir = process.cwd();
  const outputDir =
    opts.output ?? path.join(rootDir, 'packages', 'catalog-model-generated');

  let config;
  if (opts.config) {
    const configPath = path.resolve(rootDir, opts.config);
    const yaml = await import('yaml');
    const { ConfigReader } = await import('@backstage/config');
    const configData = yaml.parse(fs.readFileSync(configPath, 'utf-8'));
    config = ConfigReader.fromConfigs([
      { context: configPath, data: configData },
    ]);
  }

  const registry = new CatalogModelRegistry();
  registerBuiltinKinds(registry);

  const modules = scanForCatalogModelExports(rootDir);
  console.log(`Found ${modules.length} catalog-model export(s):`);

  for (const mod of modules) {
    try {
      const imported = require(mod.catalogModelPath);
      const registrationFn = imported.default ?? imported;
      if (typeof registrationFn === 'function') {
        registrationFn(registry, config);
        console.log(`  ${mod.packageName}`);
      }
    } catch (err) {
      console.warn(`  ${mod.packageName} (failed: ${err})`);
    }
  }

  registry.resolve();

  const typeScript = emitTypeScript(registry);
  const outputPath = path.join(outputDir, 'src', 'index.ts');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, typeScript, 'utf-8');

  console.log(`\nGenerated: ${outputPath}`);
}
