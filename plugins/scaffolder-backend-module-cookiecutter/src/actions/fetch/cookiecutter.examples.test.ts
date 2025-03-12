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

import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { ScmIntegrations } from '@backstage/integration';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { createFetchCookiecutterAction } from './cookiecutter';
import { join } from 'path';
import type { ActionContext } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { examples } from './cookiecutter.examples';
import yaml from 'yaml';
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { ContainerRunner } from './ContainerRunner';

const executeShellCommand = jest.fn();
const commandExists = jest.fn();
const fetchContents = jest.fn();

jest.mock('@backstage/plugin-scaffolder-node', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-node'),
  fetchContents: (...args: any[]) => fetchContents(...args),
  executeShellCommand: (...args: any[]) => executeShellCommand(...args),
}));

jest.mock(
  'command-exists',
  () =>
    (...args: any[]) =>
      commandExists(...args),
);

describe('fetch:cookiecutter', () => {
  const mockDir = createMockDirectory({ mockOsTmpDir: true });
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        azure: [
          { host: 'dev.azure.com', token: 'tokenlols' },
          { host: 'myazurehostnotoken.com' },
        ],
      },
    }),
  );

  const mockTmpDir = mockDir.path;

  let mockContext: ActionContext<{
    url: string;
    targetPath?: string;
    values: JsonObject;
    copyWithoutRender?: string[];
    extensions?: string[];
    imageName?: string;
  }>;

  const containerRunner: jest.Mocked<ContainerRunner> = {
    runContainer: jest.fn(),
  };

  const mockReader: UrlReaderService = {
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  const action = createFetchCookiecutterAction({
    integrations,
    containerRunner,
    reader: mockReader,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockContext = createMockActionContext({
      input: {
        url: 'https://google.com/cookie/cutter',
        targetPath: 'something',
        values: {
          help: 'me',
        },
      },
      templateInfo: {
        entityRef: 'template:default/cookiecutter',
        baseUrl: 'somebase',
      },
      workspacePath: mockTmpDir,
    });
    mockDir.setContent({ template: {} });

    commandExists.mockResolvedValue(null);

    // Mock when run container is called it creates some new files in the mock filesystem
    containerRunner.runContainer.mockImplementation(async () => {
      mockDir.setContent({
        'intermediate/testfile.json': '{}',
      });
    });

    // Mock when executeShellCommand is called it creates some new files in the mock filesystem
    executeShellCommand.mockImplementation(async () => {
      mockDir.setContent({
        'intermediate/testfile.json': '{}',
      });
    });
  });

  it(`should ${examples[0].description}`, async () => {
    const input = yaml.parse(examples[0].example).steps[0].input;

    commandExists.mockResolvedValue(false);

    fetchContents.mockImplementation(() => Promise.resolve());

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        reader: mockReader,
        integrations,
        baseUrl: mockContext.templateInfo?.baseUrl,
        fetchUrl: mockContext.input.url,
        outputPath: join(
          mockTmpDir,
          'template',
          "{{cookiecutter and 'contents'}}",
        ),
      }),
    );
    expect(containerRunner.runContainer).toHaveBeenCalled();
  });

  it(`should ${examples[1].description}`, async () => {
    const input = yaml.parse(examples[1].example).steps[0].input;

    commandExists.mockResolvedValue(false);

    fetchContents.mockImplementation(() => Promise.resolve());

    await action.handler({
      ...mockContext,
      input: input,
    });

    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        reader: mockReader,
        integrations,
        baseUrl: mockContext.templateInfo?.baseUrl,
        fetchUrl: mockContext.input.url,
        outputPath: join(
          mockTmpDir,
          'template',
          "{{cookiecutter and 'contents'}}",
        ),
      }),
    );
    expect(containerRunner.runContainer).toHaveBeenCalled();
  });

  it(`should ${examples[2].description}`, async () => {
    const input = yaml.parse(examples[2].example).steps[0].input;

    commandExists.mockResolvedValue(false);

    fetchContents.mockImplementation(() => Promise.resolve());

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        reader: mockReader,
        integrations,
        baseUrl: mockContext.templateInfo?.baseUrl,
        fetchUrl: mockContext.input.url,
        outputPath: join(
          mockTmpDir,
          'template',
          "{{cookiecutter and 'contents'}}",
        ),
      }),
    );

    expect(containerRunner.runContainer).toHaveBeenCalled();
  });

  it(`should ${examples[3].description}`, async () => {
    const input = yaml.parse(examples[3].example).steps[0].input;

    commandExists.mockResolvedValue(false);

    fetchContents.mockImplementation(() => Promise.resolve());

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        reader: mockReader,
        integrations,
        baseUrl: mockContext.templateInfo?.baseUrl,
        fetchUrl: mockContext.input.url,
        outputPath: join(
          mockTmpDir,
          'template',
          "{{cookiecutter and 'contents'}}",
        ),
      }),
    );
    expect(containerRunner.runContainer).toHaveBeenCalled();
  });

  it(`should ${examples[4].description}`, async () => {
    const input = yaml.parse(examples[4].example).steps[0].input;

    commandExists.mockResolvedValue(false);

    fetchContents.mockImplementation(() => Promise.resolve());

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        reader: mockReader,
        integrations,
        baseUrl: mockContext.templateInfo?.baseUrl,
        fetchUrl: mockContext.input.url,
        outputPath: join(
          mockTmpDir,
          'template',
          "{{cookiecutter and 'contents'}}",
        ),
      }),
    );
    expect(containerRunner.runContainer).toHaveBeenCalled();
  });
});
