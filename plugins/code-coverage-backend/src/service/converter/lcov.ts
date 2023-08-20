/*
 * Copyright 2021 The Backstage Authors
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
import { FileEntry } from '../types';
import { Logger } from 'winston';
import { Converter } from './Converter';

export class Lcov implements Converter {
  constructor(readonly logger: Logger) {
    this.logger = logger;
  }

  convert(raw: string, scmFiles: string[]): FileEntry[] {
    const lines = raw.split(/\r?\n/);
    const jscov: Array<FileEntry> = [];
    let currentFile: FileEntry | null = null;

    lines.forEach(line => {
      // If the line starts with SF, it's a new file
      if (/^SF:/.test(line)) {
        const coverageFilename = line.replace(/^SF:/, '');
        const filename = scmFiles
          .map(f => f.trimEnd())
          .find(f => coverageFilename.endsWith(f));

        this.logger.debug(`matched ${coverageFilename} to ${currentFile}`);

        if (filename) {
          currentFile = {
            filename,
            lineHits: {},
            branchHits: {},
          };
        }

        // If the line starts with DA, it's a line hit
      } else if (currentFile && /^DA:/.test(line)) {
        const [, lineNumber, hits] = line.split(/[,:]+/);
        currentFile.lineHits[Number(lineNumber)] = Number(hits);

        // If the line starts with BRDA, it's a branch
      } else if (currentFile && /^BRDA:/.test(line)) {
        const [, lineNumber, , , hits] = line.split(/[,:]+/);
        const isHit = Number(hits) > 0;

        if (!currentFile.branchHits[Number(lineNumber)]) {
          currentFile.branchHits[Number(lineNumber)] = {
            covered: isHit ? 1 : 0,
            available: 1,
            missed: isHit ? 0 : 1,
          };
        } else {
          currentFile.branchHits[Number(lineNumber)].available += 1;
          currentFile.branchHits[Number(lineNumber)].covered += isHit ? 1 : 0;
          currentFile.branchHits[Number(lineNumber)].missed += isHit ? 0 : 1;
        }

        // If the line starts with end_of_record, it's the end of current file
      } else if (currentFile && /^end_of_record/.test(line)) {
        jscov.push(currentFile);
        currentFile = null;
      }
    });

    return jscov;
  }
}
