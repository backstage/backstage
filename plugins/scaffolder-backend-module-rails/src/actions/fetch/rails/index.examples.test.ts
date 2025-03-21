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

const mockRailsTemplater = { run: jest.fn() };
jest.mock('@backstage/plugin-scaffolder-node', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-node'),
  fetchContents: jest.fn(),
}));
jest.mock('./railsNewRunner', () => {
  return {
    RailsNewRunner: jest.fn().mockImplementation(() => {
      return mockRailsTemplater;
    }),
  };
});

import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { resolve as resolvePath } from 'path';
import { createFetchRailsAction } from './index';
import { fetchContents } from '@backstage/plugin-scaffolder-node';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { examples } from './index.examples';
import yaml from 'yaml';
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { ContainerRunner } from './ContainerRunner';

describe('fetch:rails', () => {
  const mockDir = createMockDirectory();
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

  const mockContext = createMockActionContext({
    input: {
      url: 'https://rubyonrails.org/generator',
      targetPath: 'something',
      values: {
        help: 'me',
      },
    },
    templateInfo: {
      baseUrl: 'somebase',
      entityRef: 'template:default/myTemplate',
    },
    workspacePath: mockDir.path,
  });

  const mockReader: UrlReaderService = {
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };
  const containerRunner: ContainerRunner = {
    runContainer: jest.fn(),
  };

  const action = createFetchRailsAction({
    integrations,
    reader: mockReader,
    containerRunner,
    allowedImageNames: ['foo/rails-custom-image'],
  });

  beforeEach(() => {
    mockDir.setContent({
      result: '{}',
    });
    jest.clearAllMocks();
  });

  it(`should ${examples[0].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[0].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.templateInfo?.baseUrl,
      fetchUrl: input.url,
      outputPath: resolvePath(mockContext.workspacePath),
    });
  });

  it(`should ${examples[1].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[1].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.templateInfo?.baseUrl,
      fetchUrl: input.url,
      outputPath: resolvePath(mockContext.workspacePath),
    });
  });

  it(`should ${examples[2].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[2].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.templateInfo?.baseUrl,
      fetchUrl: input.url,
      outputPath: resolvePath(mockContext.workspacePath),
    });
  });

  it(`should ${examples[3].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[3].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.templateInfo?.baseUrl,
      fetchUrl: input.url,
      outputPath: resolvePath(mockContext.workspacePath),
    });
  });

  it(`should ${examples[4].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[4].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.templateInfo?.baseUrl,
      fetchUrl: input.url,
      outputPath: resolvePath(mockContext.workspacePath),
    });
  });

  it(`should ${examples[5].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[5].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.templateInfo?.baseUrl,
      fetchUrl: input.url,
      outputPath: resolvePath(mockContext.workspacePath),
    });
  });

  it(`should ${examples[6].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[6].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.templateInfo?.baseUrl,
      fetchUrl: input.url,
      outputPath: resolvePath(mockContext.workspacePath),
    });
  });

  it(`should ${examples[7].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[7].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.templateInfo?.baseUrl,
      fetchUrl: input.url,
      outputPath: resolvePath(mockContext.workspacePath),
    });
  });

  it(`should ${examples[8].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[8].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.templateInfo?.baseUrl,
      fetchUrl: input.url,
      outputPath: resolvePath(mockContext.workspacePath),
    });
  });

  it(`should ${examples[9].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[9].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.templateInfo?.baseUrl,
      fetchUrl: input.url,
      outputPath: resolvePath(mockContext.workspacePath),
    });
  });
});
