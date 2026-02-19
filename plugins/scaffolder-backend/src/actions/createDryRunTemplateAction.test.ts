/*
 * Copyright 2026 The Backstage Authors
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
import { createDryRunTemplateAction } from './createDryRunTemplateAction';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { ResponseError } from '@backstage/errors';

type ValidateScaffolderOutput = {
  valid: boolean;
  message: string;
  errors?: string[];
  log?: Array<{ message: string; stepId?: string; status?: string }>;
  output?: Record<string, unknown>;
  steps?: Array<{ id: string; name: string; action: string }>;
};

const validTemplateYaml = `
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: test-template
  namespace: default
  title: Test Template
spec:
  type: service
  steps:
    - id: step-1
      name: Step One
      action: debug:log
      input:
        message: hello
`;

const invalidYaml = `
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: test
  invalid: yaml: syntax: error
spec:
  type: service
  steps: [
`;

describe('createDryRunTemplateAction', () => {
  let mockScaffolderClient: {
    dryRun: jest.Mock;
  };

  beforeEach(() => {
    mockScaffolderClient = {
      dryRun: jest.fn(),
    };
  });

  it('should validate a valid template and return success when dry-run succeeds', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const dryRunResult = {
      log: [
        {
          body: {
            message: 'Step completed',
            stepId: 'step-1',
            status: 'completed',
          },
        },
      ],
      output: { result: 'ok' },
      steps: [{ id: 'step-1', name: 'Step One', action: 'debug:log' }],
    };

    mockScaffolderClient.dryRun.mockResolvedValue(dryRunResult);

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderClient: mockScaffolderClient as any,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: { templateYaml: validTemplateYaml },
    });

    expect(result.output).toEqual({
      valid: true,
      message: 'Template validation successful',
      log: [
        {
          message: 'Step completed',
          stepId: 'step-1',
          status: 'completed',
        },
      ],
      output: { result: 'ok' },
      steps: [{ id: 'step-1', name: 'Step One', action: 'debug:log' }],
    });

    expect(mockScaffolderClient.dryRun).toHaveBeenCalledWith({
      template: expect.objectContaining({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: expect.objectContaining({
          name: 'test-template',
        }),
      }),
      values: {},
      directoryContents: [],
    });
  });

  it('should pass values and directoryContents to scaffolderClient.dryRun', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderClient.dryRun.mockResolvedValue({
      log: [],
      output: {},
      steps: [],
    });

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderClient: mockScaffolderClient as any,
    });

    const values = { name: 'my-app' };
    const directoryContents = [
      {
        path: 'README.md',
        base64Content: Buffer.from('hello').toString('base64'),
      },
    ];

    await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: {
        templateYaml: validTemplateYaml,
        values,
        directoryContents,
      },
    });

    expect(mockScaffolderClient.dryRun).toHaveBeenCalledWith({
      template: expect.any(Object),
      values,
      directoryContents,
    });
  });

  it('should call scaffolderClient.dryRun with parsed template', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderClient.dryRun.mockResolvedValue({
      log: [],
      output: {},
      steps: [],
    });

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderClient: mockScaffolderClient as any,
    });

    await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: { templateYaml: validTemplateYaml },
    });

    expect(mockScaffolderClient.dryRun).toHaveBeenCalledTimes(1);
    expect(mockScaffolderClient.dryRun).toHaveBeenCalledWith(
      expect.objectContaining({
        template: expect.objectContaining({
          kind: 'Template',
          metadata: expect.objectContaining({
            name: 'test-template',
          }),
        }),
      }),
    );
  });

  it('should return validation errors when YAML is invalid', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderClient: mockScaffolderClient as any,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: { templateYaml: invalidYaml },
    });

    expect(result.output).toEqual({
      valid: false,
      message: 'Failed to parse YAML template',
      errors: expect.arrayContaining([
        expect.stringContaining('YAML parsing error'),
      ]),
    });

    expect(mockScaffolderClient.dryRun).not.toHaveBeenCalled();
  });

  it('should throw ForwardedError when scaffolderClient.dryRun throws ResponseError', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    const responseError = await ResponseError.fromResponse({
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({
        error: {
          name: 'InputError',
          message: 'Invalid template: missing required field',
        },
      }),
    } as Response);

    mockScaffolderClient.dryRun.mockRejectedValue(responseError);

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderClient: mockScaffolderClient as any,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:validate-scaffolder',
        input: { templateYaml: validTemplateYaml },
      }),
    ).rejects.toThrow('Template validation failed');
  });

  it('should throw ForwardedError when scaffolderClient.dryRun throws generic error', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    mockScaffolderClient.dryRun.mockRejectedValue(new Error('Network error'));

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderClient: mockScaffolderClient as any,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:validate-scaffolder',
        input: { templateYaml: validTemplateYaml },
      }),
    ).rejects.toThrow('Template validation failed');
  });

  it('should use default empty values and directoryContents when not provided', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderClient.dryRun.mockResolvedValue({
      log: [],
      output: {},
      steps: [],
    });

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderClient: mockScaffolderClient as any,
    });

    await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: { templateYaml: validTemplateYaml },
    });

    expect(mockScaffolderClient.dryRun).toHaveBeenCalledWith({
      template: expect.any(Object),
      values: {},
      directoryContents: [],
    });
  });

  it('should map log entries with top-level message when body is absent', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderClient.dryRun.mockResolvedValue({
      log: [{ message: 'Plain log message' }],
      output: {},
      steps: [],
    });

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderClient: mockScaffolderClient as any,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: { templateYaml: validTemplateYaml },
    });

    const output = result.output as ValidateScaffolderOutput;
    expect(output.valid).toBe(true);
    expect(output.log).toEqual([
      { message: 'Plain log message', stepId: undefined, status: undefined },
    ]);
  });
});
