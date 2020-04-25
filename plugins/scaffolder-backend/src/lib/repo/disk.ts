/*
 * Copyright 2020 Spotify AB
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

import glob from 'glob';
import { promises as fs } from 'fs';
import { logger } from 'lib/logger';
import { Template, RepositoryBase as Base } from '.';

export class DiskRepository implements Base {
  private repository: Template[] = [];

  constructor(private repoDir = `${__dirname}/templates`) {
    this.reindex();
  }

  public async list(): Promise<Template[]> {
    return this.repository;
  }

  public async reindex(): Promise<void> {
    this.repository = await this.index();
  }

  public async prepare(template: string): Promise<string> {
    return template;
  }

  private async index(): Promise<Template[]> {
    return new Promise((resolve, reject) => {
      glob(`${this.repoDir}/**/template-info.json`, async (err, matches) => {
        if (err) {
          reject(err);
        }

        const fileContents: Array<{
          path: string;
          contents: string;
        }> = await Promise.all(
          matches.map(async (path: string) => ({
            path,
            contents: await fs.readFile(path, 'utf-8'),
          })),
        );

        const validFiles = fileContents.reduce(
          (templates: Template[], currentFile) => {
            try {
              const parsed: Template = JSON.parse(currentFile.contents);
              return [...templates, parsed];
            } catch (ex) {
              logger.error('Failure parsing JSON for template', {
                path: currentFile.path,
              });
            }

            return templates;
          },
          [],
        );

        resolve(validFiles as Template[]);
      });
    });
  }
}

export const Repository = new DiskRepository();
