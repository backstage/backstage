/*
 * Copyright 2024 The Backstage Authors
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
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import fs from 'node:fs/promises';
import path from 'node:path';
import { z as zod } from 'zod';
import { examples } from './read.examples';

const contentSchema = (z: typeof zod) =>
  z.object({
    name: z.string().describe('Name of the file or directory'),
    path: z
      .string()
      .describe('path to the file or directory relative to the workspace'),
    fullPath: z.string().describe('full path to the file or directory'),
  });

type Content = zod.infer<ReturnType<typeof contentSchema>>;

/**
 * Creates new action that enables reading directories in the workspace.
 * @public
 */
export const createFilesystemReadDirAction = () => {
  return createTemplateAction({
    id: 'fs:readdir',
    description: 'Reads files and directories from the workspace',
    supportsDryRun: true,
    examples,
    schema: {
      input: {
        paths: z => z.array(z.string().min(1)),
        recursive: z => z.boolean().default(false),
      },
      output: {
        files: z => z.array(contentSchema(z)),
        folders: z => z.array(contentSchema(z)),
      },
    },
    async handler(ctx) {
      const files: Content[] = [];
      const folders: Content[] = [];

      for (const localPath of ctx.input.paths) {
        const fullWorkspacePath = resolveSafeChildPath(
          ctx.workspacePath,
          localPath,
        );
        const content = await fs.readdir(fullWorkspacePath, {
          recursive: ctx.input.recursive,
          withFileTypes: true,
        });
        for (const dirent of content) {
          const fullPath = path.join(dirent.parentPath, dirent.name);
          const element = {
            name: dirent.name,
            path: path.relative(ctx.workspacePath, fullPath),
            fullPath,
          };
          if (dirent.isDirectory()) {
            folders.push(element);
          } else {
            files.push(element);
          }
        }
      }

      ctx.output('files', files);
      ctx.output('folders', folders);
    },
  });
};
