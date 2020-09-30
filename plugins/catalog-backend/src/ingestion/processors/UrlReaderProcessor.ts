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

import { UrlReader } from '@backstage/backend-common';
import { LocationSpec } from '@backstage/catalog-model';
import * as result from './results';
import { LocationProcessor, LocationProcessorEmit } from './types';

export class UrlReaderProcessor implements LocationProcessor {
  constructor(private readonly reader: UrlReader) {}

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'url') {
      return false;
    }

    try {
      const data = await this.reader.read(location.target);
      emit(result.data(location, data));
    } catch (error) {
      const message = `Unable to read ${location.type}, ${error}`;

      if (error.name === 'NotFoundError') {
        if (!optional) {
          emit(result.notFoundError(location, message));
        }
      } else {
        emit(result.generalError(location, message));
      }
    }

    return true;
  }
}
