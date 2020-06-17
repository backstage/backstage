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
// import fs from 'fs-extra';
import fs from 'fs';
import {
  TemplateEntityV1alpha1,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import { InputError } from '@backstage/backend-common';
import { PreparerBase } from './types';

export class FilePreparer implements PreparerBase {
  async prepare(template: TemplateEntityV1alpha1): Promise<string> {
    const location = template?.metadata?.annotations?.[LOCATION_ANNOTATION];

    const [locationType, actualLocation] = (location ?? '').split(/:(.+)/);
    if (locationType !== 'file') {
      throw new InputError(
        `Wrong location type: ${locationType}, should be 'file'`,
      );
    }

    if (!actualLocation) {
      throw new InputError(
        `Couldn't parse location for template: ${template.metadata.name}`,
      );
    }

    const templateId = template.metadata.name;

    const tempDir = await fs.promises.mkdtemp(templateId);

    // await fs.copy(actualLocation, tempDir);
    return tempDir;
  }
}
