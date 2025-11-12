// typescript
/*
 * Copyright 2025 The Backstage Authors
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

import { getExporter } from './exporterRegistry';
import { CsvExporter } from './csv';
import { JsonExporter } from './json';
import { ExportFormat } from '../types';

describe('exporterRegistry', () => {
  it('returns CsvExporter for CSV format', () => {
    const exporter = getExporter(ExportFormat.CSV);
    expect(exporter).toBeInstanceOf(CsvExporter);
  });

  it('returns JsonExporter for JSON format', () => {
    const exporter = getExporter(ExportFormat.JSON);
    expect(exporter).toBeInstanceOf(JsonExporter);
  });

  it('returns CSVExporter for CSV format', () => {
    const exporter = getExporter(ExportFormat.CSV);
    expect(exporter).toBeInstanceOf(CsvExporter);
  });

  it('throws for unrecognized formats', () => {
    expect(() => getExporter('xml' as unknown as ExportFormat)).toThrow(
      'Unrecognized catalog exporter',
    );
  });

  it('returns the same instance for repeated calls', () => {
    const csv1 = getExporter(ExportFormat.CSV);
    const csv2 = getExporter(ExportFormat.CSV);
    expect(csv1).toBe(csv2);

    const json1 = getExporter(ExportFormat.JSON);
    const json2 = getExporter(ExportFormat.JSON);
    expect(json1).toBe(json2);
  });
});
