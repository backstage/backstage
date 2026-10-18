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

import fs from 'node:fs';
import { join } from 'node:path';

/**
 * Removes duplicate import and export statements from TypeScript/JavaScript files.
 * Preserves different import syntaxes, multi-line imports, and code structure.
 *
 * @param filePath - Absolute path to the file to deduplicate
 */
export function deduplicateImports(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const seen = new Set<string>();
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Handle import/export statements
    if (trimmed.startsWith('import ') || trimmed.startsWith('export ')) {
      let fullStatement = line;
      let endIndex = i;

      // Check if multi-line (has { but no })
      if (trimmed.includes('{') && !trimmed.includes('}')) {
        // Collect full multi-line statement
        while (endIndex < lines.length && !lines[endIndex].includes('}')) {
          endIndex++;
        }
        if (endIndex < lines.length) {
          fullStatement = lines.slice(i, endIndex + 1).join('\n');
        }
      }

      // Normalize for comparison (remove comments, extra spaces)
      const normalized = fullStatement
        .replace(/\/\/.*$/gm, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!seen.has(normalized)) {
        seen.add(normalized);
        // Add all lines of the statement
        for (let j = i; j <= endIndex; j++) {
          result.push(lines[j]);
        }
      }

      i = endIndex + 1;
    } else {
      result.push(line);
      i++;
    }
  }

  fs.writeFileSync(filePath, result.join('\n'));
}

/**
 * Removes duplicate import and export statements from all TypeScript files in
 * a directory, including files in nested directories.
 *
 * @param dirPath - Absolute path to the directory to process
 */
export function deduplicateImportsInDirectory(dirPath: string): void {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      deduplicateImportsInDirectory(entryPath);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      deduplicateImports(entryPath);
    }
  }
}
