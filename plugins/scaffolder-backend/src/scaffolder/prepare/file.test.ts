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

describe('File preparer', () => {
  it('resolves relative path from the template', async () => {
    const locationForTemplateYaml = path.resolve(
      __dirname,
      '../../..',
      'test/test-simple-template/template.yaml',
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

    expect(fs.existsSync(`${resultDir}/expected_file.ts`)).toBe(true);
    expect(fs.existsSync(`${resultDir}/template.yaml`)).toBe(false);
  });
});
