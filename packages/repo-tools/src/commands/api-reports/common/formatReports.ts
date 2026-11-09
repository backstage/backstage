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

import fs from 'fs-extra';
import { formatFiles } from '../../../lib/formatFiles';

/**
 * A report that has been written to its final path and formatted there.
 */
export interface FormattedReport {
  path: string;
  /** The content of the report before it was written, if it existed */
  existing: string | undefined;
  formatted: string;
}

async function readExisting(path: string): Promise<string | undefined> {
  try {
    return await fs.readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

/**
 * Puts a report back the way it was before {@link formatReports} wrote it.
 */
export async function restoreReport(report: {
  path: string;
  existing: string | undefined;
}): Promise<void> {
  if (report.existing === undefined) {
    await fs.remove(report.path);
  } else {
    await fs.writeFile(report.path, report.existing);
  }
}

/**
 * Writes generated reports to their final paths and formats them all in a
 * single batch with the formatter of the project.
 *
 * @remarks
 *
 * Committed reports are usually listed in the ignore file of the formatter,
 * so that formatting the whole project leaves them alone. They are formatted
 * regardless, since their paths are passed explicitly.
 *
 * The previous content of each report is returned, so that the caller can
 * restore it if the new report should not be kept. If formatting fails, all
 * reports are restored before the error is thrown.
 */
export async function formatReports(
  reports: Array<{ path: string; content: string }>,
): Promise<FormattedReport[]> {
  const existing = await Promise.all(
    reports.map(report => readExisting(report.path)),
  );

  try {
    await Promise.all(
      reports.map(report => fs.writeFile(report.path, report.content)),
    );
    await formatFiles(
      reports.map(report => report.path),
      { includeIgnored: true },
    );
    const formatted = await Promise.all(
      reports.map(report => fs.readFile(report.path, 'utf8')),
    );
    return reports.map((report, index) => ({
      path: report.path,
      existing: existing[index],
      formatted: formatted[index],
    }));
  } catch (error) {
    await Promise.all(
      reports.map((report, index) =>
        restoreReport({ path: report.path, existing: existing[index] }),
      ),
    );
    throw error;
  }
}
