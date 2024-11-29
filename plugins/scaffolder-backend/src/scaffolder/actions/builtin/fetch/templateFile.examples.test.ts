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

import { join as joinPath } from 'path';
import fs from 'fs-extra';
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createFetchTemplateFileAction } from './templateFile';
import {
  ActionContext,
  TemplateAction,
  fetchFile,
} from '@backstage/plugin-scaffolder-node';
import { examples } from './templateFile.examples';
import yaml from 'yaml';
import { createMockDirectory } from '@backstage/backend-test-utils';

jest.mock('@backstage/plugin-scaffolder-node', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-node'),
  fetchFile: jest.fn(),
}));

type FetchTemplateInput = ReturnType<
  typeof createFetchTemplateFileAction
> extends TemplateAction<infer U>
  ? U
  : never;

const mockFetchFile = fetchFile as jest.MockedFunction<typeof fetchFile>;

describe('fetch:template:file examples', () => {
  let action: TemplateAction<any>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');

  const mockContext = (input: any) =>
    createMockActionContext({
      templateInfo: {
        baseUrl: 'base-url',
        entityRef: 'template:default/test-template',
      },
      input,
      workspacePath,
    });

  beforeEach(() => {
    mockDir.clear();
    action = createFetchTemplateFileAction({
      reader: Symbol('UrlReader') as unknown as UrlReaderService,
      integrations: Symbol('Integrations') as unknown as ScmIntegrations,
    });
  });

  describe('handler', () => {
    describe('with valid input', () => {
      let context: ActionContext<FetchTemplateInput>;

      beforeEach(async () => {
        context = mockContext(yaml.parse(examples[0].example).steps[0].input);

        mockFetchFile.mockImplementation(({ outputPath }) => {
          mockDir.setContent({
            [outputPath]:
              '${{ values.name }}: ${{ values.count }} ${{ values.itemList | dump }}',
          });

          return Promise.resolve();
        });

        await action.handler(context);
      });

      it('uses fetchFile to retrieve the template content', () => {
        expect(mockFetchFile).toHaveBeenCalledWith(
          expect.objectContaining({
            baseUrl: context.templateInfo?.baseUrl,
            fetchUrl: context.input.url,
          }),
        );
      });

      it('copies files with no templating in names or content successfully', async () => {
        await expect(
          fs.readFile(
            joinPath(workspacePath, context.input.targetPath),
            'utf-8',
          ),
        ).resolves.toEqual('test-project: 1234 ["first","second","third"]');
      });
    });
  });
});
