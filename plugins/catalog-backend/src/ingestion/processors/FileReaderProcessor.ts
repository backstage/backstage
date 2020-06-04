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

import { NotFoundError } from '@backstage/backend-common';
import { LocationSpec } from '@backstage/catalog-model';
import fs from 'fs-extra';
import { LocationProcessor, LocationProcessorResult } from './types';

export class FileReaderProcessor implements LocationProcessor {
  async readLocation(
    location: LocationSpec,
  ): Promise<LocationProcessorResult[] | undefined> {
    if (location.type !== 'file') {
      return undefined;
    }

    if (!(await fs.pathExists(location.target))) {
      throw new NotFoundError(`${location.target} does not exist`);
    }

    try {
      const data = await fs.readFile(location.target);
      return [{ type: 'data', location, data }];
    } catch (e) {
      throw new Error(`Unable to read ${location.target}, ${e}`);
    }
  }
}
