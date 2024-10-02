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

import { readdir, stat } from 'fs-extra';
import { join, relative } from 'path';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { examples } from './log.examples';
import fs from 'fs';
import { z } from 'zod';

const id = 'debug:log';

/**
 * Writes a message into the log or lists all files in the workspace
 *
 * @remarks
 *
 * This task is useful for local development and testing of both the scaffolder
 * and scaffolder templates.
 *
 * @public
 */
export function createDebugLogAction() {
  return createTemplateAction<{
    message?: string;
    listWorkspace?: boolean | 'with-filenames' | 'with-contents';
  }>({
    id,
    description:
      'Writes a message into the log and/or lists all files in the workspace.',
    examples,
    schema: {
      input: z.object({
        message: z.string({ description: 'Message to output.' }).optional(),
        listWorkspace: z
          .union([z.boolean(), z.enum(['with-filenames', 'with-contents'])], {
            description:
              'List all files in the workspace. If used with "with-contents", also the file contents are listed.',
          })
          .optional(),
      }),
    },
    supportsDryRun: true,
    async handler(ctx) {
      ctx.logger.info(JSON.stringify(ctx.input, null, 2));

      if (ctx.input?.message) {
        ctx.logger.info(ctx.input.message);
      }

      if (ctx.input?.listWorkspace) {
        const files = await recursiveReadDir(ctx.workspacePath);
        ctx.logger.info(
          `Workspace:\n${files
            .map(f => {
              const relativePath = relative(ctx.workspacePath, f);
              if (ctx.input?.listWorkspace === 'with-contents') {
                const content = fs.readFileSync(f, 'utf-8');
                return ` - ${relativePath}:\n\n  ${content}`;
              }
              return `  - ${relativePath}`;
            })
            .join('\n')}`,
        );
      }
    },
  });
}

export async function recursiveReadDir(dir: string): Promise<string[]> {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async subdir => {
      const res = join(dir, subdir);
      return (await stat(res)).isDirectory() ? recursiveReadDir(res) : [res];
    }),
  );
  return files.reduce((a, f) => a.concat(f), []);
}
