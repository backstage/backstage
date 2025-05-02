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

import { resolvePackagePath } from '@backstage/backend-plugin-api';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { ScmIntegrations } from '@backstage/integration';
import {
  ActionContext,
  TemplateAction,
} from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import fs from 'fs-extra';
import { join as joinPath, sep as pathSep } from 'path';
import { createWorkspaceTemplateAction } from './workspaceTemplate';
import { TemplateActionInput } from './templateActionHandler';

type WorkspaceTemplateInput = TemplateActionInput & {
  sourcePath: string;
};

const aBinaryFile = fs.readFileSync(
  resolvePackagePath(
    '@backstage/plugin-scaffolder-backend',
    'fixtures/test-nested-template/public/react-logo192.png',
  ),
);

describe('workspace:template', () => {
  let action: TemplateAction<any, any, 'v2'>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');

  const mockContext = (inputPatch: Partial<WorkspaceTemplateInput> = {}) =>
    createMockActionContext({
      templateInfo: {
        baseUrl: 'base-url',
        entityRef: 'template:default/test-template',
      },
      input: {
        sourcePath: './skeleton',
        targetPath: './target',
        values: {
          test: 'value',
        },
        ...inputPatch,
      },
      workspacePath,
    });

  beforeEach(() => {
    mockDir.setContent({
      workspace: {},
    });
    action = createWorkspaceTemplateAction({
      integrations: Symbol('Integrations') as unknown as ScmIntegrations,
    });
  });

  it(`returns a TemplateAction with the id 'workspace:template'`, () => {
    expect(action.id).toEqual('workspace:template');
  });

  describe('handler', () => {
    it('throws if output directory is outside the workspace', async () => {
      await expect(() =>
        action.handler(mockContext({ targetPath: '../' })),
      ).rejects.toThrow(
        /relative path is not allowed to refer to a directory outside its parent/i,
      );
    });

    it('throws if cookiecutterCompat is used with extension', async () => {
      await expect(() =>
        action.handler(
          mockContext({
            cookiecutterCompat: true,
            templateFileExtension: true,
          }),
        ),
      ).rejects.toThrow(
        /input extension incompatible with copyWithoutRender\/copyWithoutTemplating and cookiecutterCompat/,
      );
    });

    it('throws if targetPath overlaps sourcePath', async () => {
      await expect(() =>
        action.handler(
          mockContext({
            sourcePath: '.',
          }),
        ),
      ).rejects.toThrow('targetPath must not be within template path');
    });

    describe('with optional directories / files', () => {
      let context: ActionContext<WorkspaceTemplateInput>;

      beforeEach(async () => {
        context = mockContext({
          values: {
            showDummyFile: false,
            skipRootDirectory: true,
            skipSubdirectory: true,
            skipMultiplesDirectories: true,
            skipFileInsideDirectory: true,
          },
        });

        mockDir.setContent({
          workspace: {
            skeleton: {
              '{% if values.showDummyFile %}dummy-file.txt{% else %}{% endif %}':
                'dummy file',
              '${{ "dummy-file2.txt" if values.showDummyFile else "" }}':
                'some dummy file',
              '${{ "dummy-dir" if not values.skipRootDirectory else "" }}': {
                'file.txt': 'file inside optional directory',
                subdir: {
                  '${{ "dummy-subdir" if not values.skipSubdirectory else "" }}':
                    'file inside optional subdirectory',
                },
              },
              subdir2: {
                '${{ "dummy-subdir" if not values.skipMultiplesDirectories else "" }}':
                  {
                    '${{ "dummy-subdir" if not values.skipMultiplesDirectories else "" }}':
                      {
                        'multipleDirectorySkippedFile.txt':
                          'file inside multiple optional subdirectories',
                      },
                  },
              },
              subdir3: {
                '${{ "fileSkippedInsideDirectory.txt" if not values.skipFileInsideDirectory else "" }}':
                  'skipped file inside directory',
              },
            },
          },
        });

        await action.handler(context);
      });

      it('skips empty filename', async () => {
        await expect(
          fs.pathExists(`${workspacePath}/target/dummy-file.txt`),
        ).resolves.toEqual(false);
      });

      it('skips empty filename syntax #2', async () => {
        await expect(
          fs.pathExists(`${workspacePath}/target/dummy-file2.txt`),
        ).resolves.toEqual(false);
      });

      it('skips empty directory', async () => {
        await expect(
          fs.pathExists(`${workspacePath}/target/dummy-dir/dummy-file3.txt`),
        ).resolves.toEqual(false);
      });

      it('skips empty filename inside directory', async () => {
        await expect(
          fs.pathExists(
            `${workspacePath}/target/subdir3/fileSkippedInsideDirectory.txt`,
          ),
        ).resolves.toEqual(false);
      });

      it('skips content of empty subdirectory', async () => {
        await expect(
          fs.pathExists(
            `${workspacePath}/target/subdir2/multipleDirectorySkippedFile.txt`,
          ),
        ).resolves.toEqual(false);

        await expect(
          fs.pathExists(
            `${workspacePath}/target/subdir2/dummy-subdir/dummy-subdir/multipleDirectorySkippedFile.txt`,
          ),
        ).resolves.toEqual(false);
      });
    });

    describe('with valid input', () => {
      let context: ActionContext<WorkspaceTemplateInput>;

      beforeEach(async () => {
        context = mockContext({
          values: {
            name: 'test-project',
            count: 1234,
            itemList: ['first', 'second', 'third'],
            showDummyFile: false,
          },
        });

        mockDir.setContent({
          workspace: {
            skeleton: {
              'empty-dir-${{ values.count }}': {},
              'static.txt': 'static content',
              '${{ values.name }}.txt': 'static content',
              subdir: {
                'templated-content.txt':
                  '${{ values.name }}: ${{ values.count }}',
              },
              '.${{ values.name }}': '${{ values.itemList | dump }}',
              'a-binary-file.png': aBinaryFile,
              'an-executable.sh': ctx =>
                fs.writeFileSync(ctx.path, '#!/usr/bin/env bash', {
                  encoding: 'utf-8',
                  mode: parseInt('100755', 8),
                }),
              symlink: ctx => ctx.symlink('a-binary-file.png'),
              brokenSymlink: ctx => ctx.symlink('./not-a-real-file.txt'),
            },
          },
        });

        await action.handler(context);
      });

      it('copies files with no templating in names or content successfully', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/static.txt`, 'utf-8'),
        ).resolves.toEqual('static content');
      });

      it('copies files with templated names successfully', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/test-project.txt`, 'utf-8'),
        ).resolves.toEqual('static content');
      });

      it('copies files with templated content successfully', async () => {
        await expect(
          fs.readFile(
            `${workspacePath}/target/subdir/templated-content.txt`,
            'utf-8',
          ),
        ).resolves.toEqual('test-project: 1234');
      });

      it('processes dotfiles', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/.test-project`, 'utf-8'),
        ).resolves.toEqual('["first","second","third"]');
      });

      it('copies empty directories', async () => {
        await expect(
          fs.readdir(`${workspacePath}/target/empty-dir-1234`, 'utf-8'),
        ).resolves.toEqual([]);
      });

      it('copies binary files as-is without processing them', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/a-binary-file.png`),
        ).resolves.toEqual(aBinaryFile);
      });

      it('copies files and maintains the original file permissions', async () => {
        await expect(
          fs
            .stat(`${workspacePath}/target/an-executable.sh`)
            .then(fObj => fObj.mode),
        ).resolves.toEqual(parseInt('100755', 8));
      });

      it('copies file symlinks as-is without processing them', async () => {
        await expect(
          fs
            .lstat(`${workspacePath}/target/symlink`)
            .then(i => i.isSymbolicLink()),
        ).resolves.toBe(true);

        await expect(
          fs.realpath(`${workspacePath}/target/symlink`),
        ).resolves.toBe(
          fs.realpathSync(
            joinPath(workspacePath, 'target', 'a-binary-file.png'),
          ),
        );
      });

      it('copies broken symlinks as-is without processing them', async () => {
        await expect(
          fs
            .lstat(`${workspacePath}/target/brokenSymlink`)
            .then(i => i.isSymbolicLink()),
        ).resolves.toBe(true);

        await expect(
          fs.readlink(`${workspacePath}/target/brokenSymlink`),
        ).resolves.toEqual(`.${pathSep}not-a-real-file.txt`);
      });
    });
  });

  describe('copyWithoutTemplating', () => {
    let context: ActionContext<WorkspaceTemplateInput>;

    beforeEach(async () => {
      context = mockContext({
        values: {
          name: 'test-project',
          count: 1234,
        },
        copyWithoutTemplating: ['.unprocessed'],
      });

      mockDir.setContent({
        workspace: {
          skeleton: {
            processed: {
              'templated-content-${{ values.name }}.txt': '${{ values.count }}',
            },
            '.unprocessed': {
              'templated-content-${{ values.name }}.txt': '${{ values.count }}',
            },
          },
        },
      });

      await action.handler(context);
    });

    it('renders path template and ignores content template in files matched in copyWithoutTemplating', async () => {
      await expect(
        fs.readFile(
          `${workspacePath}/target/.unprocessed/templated-content-test-project.txt`,
          'utf-8',
        ),
      ).resolves.toEqual('${{ values.count }}');
    });

    it('processes files not matched in copyWithoutTemplating', async () => {
      await expect(
        fs.readFile(
          `${workspacePath}/target/processed/templated-content-test-project.txt`,
          'utf-8',
        ),
      ).resolves.toEqual('1234');
    });

    describe('with exclusion filter', () => {
      beforeEach(async () => {
        context = mockContext({
          values: {
            name: 'test-project',
            count: 1234,
          },
          copyWithoutTemplating: [
            '.unprocessed',
            '!*/templated-process-content-${{ values.name }}.txt',
          ],
        });

        mockDir.setContent({
          workspace: {
            skeleton: {
              processed: {
                'templated-content-${{ values.name }}.txt':
                  '${{ values.count }}',
              },
              '.unprocessed': {
                'templated-content-${{ values.name }}.txt':
                  '${{ values.count }}',
                'templated-process-content-${{ values.name }}.txt':
                  '${{ values.count }}',
              },
            },
          },
        });

        await action.handler(context);
      });

      it('renders path template including excluded matches in copyWithoutTemplating', async () => {
        await expect(
          fs.readFile(
            `${workspacePath}/target/.unprocessed/templated-process-content-test-project.txt`,
            'utf-8',
          ),
        ).resolves.toEqual('1234');
        await expect(
          fs.readFile(
            `${workspacePath}/target/.unprocessed/templated-content-test-project.txt`,
            'utf-8',
          ),
        ).resolves.toEqual('${{ values.count }}');
      });
    });
  });

  describe('cookiecutter compatibility mode', () => {
    let context: ActionContext<WorkspaceTemplateInput>;

    beforeEach(async () => {
      context = mockContext({
        values: {
          name: 'test-project',
          count: 1234,
          itemList: ['first', 'second', 'third'],
        },
        cookiecutterCompat: true,
      });

      mockDir.setContent({
        workspace: {
          skeleton: {
            '{{ cookiecutter.name }}.txt': 'static content',
            subdir: {
              'templated-content.txt':
                '{{ cookiecutter.name }}: {{ cookiecutter.count }}',
            },
            '{{ cookiecutter.name }}.json':
              '{{ cookiecutter.itemList | jsonify }}',
          },
        },
      });

      await action.handler(context);
    });

    it('copies files with cookiecutter-style templated names successfully', async () => {
      await expect(
        fs.readFile(`${workspacePath}/target/test-project.txt`, 'utf-8'),
      ).resolves.toEqual('static content');
    });

    it('copies files with cookiecutter-style templated content successfully', async () => {
      await expect(
        fs.readFile(
          `${workspacePath}/target/subdir/templated-content.txt`,
          'utf-8',
        ),
      ).resolves.toEqual('test-project: 1234');
    });

    it('includes the jsonify filter', async () => {
      await expect(
        fs.readFile(`${workspacePath}/target/test-project.json`, 'utf-8'),
      ).resolves.toEqual('["first","second","third"]');
    });
  });

  describe('with extension=true', () => {
    let context: ActionContext<WorkspaceTemplateInput>;

    beforeEach(async () => {
      context = mockContext({
        values: {
          name: 'test-project',
          count: 1234,
          itemList: ['first', 'second', 'third'],
        },
        templateFileExtension: true,
      });

      mockDir.setContent({
        workspace: {
          skeleton: {
            'empty-dir-${{ values.count }}': {},
            'static.txt': 'static content',
            '${{ values.name }}.txt': 'static content',
            '${{ values.name }}.txt.jinja2':
              '${{ values.name }}: ${{ values.count }}',
            subdir: {
              'templated-content.txt.njk':
                '${{ values.name }}: ${{ values.count }}',
            },
            '.${{ values.name }}.njk': '${{ values.itemList | dump }}',
            'a-binary-file.png': aBinaryFile,
          },
        },
      });

      await action.handler(context);
    });

    it('copies files with no templating in names or content successfully', async () => {
      await expect(
        fs.readFile(`${workspacePath}/target/static.txt`, 'utf-8'),
      ).resolves.toEqual('static content');
    });

    it('copies files with templated names successfully', async () => {
      await expect(
        fs.readFile(`${workspacePath}/target/test-project.txt`, 'utf-8'),
      ).resolves.toEqual('static content');
    });

    it('copies jinja2 files with templated names successfully', async () => {
      await expect(
        fs.readFile(`${workspacePath}/target/test-project.txt.jinja2`, 'utf-8'),
      ).resolves.toEqual('${{ values.name }}: ${{ values.count }}');
    });

    it('copies files with templated content successfully', async () => {
      await expect(
        fs.readFile(
          `${workspacePath}/target/subdir/templated-content.txt`,
          'utf-8',
        ),
      ).resolves.toEqual('test-project: 1234');
    });

    it('processes dotfiles', async () => {
      await expect(
        fs.readFile(`${workspacePath}/target/.test-project`, 'utf-8'),
      ).resolves.toEqual('["first","second","third"]');
    });

    it('copies empty directories', async () => {
      await expect(
        fs.readdir(`${workspacePath}/target/empty-dir-1234`, 'utf-8'),
      ).resolves.toEqual([]);
    });

    it('copies binary files as-is without processing them', async () => {
      await expect(
        fs.readFile(`${workspacePath}/target/a-binary-file.png`),
      ).resolves.toEqual(aBinaryFile);
    });
  });

  describe('with specified .jinja2 extension', () => {
    let context: ActionContext<WorkspaceTemplateInput>;

    beforeEach(async () => {
      context = mockContext({
        templateFileExtension: '.jinja2',
        values: {
          name: 'test-project',
          count: 1234,
        },
      });

      mockDir.setContent({
        workspace: {
          skeleton: {
            '${{ values.name }}.njk': '${{ values.name }}: ${{ values.count }}',
            '${{ values.name }}.txt.jinja2':
              '${{ values.name }}: ${{ values.count }}',
          },
        },
      });

      await action.handler(context);
    });

    it('does not process .njk files', async () => {
      await expect(
        fs.readFile(`${workspacePath}/target/test-project.njk`, 'utf-8'),
      ).resolves.toEqual('${{ values.name }}: ${{ values.count }}');
    });

    it('does process .jinja2 files', async () => {
      await expect(
        fs.readFile(`${workspacePath}/target/test-project.txt`, 'utf-8'),
      ).resolves.toEqual('test-project: 1234');
    });
  });

  describe('with replacement of existing files', () => {
    let context: ActionContext<WorkspaceTemplateInput>;

    beforeEach(async () => {
      context = mockContext({
        values: {
          name: 'test-project',
          count: 1234,
        },
        replace: true,
      });

      mockDir.setContent({
        workspace: {
          skeleton: {
            'static-content.txt': '${{ values.name }}: ${{ values.count }}',
          },
          target: {
            'static-content.txt': 'static-content',
          },
        },
      });

      await action.handler(context);
    });

    it('overwrites existing file', async () => {
      await expect(
        fs.readFile(`${workspacePath}/target/static-content.txt`, 'utf-8'),
      ).resolves.toEqual('test-project: 1234');
    });
  });

  describe('without replacement of existing files', () => {
    let context: ActionContext<WorkspaceTemplateInput>;

    beforeEach(async () => {
      context = mockContext({
        values: {
          name: 'test-project',
          count: 1234,
        },
        targetPath: './target',
        replace: false,
      });

      mockDir.setContent({
        workspace: {
          skeleton: {
            'static-content.txt': '${{ values.name }}: ${{ values.count }}',
          },
          target: {
            'static-content.txt': 'static-content',
          },
        },
      });

      await action.handler(context);
    });

    it('keeps existing file', async () => {
      await expect(
        fs.readFile(`${workspacePath}/target/static-content.txt`, 'utf-8'),
      ).resolves.toEqual('static-content');
    });
  });
});
