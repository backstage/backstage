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

import { Logger } from 'winston';
import { UrlReader } from '@backstage/backend-common';
import { LocationSpec } from '@backstage/catalog-model';
import * as result from './results';
import { LocationProcessor, LocationProcessorEmit } from './types';

// TODO(Rugvip): Added for backwards compatibility when moving to UrlReader, this
// can be removed in a bit
const deprecatedTypes = [
  'github',
  'github/api',
  'bitbucket/api',
  'gitlab/api',
  'azure/api',
];

type Options = {
  reader: UrlReader;
  logger: Logger;
};

export class UrlReaderProcessor implements LocationProcessor {
  constructor(private readonly options: Options) {}

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    if (deprecatedTypes.includes(location.type)) {
      // TODO(Rugvip): Let's not enable this warning yet, as we want to move over the example YAMLs
      //               in this repo to use the 'url' type first.
      // this.options.logger.warn(
      //   `Using deprecated location type '${location.type}' for '${location.target}', use 'url' instead`,
      // );
    } else if (location.type !== 'url') {
      return false;
    }

    try {
      const data = await this.options.reader.read(location.target);
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
