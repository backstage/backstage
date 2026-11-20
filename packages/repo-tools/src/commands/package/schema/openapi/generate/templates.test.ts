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
import { load } from 'js-yaml';
import { resolve } from 'node:path';
import { OPENAPI_IGNORE_FILES } from '../../../../../lib/openapi/constants';

const packageRoot = resolve(__dirname, '../../../../../..');

describe('typescript-backstage-client templates', () => {
  const config = load(
    fs.readFileSync(
      resolve(packageRoot, 'templates/typescript-backstage-client.yaml'),
      'utf8',
    ),
  ) as {
    templateDir: string;
    files: Record<string, { destinationFilename?: string }>;
  };

  const destinations = Object.values(config.files)
    .map(file => file.destinationFilename)
    .filter((name): name is string => Boolean(name));

  it('generates the frontend, backend and isomorphic clients with shared types', () => {
    expect(destinations).toEqual(
      expect.arrayContaining([
        'apis/Api.types.ts',
        'apis/Api.frontend.client.ts',
        'apis/Api.backend.client.ts',
        'apis/Api.isomorphic.client.ts',
        'types/auth.ts',
        'types/discovery.ts',
        'types/fetch.ts',
      ]),
    );
    expect(destinations).not.toContain('apis/Api.client.ts');
  });

  it('has a template file for every registered template', () => {
    for (const template of Object.keys(config.files)) {
      expect(
        fs.existsSync(resolve(packageRoot, config.templateDir, template)),
      ).toBe(true);
    }
  });

  it('exports every generated api file from the apis index', () => {
    const index = fs.readFileSync(
      resolve(packageRoot, config.templateDir, 'apis/index.mustache'),
      'utf8',
    );
    for (const destination of destinations.filter(name =>
      /^apis\/Api\..+\.ts$/.test(name),
    )) {
      const name = destination.replace('apis/', '').replace(/\.ts$/, '');
      expect(index).toContain(`export * from './${name}';`);
    }
  });

  it('does not ignore the generated api files', () => {
    expect(OPENAPI_IGNORE_FILES).toEqual(
      expect.arrayContaining(['!apis/*.client.ts', '!apis/*.types.ts']),
    );
  });
});
