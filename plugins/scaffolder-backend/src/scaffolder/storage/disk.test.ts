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
import { DiskStorage } from './disk';
import * as path from 'path';

describe('Disk Storage', () => {
  it('should load a simple template from a simple directory', async () => {
    const testTemplateDir = path.resolve(
      __dirname,
      '../../../test/mock-simple-template-dir',
    );
    const templateInfo = require(`${testTemplateDir}/mock-template/template-info.json`);

    const repository = new DiskStorage({ directory: testTemplateDir });

    await repository.reindex();

    const templates = await repository.list();

    expect(templates).toHaveLength(1);
    expect(templates[0].id).toBe(templateInfo.id);
    expect(templates[0].name).toBe(templateInfo.name);
    expect(templates[0].description).toBe(templateInfo.description);
    expect(templates[0].ownerId).toBe(templateInfo.ownerId);
  });

  it('should successfully load multiple templates from the same folder', async () => {
    const testTemplateDir = path.resolve(
      __dirname,
      '../../../test/mock-multiple-templates-dir',
    );

    const repository = new DiskStorage({ directory: testTemplateDir });

    await repository.reindex();

    const templates = await repository.list();

    expect(templates).toHaveLength(2);
  });

  it('should return empty array when there are no templates', async () => {
    const testTemplateDir = path.resolve(
      __dirname,
      '/some-folder-that-deffo-does-not-exist',
    );

    const repository = new DiskStorage({ directory: testTemplateDir });

    await repository.reindex();

    const templates = await repository.list();

    expect(templates).toHaveLength(0);
  });

  it('should be able to handle templates with invalid json and ignore them from the returned array', async () => {
    const testTemplateDir = path.resolve(
      __dirname,
      '../../../test/mock-failing-template-dir',
    );

    const repository = new DiskStorage({ directory: testTemplateDir });

    await repository.reindex();

    const templates = await repository.list();

    expect(templates).toHaveLength(1);
  });
});
