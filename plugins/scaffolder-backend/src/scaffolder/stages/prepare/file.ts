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
import path from 'path';
import os from 'os';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { parseLocationAnnotation } from './helpers';
import { InputError } from '@backstage/backend-common';
import { PreparerBase } from './types';

export class FilePreparer implements PreparerBase {
  async prepare(template: TemplateEntityV1alpha1): Promise<string> {
    const { protocol, location } = parseLocationAnnotation(template);

    if (protocol !== 'file') {
      throw new InputError(
        `Wrong location protocol: ${protocol}, should be 'file'`,
      );
    }
    const templateId = template.metadata.name;

    const tempDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), templateId),
    );

    const parentDirectory = path.resolve(
      path.dirname(location),
      template.spec.path ?? '.',
    );

    await fs.copy(parentDirectory, tempDir, {
      filter: src => src !== location,
      recursive: true,
    });

    return tempDir;
  }
}
