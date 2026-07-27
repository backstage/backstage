/*
 * Copyright 2026 The Backstage Authors
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
import { PassThrough, Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import stringify from 'csv-stringify';
import { ExportActivityRow, ExportPageRow } from './types';

export type ExportDataset = 'activity' | 'pages';

const columns = {
  activity: [
    'eventId',
    'occurredAt',
    'userEntityRef',
    'sessionId',
    'action',
    'subject',
    'value',
    'pluginId',
    'extensionId',
    'currentPath',
    'previousPath',
  ],
  pages: [
    'path',
    'pageViews',
    'uniqueUsers',
    'estimatedDurationSeconds',
    'lastViewedAt',
  ],
} as const;

export function encodeCsvCell(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  return beginsWithSpreadsheetTrigger(value) ? `'${value}` : value;
}

export function createCsvExport(
  dataset: 'activity',
  rows: Iterable<ExportActivityRow> | AsyncIterable<ExportActivityRow>,
): Readable;
export function createCsvExport(
  dataset: 'pages',
  rows: Iterable<ExportPageRow> | AsyncIterable<ExportPageRow>,
): Readable;
export function createCsvExport(
  dataset: ExportDataset,
  rows:
    | Iterable<ExportActivityRow | ExportPageRow>
    | AsyncIterable<ExportActivityRow | ExportPageRow>,
): Readable;
export function createCsvExport(
  dataset: ExportDataset,
  rows:
    | Iterable<ExportActivityRow | ExportPageRow>
    | AsyncIterable<ExportActivityRow | ExportPageRow>,
): Readable {
  const project = new Transform({
    objectMode: true,
    transform(row, _encoding, callback) {
      try {
        callback(
          null,
          dataset === 'activity'
            ? projectActivity(row as ExportActivityRow)
            : projectPage(row as ExportPageRow),
        );
      } catch (error) {
        callback(error as Error);
      }
    },
  });

  const output = new PassThrough();
  void pipeline(
    Readable.from(rows),
    project,
    stringify({
      header: true,
      columns: [...columns[dataset]],
      record_delimiter: '\n',
    }),
    output,
  ).catch(error => output.destroy(error));
  return output;
}

function projectActivity(row: ExportActivityRow) {
  return {
    eventId: encodeCsvCell(row.eventId),
    occurredAt: encodeCsvCell(row.occurredAt),
    userEntityRef: encodeCsvCell(row.userEntityRef),
    sessionId: encodeCsvCell(row.sessionId),
    action: encodeCsvCell(row.action),
    subject: encodeCsvCell(row.subject),
    value: row.value ?? '',
    pluginId: encodeCsvCell(row.pluginId),
    extensionId: encodeCsvCell(row.extensionId),
    currentPath: encodeCsvCell(row.currentPath),
    previousPath: encodeCsvCell(row.previousPath),
  };
}

function projectPage(row: ExportPageRow) {
  return {
    path: encodeCsvCell(row.path),
    pageViews: row.pageViews,
    uniqueUsers: row.uniqueUsers,
    estimatedDurationSeconds: row.estimatedDurationSeconds,
    lastViewedAt: encodeCsvCell(row.lastViewedAt),
  };
}

function beginsWithSpreadsheetTrigger(value: string): boolean {
  return /^['\t\r\n]/.test(value) || /^[\t\r\n ]*[=+\-@]/.test(value);
}
