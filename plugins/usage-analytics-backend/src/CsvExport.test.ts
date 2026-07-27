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
import { createCsvExport, encodeCsvCell } from './CsvExport';

async function read(source: NodeJS.ReadableStream): Promise<string> {
  const chunks = [];
  for await (const chunk of source) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

function decodeCsvCell(value: string): string {
  const suffix = value.slice(1);
  return value.startsWith("'") && encodeCsvCell(suffix) === value
    ? suffix
    : value;
}

describe('CsvExport', () => {
  it('emits stable headers for empty datasets', async () => {
    await expect(read(createCsvExport('activity', []))).resolves.toBe(
      'eventId,occurredAt,userEntityRef,sessionId,action,subject,value,pluginId,extensionId,currentPath,previousPath\n',
    );
    await expect(read(createCsvExport('pages', []))).resolves.toBe(
      'path,pageViews,uniqueUsers,estimatedDurationSeconds,lastViewedAt\n',
    );
  });

  it('serializes values, absent cells, quoting, and LF records', async () => {
    await expect(
      read(
        createCsvExport('activity', [
          {
            eventId: 'event-1',
            occurredAt: '2026-07-18T00:30:00.000Z',
            userEntityRef: 'user:default/alice',
            sessionId: 'session-1',
            action: 'navigate',
            subject: 'comma, quote " and\r\nnewline',
            value: 12.5,
            pluginId: '',
            currentPath: '/café',
          },
        ]),
      ),
    ).resolves.toBe(
      'eventId,occurredAt,userEntityRef,sessionId,action,subject,value,pluginId,extensionId,currentPath,previousPath\n' +
        'event-1,2026-07-18T00:30:00.000Z,user:default/alice,session-1,navigate,"comma, quote "" and\r\nnewline",12.5,,,/café,\n',
    );
  });

  it.each([
    '=SUM(A1:A2)',
    '+1',
    '-1',
    '@cmd',
    ' =formula',
    '\t=tabbed',
    '\r@carriage',
    '\n+newline',
    "'literal",
    "''literal",
  ])('reversibly neutralizes %p', original => {
    const encoded = encodeCsvCell(original);
    expect(encoded).not.toBe(original);
    expect(decodeCsvCell(encoded)).toBe(original);
  });

  it('does not change safe strings or absent values', () => {
    expect(encodeCsvCell('hello')).toBe('hello');
    expect(encodeCsvCell('')).toBe('');
    expect(encodeCsvCell(undefined)).toBe('');
    expect(encodeCsvCell(null)).toBe('');
  });

  it('propagates source failures', async () => {
    async function* failingSource() {
      yield {
        path: '/ok',
        pageViews: 1,
        uniqueUsers: 1,
        estimatedDurationSeconds: 0,
        lastViewedAt: '2026-07-18T00:30:00.000Z',
      };
      throw new Error('database failed');
    }

    await expect(
      read(createCsvExport('pages', failingSource())),
    ).rejects.toThrow('database failed');
  });
});
