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
import * as result from './results';
import {
  LocationProcessor,
  LocationProcessorEmit,
  LocationProcessorResult,
} from './types';

export class FileReaderProcessor implements LocationProcessor {
  async process(
    item: LocationProcessorResult,
    emit: LocationProcessorEmit,
  ): Promise<LocationProcessorResult | undefined> {
    if (item.type !== 'location' || item.location.type !== 'file') {
      return item;
    }

    const { location, optional } = item;

    try {
      const exists = await fs.pathExists(location.target);
      if (exists) {
        const data = await fs.readFile(location.target);
        emit(result.data(location, data));
      } else if (!optional) {
        const message = `${location.type} ${location.target} does not exist`;
        emit(result.notFoundError(location, message));
      }
    } catch (e) {
      const message = `${location.type} ${location.target} could not be read, ${e}`;
      emit(result.generalError(location, message));
    }

    return undefined;
  }
}
