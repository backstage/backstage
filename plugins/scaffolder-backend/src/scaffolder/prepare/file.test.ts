/*
 * Copyright 2020 Spotify AB
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
import YAML from 'yaml';
import { FilePreparer } from './file';
import path from 'path';
import {
  TemplateEntityV1alpha1,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';

const setupTest = async (fixturePath: string) => {
  const locationForTemplateYaml = path.resolve(
    path.dirname(
      require.resolve('@backstage/plugin-scaffolder-backend/package'),
    ),
    'fixtures',
    fixturePath,
  );

  const [parsedDocument] = YAML.parseAllDocuments(
    await fs.readFile(locationForTemplateYaml, 'utf-8'),
  );

  const template: TemplateEntityV1alpha1 = parsedDocument.toJSON();
  template.metadata.annotations = {
    [LOCATION_ANNOTATION]: `file:${locationForTemplateYaml}`,
  };

  const filePreparer = new FilePreparer();
  const resultDir = await filePreparer.prepare(template);

  return { filePreparer, template, resultDir };
};

describe('File preparer', () => {
  it('excludes the yaml file from the temp folder', async () => {
    const { resultDir } = await setupTest('test-simple-template/template.yaml');
    expect(fs.existsSync(`${resultDir}/template.yaml`)).toBe(false);
  });

  it('resolves relative path from the template', async () => {
    const { resultDir } = await setupTest('test-simple-template/template.yaml');
    expect(fs.existsSync(`${resultDir}/expected_file.ts`)).toBe(true);
  });

  it('resolves relative path from the nested template', async () => {
    const { resultDir } = await setupTest('test-nested-template/template.yaml');
    expect(fs.existsSync(`${resultDir}/expected_file.ts`)).toBe(true);
  });
});
