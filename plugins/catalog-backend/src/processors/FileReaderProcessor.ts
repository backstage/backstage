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
import { glob, hasMagic } from 'glob';
import path from 'node:path';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorParser,
  processingResult,
} from '@backstage/plugin-catalog-node';

const LOCATION_TYPE = 'file';

// Shared by the glob() call and the hasMagic() check below, so that both agree
// on how to interpret the target. In particular this makes backslashes path
// separators rather than escape characters, on all platforms.
const GLOB_OPTIONS = { windowsPathsNoEscape: true };

/**
 * The leading part of a glob pattern that contains no meta-characters, i.e. the
 * directory that the pattern is rooted in. Returns '.' for patterns that start
 * matching immediately, such as '*.yaml'.
 */
function globRootDir(target: string): string {
  const segments = target.replace(/\\/g, '/').split('/');
  const staticSegments: string[] = [];
  for (const segment of segments) {
    if (hasMagic(segment, GLOB_OPTIONS)) {
      break;
    }
    staticSegments.push(segment);
  }
  // The final segment is a file name rather than a directory, but we only get
  // here when at least one segment was magic, so it is always dropped by the
  // loop above.
  return staticSegments.join('/') || '.';
}

/**
 * Whether a target that matched no files at all should be reported as a
 * not-found error.
 *
 * Concrete paths always are. Glob patterns are only reported when the directory
 * that the pattern is rooted in is missing as well, because that points at a
 * misconfigured target. A pattern such as './components/*.yaml' whose directory
 * does exist but has no matching files in it is not an error - there just
 * aren't any entities there (yet).
 */
async function isMissingTarget(target: string): Promise<boolean> {
  if (!hasMagic(target, GLOB_OPTIONS)) {
    return true;
  }
  return !(await fs.pathExists(globRootDir(target)));
}

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
      const fileMatches = await glob(location.target, GLOB_OPTIONS);

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
      } else if (!optional && (await isMissingTarget(location.target))) {
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
