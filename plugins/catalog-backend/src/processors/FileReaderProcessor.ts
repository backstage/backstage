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

import fs from 'fs-extra';
import g from 'glob';
import path from 'path';
import { promisify } from 'util';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorParser,
  processingResult,
} from '@backstage/plugin-catalog-node';

const glob = promisify(g);

const LOCATION_TYPE = 'file';

/** @public */
export class FileReaderProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'FileReaderProcessor';
  }

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: CatalogProcessorEmit,
    parser: CatalogProcessorParser,
  ): Promise<boolean> {
    if (location.type !== LOCATION_TYPE) {
      return false;
    }

    try {
      const fileMatches = await glob(location.target);

      if (fileMatches.length > 0) {
        for (const fileMatch of fileMatches) {
          const data = await fs.readFile(fileMatch);
          const normalizedFilePath = path.normalize(fileMatch);

          // The normalize converts to native slashes; the glob library returns
          // forward slashes even on windows
          for await (const parseResult of parser({
            data: data,
            location: {
              type: LOCATION_TYPE,
              target: normalizedFilePath,
            },
          })) {
            emit(parseResult);
            emit(
              processingResult.refresh(
                `${LOCATION_TYPE}:${normalizedFilePath}`,
              ),
            );
          }
        }
      } else if (!optional) {
        const message = `${location.type} ${location.target} does not exist`;
        emit(processingResult.notFoundError(location, message));
      }
    } catch (e) {
      const message = `${location.type} ${location.target} could not be read, ${e}`;
      emit(processingResult.generalError(location, message));
    }

    return true;
  }
}
