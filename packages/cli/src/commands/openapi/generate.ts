/*
 * Copyright 2023 The Backstage Authors
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
import { paths } from '../../lib/paths';
import YAML from 'js-yaml';

export async function command() {
  const openapiPath = paths.resolveTarget('openapi.yaml');
  if (!(await fs.pathExists(openapiPath))) {
    console.warn('Could not find openapi.yaml in root of directory.');
    process.exit(1);
  }
  try {
    const yaml = YAML.load(
      await fs.readFile(paths.resolveTarget('openapi.yaml'), 'utf8'),
    );

    // For now, we're not adding a header or linting after pasting.
    await fs.writeFile(
      paths.resolveTarget('schema/openapi.ts'),
      `export default ${JSON.stringify(yaml, null, 2)} as const`,
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
