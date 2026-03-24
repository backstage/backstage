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

import fs from 'fs-extra';
import { MARKER_START, MARKER_END } from './generateIndex';

/**
 * Inject generated index content into a target file between markers.
 * If markers exist, replace content between them (idempotent).
 * If markers do not exist, append to end of file.
 * If file does not exist, create it.
 */
export async function injectIntoFile(
  filePath: string,
  generatedContent: string,
): Promise<{ created: boolean; updated: boolean }> {
  const exists = await fs.pathExists(filePath);

  if (!exists) {
    await fs.writeFile(filePath, `${generatedContent}\n`, 'utf8');
    return { created: true, updated: false };
  }

  const existing = await fs.readFile(filePath, 'utf8');

  const startIdx = existing.indexOf(MARKER_START);
  const endIdx =
    startIdx !== -1
      ? existing.indexOf(MARKER_END, startIdx + MARKER_START.length)
      : -1;

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const before = existing.substring(0, startIdx);
    const after = existing.substring(endIdx + MARKER_END.length);
    const newContent = `${before}${generatedContent}${after}`;
    await fs.writeFile(filePath, newContent, 'utf8');
    return { created: false, updated: true };
  }

  const separator = existing.endsWith('\n') ? '\n' : '\n\n';
  await fs.writeFile(
    filePath,
    `${existing}${separator}${generatedContent}\n`,
    'utf8',
  );
  return { created: false, updated: true };
}
