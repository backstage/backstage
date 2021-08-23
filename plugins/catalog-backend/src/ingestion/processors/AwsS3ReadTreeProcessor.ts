/*
 * Copyright 2020 The Backstage Authors
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
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorParser,
} from './types';

export class AwsS3ReadTreeProcessor implements CatalogProcessor {
  constructor(private readonly reader: UrlReader) {}

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: CatalogProcessorEmit,
    parser: CatalogProcessorParser,
  ): Promise<boolean> {
    if (location.type !== 's3-bucket') {
      return false;
    }

    try {
      const output = await this.doRead(location.target);
      for (const item of output) {
        for await (const parseResult of parser({
          data: item.data,
          location: { type: location.type, target: item.url },
        })) {
          emit(parseResult);
        }
      }
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

  private async doRead(
    location: string,
  ): Promise<{ data: Buffer; url: string }[]> {
    const response = await this.reader.readTree(location);
    const responseFiles = await response.files();
    const output = responseFiles.map(async file => ({
      url: file.path,
      data: await file.content(),
    }));
    return Promise.all(output);
  }
}
