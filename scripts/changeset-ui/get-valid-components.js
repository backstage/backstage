/*
 * Copyright 2025 The Backstage Authors
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

const fs = require('fs');
const path = require('path');

/**
 * Extract valid component names from docs-ui types.ts
 * This ensures validation uses the same source of truth as the docs
 */
function getValidComponents() {
  const typesPath = path.join(__dirname, '../../docs-ui/src/utils/types.ts');

  if (!fs.existsSync(typesPath)) {
    throw new Error(`types.ts not found at: ${typesPath}`);
  }

  const content = fs.readFileSync(typesPath, 'utf-8');

  // Extract Component type union
  const typeMatch = content.match(/export type Component =([^;]+);/s);
  if (!typeMatch) {
    throw new Error('Could not find Component type definition in types.ts');
  }

  // Extract string literals from the union
  const components = typeMatch[1]
    .match(/['"]([^'"]+)['"]/g)
    .map(s => s.replace(/['"]/g, ''));

  return components;
}

module.exports = { getValidComponents };
