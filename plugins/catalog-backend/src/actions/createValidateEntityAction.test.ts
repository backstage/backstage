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
import { createValidateEntityAction } from './createValidateEntityAction';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { BackstageCredentials } from '@backstage/backend-plugin-api';

describe('createValidateEntityAction', () => {
  const validEntityYaml = `
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: test-component
  namespace: default
spec:
  type: service
  lifecycle: production
`;

  const invalidYaml = `
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: test-component
  namespace: default
spec:
  type: service
  lifecycle: production
  invalid: yaml: syntax: error
`;

  const validEntityObject = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-component',
      namespace: 'default',
    },
    spec: {
      type: 'service',
      lifecycle: 'production',
    },
  };

  it('should validate a valid entity YAML and return success', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock.mock();

    // Mock validateEntity to return valid response
    mockCatalog.validateEntity.mockResolvedValue({
      valid: true,
    });

    createValidateEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-entity',
      input: { entity: validEntityYaml },
    });

    expect(result.output).toEqual({
      isValid: true,
      isValidYaml: true,
      errors: [],
      entity: validEntityObject,
    });

    expect(mockCatalog.validateEntity).toHaveBeenCalledWith(
      validEntityObject,
      'url:https://localhost/entity-validator',
      { credentials: expect.any(Object) },
    );
  });

  it('should validate entity with custom location', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock.mock();

    mockCatalog.validateEntity.mockResolvedValue({
      valid: true,
    });

    createValidateEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const customLocation = 'https://github.com/example/repo/catalog-info.yaml';

    await mockActionsRegistry.invoke({
      id: 'test:validate-entity',
      input: {
        entity: validEntityYaml,
        location: customLocation,
      },
    });

    expect(mockCatalog.validateEntity).toHaveBeenCalledWith(
      validEntityObject,
      customLocation,
      { credentials: expect.any(Object) },
    );
  });

  it('should return validation errors when entity is invalid', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock.mock();

    const validationErrors = [
      { name: 'ValidationError', message: 'Missing required field: spec.type' },
      { name: 'ValidationError', message: 'Invalid lifecycle value' },
    ];

    mockCatalog.validateEntity.mockResolvedValue({
      valid: false,
      errors: validationErrors,
    });

    createValidateEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-entity',
      input: { entity: validEntityYaml },
    });

    expect(result.output).toEqual({
      isValid: false,
      isValidYaml: true,
      errors: ['Missing required field: spec.type', 'Invalid lifecycle value'],
      entity: undefined,
    });
  });

  it('should handle invalid YAML syntax', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock.mock();

    createValidateEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-entity',
      input: { entity: invalidYaml },
    });

    expect(result.output).toEqual({
      isValid: false,
      isValidYaml: false,
      errors: [expect.stringContaining('YAML parsing error')],
    });

    // validateEntity should not be called if YAML parsing fails
    expect(mockCatalog.validateEntity).not.toHaveBeenCalled();
  });

  it('should handle catalog service errors gracefully', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock.mock();

    const catalogError = new Error('Catalog service unavailable');
    mockCatalog.validateEntity.mockRejectedValue(catalogError);

    createValidateEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-entity',
      input: { entity: validEntityYaml },
    });

    expect(result.output).toEqual({
      isValid: false,
      isValidYaml: false,
      errors: ['Validation error: Catalog service unavailable'],
    });
  });

  it('should handle empty YAML input', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock.mock();

    createValidateEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-entity',
      input: { entity: '' },
    });

    expect(result.output).toEqual({
      isValid: false,
      isValidYaml: false,
      errors: [expect.stringContaining('Validation error')],
    });
  });

  it('should handle malformed YAML with special characters', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock.mock();

    createValidateEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const malformedYaml = `
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: test-component
  annotations:
    invalid: "unclosed quote
spec:
  type: service
`;

    const result = await mockActionsRegistry.invoke({
      id: 'test:validate-entity',
      input: { entity: malformedYaml },
    });

    expect(result.output).toEqual({
      isValid: false,
      isValidYaml: false,
      errors: [expect.stringContaining('YAML parsing error')],
    });
  });

  it('should pass credentials to catalog service', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock.mock();

    mockCatalog.validateEntity.mockResolvedValue({
      valid: true,
    });

    createValidateEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const mockCredentials: BackstageCredentials = {
      $$type: '@backstage/BackstageCredentials',
      principal: { type: 'user', userEntityRef: 'user:default/test' },
    };

    await mockActionsRegistry.invoke({
      id: 'test:validate-entity',
      input: { entity: validEntityYaml },
      credentials: mockCredentials,
    });

    expect(mockCatalog.validateEntity).toHaveBeenCalledWith(
      validEntityObject,
      'url:https://localhost/entity-validator',
      { credentials: mockCredentials },
    );
  });
});
