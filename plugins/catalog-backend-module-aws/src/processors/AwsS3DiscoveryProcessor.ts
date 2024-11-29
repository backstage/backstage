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

import { UrlReaderService } from '@backstage/backend-plugin-api';
import { isError } from '@backstage/errors';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorParser,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import limiterFactory from 'p-limit';

/**
 * A processor for automatic discovery of entities from S3 buckets. Handles the
 * `s3-discovery` location type, and target bucket URLs e.g. on the form
 * `https://testbucket.s3.us-east-2.amazonaws.com`.
 *
 * @public
 * @deprecated Use the `AwsS3EntityProvider` instead (see https://github.com/backstage/backstage/blob/master/plugins/catalog-backend-module-aws/CHANGELOG.md#014).
 */
export class AwsS3DiscoveryProcessor implements CatalogProcessor {
  constructor(private readonly reader: UrlReaderService) {}

  getProcessorName(): string {
    return 'AwsS3DiscoveryProcessor';
  }

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: CatalogProcessorEmit,
    parser: CatalogProcessorParser,
  ): Promise<boolean> {
    if (location.type !== 's3-discovery') {
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

      if (isError(error) && error.name === 'NotFoundError') {
        if (!optional) {
          emit(processingResult.notFoundError(location, message));
        }
      } else {
        emit(processingResult.generalError(location, message));
      }
    }
    return true;
  }

  private async doRead(
    location: string,
  ): Promise<{ data: Buffer; url: string }[]> {
    const limiter = limiterFactory(5);
    const response = await this.reader.readTree(location);
    const responseFiles = await response.files();
    const output = responseFiles.map(async file => ({
      url: file.path,
      data: await limiter(file.content),
    }));
    return Promise.all(output);
  }
}
