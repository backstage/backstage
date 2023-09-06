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

  /**
   * convert lcov into shared json coverage format
   *
   * @param raw - raw lcov report
   * @param scmFiles - list of files that are committed to SCM
   */
  convert(raw: string, scmFiles: string[]): FileEntry[] {
    const lines = raw.split(/\r?\n/);
    const jscov: Array<FileEntry> = [];
    let currentFile: FileEntry | null = null;

    lines.forEach(line => {
      const [section, value] = line.split(':');

      switch (section) {
        // If the line starts with SF, it's a new file
        case 'SF':
          currentFile = this.processNewFile(value, scmFiles);
          break;
        // If the line starts with DA, it's a line hit
        case 'DA':
          this.processLineHit(currentFile, value);
          break;
        // If the line starts with BRDA, it's a branch line
        case 'BRDA':
          this.processBranchHit(currentFile, value);
          break;
        // If the line starts with end_of_record, it's the end of current file
        case 'end_of_record':
          if (currentFile) {
            jscov.push(currentFile);
            currentFile = null;
          }
          break;
        default:
          break;
      }
    });

    return jscov;
  }

  /**
   * Parses a new file entry
   *
   * @param file - file name from coverage report
   * @param scmFiles - list of files that are committed to SCM
   */
  private processNewFile(file: string, scmFiles: string[]): FileEntry | null {
    const filename = scmFiles.map(f => f.trimEnd()).find(f => file.endsWith(f));

    this.logger.debug(`matched ${file} to ${filename}`);

    if (scmFiles.length === 0 || filename) {
      return {
        filename: filename || file,
        lineHits: {},
        branchHits: {},
      };
    }

    return null;
  }

  /**
   * Parses line coverage information
   *
   * @param currentFile - current file entry
   * @param value - line coverage information
   */
  private processLineHit(currentFile: FileEntry | null, value: string): void {
    if (!currentFile) return;

    const [lineNumber, hits] = value.split(',');
    currentFile.lineHits[Number(lineNumber)] = Number(hits);
  }

  /**
   * Parses branch coverage information
   *
   * @param currentFile - current file entry
   * @param value - branch coverage information
   */
  private processBranchHit(currentFile: FileEntry | null, value: string): void {
    if (!currentFile) return;

    const [lineNumber, , , hits] = value.split(',');
    const lineNumberNum = Number(lineNumber);
    const isHit = Number(hits) > 0;
    const branch = currentFile.branchHits[lineNumberNum] || {
      covered: 0,
      available: 0,
      missed: 0,
    };

    branch.available++;
    branch.covered += isHit ? 1 : 0;
    branch.missed += isHit ? 0 : 1;

    currentFile.branchHits[lineNumberNum] = branch;
  }
}
