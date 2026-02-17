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
import { createValidateScaffolderAction } from './createValidateScaffolderAction';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { BackstageCredentials } from '@backstage/backend-plugin-api';

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

const templateWithNoSteps = `
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: empty-template
  namespace: default
spec:
  type: website
  steps: []
`;

const invalidTemplateSchema = `
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: not-a-template
spec:
  type: service
`;

describe('createValidateScaffolderAction', () => {
  const mockBaseUrl = 'http://scaffolder.example.com';
  let mockAuth: {
    getPluginRequestToken: jest.Mock;
  };
  let mockDiscovery: {
    getBaseUrl: jest.Mock;
  };
  let mockFetch: jest.Mock;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    mockAuth = {
      getPluginRequestToken: jest
        .fn()
        .mockResolvedValue({ token: 'test-token' }),
    };
    mockDiscovery = {
      getBaseUrl: jest.fn().mockResolvedValue(mockBaseUrl),
    };
    mockFetch = jest.fn();
    originalFetch = global.fetch;
    (global as any).fetch = mockFetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
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

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(dryRunResult),
    });

    createValidateScaffolderAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth as any,
      discovery: mockDiscovery as any,
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

    expect(mockAuth.getPluginRequestToken).toHaveBeenCalledWith({
      onBehalfOf: expect.any(Object),
      targetPluginId: 'scaffolder',
    });
    expect(mockDiscovery.getBaseUrl).toHaveBeenCalledWith('scaffolder');
    expect(mockFetch).toHaveBeenCalledWith(
      `${mockBaseUrl}/v2/dry-run`,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      }),
    );
  });

  it('should pass values and directoryContents to dry-run endpoint', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ log: [], output: {}, steps: [] }),
    });

    createValidateScaffolderAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth as any,
      discovery: mockDiscovery as any,
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

    const fetchCall = mockFetch.mock.calls[0];
    expect(fetchCall[0]).toBe(`${mockBaseUrl}/v2/dry-run`);
    const body = JSON.parse(fetchCall[1].body);
    expect(body.values).toEqual(values);
    expect(body.directoryContents).toEqual(directoryContents);
  });

  it('should pass credentials to auth.getPluginRequestToken', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ log: [], output: {}, steps: [] }),
    });

    createValidateScaffolderAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth as any,
      discovery: mockDiscovery as any,
    });

    const mockCredentials: BackstageCredentials = {
      $$type: '@backstage/BackstageCredentials',
      principal: { type: 'user', userEntityRef: 'user:default/test' },
    };

    await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: { templateYaml: validTemplateYaml },
      credentials: mockCredentials,
    });

    expect(mockAuth.getPluginRequestToken).toHaveBeenCalledWith({
      onBehalfOf: mockCredentials,
      targetPluginId: 'scaffolder',
    });
  });

  it('should return validation errors when YAML is invalid', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    createValidateScaffolderAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth as any,
      discovery: mockDiscovery as any,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: { templateYaml: invalidYaml },
    });

    expect(result.output).toEqual({
      valid: false,
      message: 'Failed to parse YAML template',
      errors: [
        expect.stringContaining('YAML parsing error'),
        expect.any(String),
      ],
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return validation errors when template has no steps', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    createValidateScaffolderAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth as any,
      discovery: mockDiscovery as any,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: { templateYaml: templateWithNoSteps },
    });

    expect(result.output).toEqual({
      valid: false,
      message: 'Template has no steps defined',
      errors: ['Template must have at least one step'],
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return validation errors when template does not conform to schema', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    createValidateScaffolderAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth as any,
      discovery: mockDiscovery as any,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: { templateYaml: invalidTemplateSchema },
    });

    expect(result.output).toEqual({
      valid: false,
      message: 'Invalid template structure',
      errors: ['Template does not conform to TemplateEntityV1beta3 schema'],
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return validation errors when dry-run API returns error', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    const errorBody = {
      error: {
        name: 'InputError',
        message: 'Parameter validation failed',
      },
      request: { method: 'POST', url: '/v2/dry-run' },
      response: { statusCode: 400 },
    };

    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      text: () => Promise.resolve(JSON.stringify(errorBody)),
    });

    createValidateScaffolderAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth as any,
      discovery: mockDiscovery as any,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: { templateYaml: validTemplateYaml },
    });
    const output = result.output as ValidateScaffolderOutput;
    expect(output).not.toBeNull();
    expect(output.valid).toBe(false);
    expect(output.message).toBe('Template validation failed');
    expect(output.errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Request failed with 400 Bad Request/),
      ]),
    );
  });

  it('should handle fetch throwing an error', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    mockFetch.mockRejectedValue(new Error('Network error'));

    createValidateScaffolderAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth as any,
      discovery: mockDiscovery as any,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: { templateYaml: validTemplateYaml },
    });

    expect(result.output).toEqual({
      valid: false,
      message: 'Template validation failed',
      errors: ['Network error'],
    });
  });

  it('should use default empty values and directoryContents when not provided', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ log: [], output: {}, steps: [] }),
    });

    createValidateScaffolderAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth as any,
      discovery: mockDiscovery as any,
    });

    await mockActionsRegistry.invoke({
      id: 'test:validate-scaffolder',
      input: { templateYaml: validTemplateYaml },
    });

    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.values).toEqual({});
    expect(callBody.directoryContents).toEqual([]);
  });

  it('should map log entries with top-level message when body is absent', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          log: [{ message: 'Plain log message' }],
          output: {},
          steps: [],
        }),
    });

    createValidateScaffolderAction({
      actionsRegistry: mockActionsRegistry,
      auth: mockAuth as any,
      discovery: mockDiscovery as any,
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
