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

/**
 * Counts the warnings in a raw Oxlint report, so that warning thresholds can
 * be enforced across a whole run rather than per config group.
 *
 * @param format - The Oxlint output format the report was produced with
 * @param output - The raw Oxlint report
 * @returns The warning count, or undefined when the report does not expose it
 */
export function countWarnings(
  format: string,
  output: string,
): number | undefined {
  if (!output.trim()) {
    return 0;
  }
  switch (format) {
    case 'json': {
      let report: unknown;
      try {
        report = JSON.parse(output);
      } catch {
        return undefined;
      }
      const diagnostics = (report as { diagnostics?: unknown })?.diagnostics;
      if (!Array.isArray(diagnostics)) {
        return undefined;
      }
      return diagnostics.filter(
        diagnostic =>
          (diagnostic as { severity?: unknown })?.severity === 'warning',
      ).length;
    }
    case 'sarif': {
      let report: unknown;
      try {
        report = JSON.parse(output);
      } catch {
        return undefined;
      }
      const runs = (report as { runs?: unknown })?.runs;
      if (!Array.isArray(runs)) {
        return undefined;
      }
      return runs.reduce((total, run) => {
        const results = (run as { results?: unknown })?.results;
        return Array.isArray(results)
          ? total +
              results.filter(
                result => (result as { level?: unknown })?.level === 'warning',
              ).length
          : total;
      }, 0);
    }
    case 'gitlab': {
      let report: unknown;
      try {
        report = JSON.parse(output);
      } catch {
        return undefined;
      }
      if (!Array.isArray(report)) {
        return undefined;
      }
      // The GitLab Code Quality formatter maps lint warnings to "major".
      return report.filter(
        issue => (issue as { severity?: unknown })?.severity === 'major',
      ).length;
    }
    case 'checkstyle': {
      const matches = output.match(/severity="warning"/g);
      return matches ? matches.length : 0;
    }
    case 'junit':
      // The JUnit formatter does not represent warnings.
      return 0;
    case 'default':
    case 'github': {
      // Both formatters print a "Found N warnings and M errors." summary.
      const match = /Found (\d+) warnings? and \d+ errors?/.exec(output);
      return match ? Number(match[1]) : undefined;
    }
    case 'stylish': {
      const match = /\(\d+ errors?, (\d+) warnings?\)/.exec(output);
      return match ? Number(match[1]) : undefined;
    }
    case 'unix': {
      // Each diagnostic line ends with a "[Error/...]" or "[Warning/...]" tag.
      const matches = output.match(/ \[Warning\//g);
      return matches ? matches.length : 0;
    }
    default:
      return undefined;
  }
}
