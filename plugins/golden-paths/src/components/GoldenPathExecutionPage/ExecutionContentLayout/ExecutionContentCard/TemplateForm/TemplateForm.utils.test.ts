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
import {
  resolvePlaceholders,
  resolveInputReferences,
  useTemplateForm,
} from './TemplateForm.utils';

import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from '@backstage/core-plugin-api';
import { goldenPathsApiRef } from '@backstage/plugin-golden-paths-react';
import { useFormDecorators } from '../../../../../hooks/useFormDecorators';

jest.mock('@backstage/plugin-golden-paths-react', () => {
  const createTemplate = jest.fn(() => Promise.resolve());
  const updateStatus = jest.fn(() => Promise.resolve());
  return {
    goldenPathsApiRef: {
      id: 'golden-paths',
      T: { createTemplate, updateStatus },
    },
    useGoldenPathContext: jest.fn(() => ({ fieldExtensions: [] })),
  };
});

jest.mock('@backstage/plugin-catalog-react', () => {
  return {
    catalogApiRef: jest.fn(),
    useApi: jest.fn(),
  };
});

jest.mock('@backstage/core-plugin-api', () => {
  const post = jest.fn(() => Promise.resolve());
  return {
    useApi: jest.fn(({ T }) => ({ ...T })),
    errorApiRef: {
      id: 'core.error',
      T: { post },
    },
  };
});

jest.mock('@backstage/plugin-scaffolder-react', () => ({
  useTemplateSecrets: jest.fn(() => ({ secrets: { elf: 'Legolas' } })),
}));

jest.mock('@backstage/plugin-scaffolder-react/alpha', () => ({
  useTemplateParameterSchema: jest.fn(() => ({ manifest: { steps: [] } })),
}));

jest.mock('@backstage/catalog-model', () => ({
  parseEntityRef: jest.fn(() => ({ name: 'Gimli', namespace: 'Erebor' })),
}));

jest.mock('../../../useGoldenPathTaskContext', () => ({
  useGoldenPathTaskContext: jest.fn(() => ({
    value: {
      goldenPathTask: {
        id: '12345',
        spec: { steps: [{ id: '23456', template: 'uruk/hai/orthanc' }] },
      },
      templateStepParams: {},
      stepIndex: 0,
      setStepPhase: jest.fn(),
    },
  })),
}));

jest.mock('../../../../../hooks/useFormDecorators', () => ({
  useFormDecorators: jest.fn(),
}));

describe('resolvePlaceholders', () => {
  describe('primitive types', () => {
    it('should resolve string placeholders', () => {
      const inputValues = {
        parameters: { name: 'John' },
      };
      const result = resolvePlaceholders('${{ parameters.name }}', inputValues);
      expect(result).toBe('John');
    });

    it('should resolve number placeholders and preserve type', () => {
      const inputValues = {
        parameters: { port: 8080 },
      };
      const result = resolvePlaceholders('${{ parameters.port }}', inputValues);
      expect(result).toBe(8080);
      expect(typeof result).toBe('number');
    });

    it('should resolve boolean placeholders and preserve type', () => {
      const inputValues = {
        parameters: { enabled: true },
      };
      const result = resolvePlaceholders(
        '${{ parameters.enabled }}',
        inputValues,
      );
      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it("should preserve string 'true' when already a string", () => {
      const inputValues = {
        parameters: { flag: 'true' },
      };
      const result = resolvePlaceholders('${{ parameters.flag }}', inputValues);
      expect(result).toBe('true');
      expect(typeof result).toBe('string');
    });

    it("should preserve string 'false' when already a string", () => {
      const inputValues = {
        parameters: { flag: 'false' },
      };
      const result = resolvePlaceholders('${{ parameters.flag }}', inputValues);
      expect(result).toBe('false');
      expect(typeof result).toBe('string');
    });

    it('should preserve numeric strings when already a string', () => {
      const inputValues = {
        parameters: { count: '42' },
      };
      const result = resolvePlaceholders(
        '${{ parameters.count }}',
        inputValues,
      );
      expect(result).toBe('42');
      expect(typeof result).toBe('string');
    });

    it("should cast 'true' to boolean in string interpolation", () => {
      const inputValues = {
        parameters: { value: 'enabled' },
      };
      const result = resolvePlaceholders('true', inputValues);
      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it('should cast numeric string to number in string interpolation', () => {
      const inputValues = {
        parameters: { prefix: 'count' },
      };
      const result = resolvePlaceholders('42', inputValues);
      expect(result).toBe(42);
      expect(typeof result).toBe('number');
    });
  });

  describe('arrays', () => {
    it('should resolve single array placeholder and preserve type', () => {
      const inputValues = {
        parameters: { items: [1, 2, 3] },
      };
      const result = resolvePlaceholders(
        '${{ parameters.items }}',
        inputValues,
      );
      expect(result).toEqual([1, 2, 3]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should resolve array of strings', () => {
      const inputValues = {
        parameters: { tags: ['frontend', 'react', 'typescript'] },
      };
      const result = resolvePlaceholders('${{ parameters.tags }}', inputValues);
      expect(result).toEqual(['frontend', 'react', 'typescript']);
    });

    it('should resolve array of objects', () => {
      const inputValues = {
        parameters: {
          components: [
            { name: 'comp1', version: '1.0.0' },
            { name: 'comp2', version: '2.0.0' },
          ],
        },
      };
      const result = resolvePlaceholders(
        '${{ parameters.components }}',
        inputValues,
      );
      expect(result).toEqual([
        { name: 'comp1', version: '1.0.0' },
        { name: 'comp2', version: '2.0.0' },
      ]);
    });

    it('should resolve placeholders inside array elements', () => {
      const inputValues = {
        parameters: { name: 'test' },
        outputs: { url: 'https://example.com' },
      };
      const arrayWithPlaceholders = [
        '${{ parameters.name }}',
        '${{ outputs.url }}',
      ];
      const result = resolvePlaceholders(arrayWithPlaceholders, inputValues);
      expect(result).toEqual(['test', 'https://example.com']);
    });

    it('should handle nested arrays with placeholders', () => {
      const inputValues = {
        parameters: { item1: 'a', item2: 'b' },
      };
      const nestedArray = [
        ['${{ parameters.item1 }}', '${{ parameters.item2 }}'],
        ['c', 'd'],
      ];
      const result = resolvePlaceholders(nestedArray, inputValues);
      expect(result).toEqual([
        ['a', 'b'],
        ['c', 'd'],
      ]);
    });

    it('should handle mixed types in arrays', () => {
      const inputValues = {
        parameters: { name: 'test', count: 5, enabled: true },
      };
      const mixedArray = [
        '${{ parameters.name }}',
        '${{ parameters.count }}',
        '${{ parameters.enabled }}',
        'literal',
      ];
      const result = resolvePlaceholders(mixedArray, inputValues);
      expect(result).toEqual(['test', 5, true, 'literal']);
    });
  });

  describe('objects', () => {
    it('should resolve single object placeholder and preserve type', () => {
      const inputValues = {
        parameters: { config: { host: 'localhost', port: 3000 } },
      };
      const result = resolvePlaceholders(
        '${{ parameters.config }}',
        inputValues,
      );
      expect(result).toEqual({ host: 'localhost', port: 3000 });
      expect(typeof result).toBe('object');
    });

    it('should resolve placeholders in object values', () => {
      const inputValues = {
        parameters: { name: 'app', port: 8080 },
        outputs: { url: 'https://api.example.com' },
      };
      const objectWithPlaceholders = {
        serviceName: '${{ parameters.name }}',
        servicePort: '${{ parameters.port }}',
        apiUrl: '${{ outputs.url }}',
      };
      const result = resolvePlaceholders(objectWithPlaceholders, inputValues);
      expect(result).toEqual({
        serviceName: 'app',
        servicePort: 8080,
        apiUrl: 'https://api.example.com',
      });
    });

    it('should handle nested objects with placeholders', () => {
      const inputValues = {
        parameters: { name: 'service', env: 'prod' },
      };
      const nestedObject = {
        metadata: {
          name: '${{ parameters.name }}',
          environment: '${{ parameters.env }}',
        },
        spec: {
          replicas: 3,
        },
      };
      const result = resolvePlaceholders(nestedObject, inputValues);
      expect(result).toEqual({
        metadata: {
          name: 'service',
          environment: 'prod',
        },
        spec: {
          replicas: 3,
        },
      });
    });

    it('should resolve nested paths in placeholders', () => {
      const inputValues = {
        outputs: {
          scaffoldService: {
            repoUrl: 'https://github.com/org/repo',
            metadata: {
              namespace: 'dev',
            },
          },
        },
      };
      const result = resolvePlaceholders(
        '${{ outputs.scaffoldService.repoUrl }}',
        inputValues,
      );
      expect(result).toBe('https://github.com/org/repo');
    });

    it('should resolve deeply nested paths', () => {
      const inputValues = {
        outputs: {
          scaffoldService: {
            metadata: {
              deployment: {
                namespace: 'production',
              },
            },
          },
        },
      };
      const result = resolvePlaceholders(
        '${{ outputs.scaffoldService.metadata.deployment.namespace }}',
        inputValues,
      );
      expect(result).toBe('production');
    });
  });

  describe('complex nested structures', () => {
    it('should handle objects containing arrays with placeholders', () => {
      const inputValues = {
        parameters: { tag1: 'frontend', tag2: 'backend' },
      };
      const structure = {
        metadata: {
          tags: ['${{ parameters.tag1 }}', '${{ parameters.tag2 }}', 'api'],
        },
      };
      const result = resolvePlaceholders(structure, inputValues);
      expect(result).toEqual({
        metadata: {
          tags: ['frontend', 'backend', 'api'],
        },
      });
    });

    it('should handle arrays containing objects with placeholders', () => {
      const inputValues = {
        parameters: { name1: 'service1', name2: 'service2' },
      };
      const structure = [
        { name: '${{ parameters.name1 }}', version: '1.0' },
        { name: '${{ parameters.name2 }}', version: '2.0' },
      ];
      const result = resolvePlaceholders(structure, inputValues);
      expect(result).toEqual([
        { name: 'service1', version: 1.0 },
        { name: 'service2', version: 2.0 },
      ]);
    });

    it('should handle deeply nested mixed structures', () => {
      const inputValues = {
        parameters: { env: 'prod', port: 8080 },
        outputs: { url: 'https://api.example.com' },
      };
      const structure = {
        services: [
          {
            name: 'api',
            config: {
              environment: '${{ parameters.env }}',
              endpoints: ['${{ outputs.url }}', '/health'],
              settings: {
                port: '${{ parameters.port }}',
                ssl: true,
              },
            },
          },
        ],
      };
      const result = resolvePlaceholders(structure, inputValues);
      expect(result).toEqual({
        services: [
          {
            name: 'api',
            config: {
              environment: 'prod',
              endpoints: ['https://api.example.com', '/health'],
              settings: {
                port: 8080,
                ssl: true,
              },
            },
          },
        ],
      });
    });
  });

  describe('string interpolation', () => {
    it('should handle multiple placeholders in a string', () => {
      const inputValues = {
        parameters: { owner: 'team-x', repo: 'backend' },
      };
      const result = resolvePlaceholders(
        'https://github.com/${{ parameters.owner }}/${{ parameters.repo }}',
        inputValues,
      );
      expect(result).toBe('https://github.com/team-x/backend');
    });

    it('should handle mixed content with text and placeholders', () => {
      const inputValues = {
        parameters: { id: 123, name: 'service' },
      };
      const result = resolvePlaceholders(
        'id-${{ parameters.id }}-${{ parameters.name }}',
        inputValues,
      );
      expect(result).toBe('id-123-service');
    });

    it('should handle placeholders with whitespace', () => {
      const inputValues = {
        parameters: { name: 'test' },
      };
      const result = resolvePlaceholders(
        '${{   parameters.name   }}',
        inputValues,
      );
      expect(result).toBe('test');
    });

    it('should stringify objects in string interpolation', () => {
      const inputValues = {
        parameters: { config: { host: 'localhost' } },
      };
      const result = resolvePlaceholders(
        'Config: ${{ parameters.config }}',
        inputValues,
      );
      // When stringified in mixed content, objects become [object Object]
      expect(result).toBe('Config: [object Object]');
    });

    it('should stringify arrays in string interpolation', () => {
      const inputValues = {
        parameters: { items: [1, 2, 3] },
      };
      const result = resolvePlaceholders(
        'Items: ${{ parameters.items }}',
        inputValues,
      );
      expect(result).toBe('Items: 1,2,3');
    });
  });

  describe('edge cases', () => {
    it('should return null for null input', () => {
      const inputValues = {
        parameters: { value: null },
      };
      const result = resolvePlaceholders(null, inputValues);
      expect(result).toBeNull();
    });

    it('should return undefined for undefined input', () => {
      const inputValues = {
        parameters: { value: 'test' },
      };
      const result = resolvePlaceholders(undefined, inputValues);
      expect(result).toBeUndefined();
    });

    it('should return value as-is when no inputValues provided', () => {
      const result = resolvePlaceholders('${{ parameters.name }}', undefined);
      expect(result).toBe('${{ parameters.name }}');
    });

    it('should return empty string for unresolved placeholder', () => {
      const inputValues = {
        parameters: {},
      };
      const result = resolvePlaceholders(
        '${{ parameters.missing }}',
        inputValues,
      );
      expect(result).toBe('');
    });

    it('should handle empty strings', () => {
      const inputValues = {
        parameters: { name: '' },
      };
      const result = resolvePlaceholders('${{ parameters.name }}', inputValues);
      expect(result).toBe('');
    });

    it('should preserve JSON strings without parsing when type preserved', () => {
      const inputValues = {
        parameters: { json: '{"key": "value"}' },
      };
      const result = resolvePlaceholders('${{ parameters.json }}', inputValues);
      expect(result).toBe('{"key": "value"}');
    });

    it('should return string as-is for invalid JSON', () => {
      const inputValues = {
        parameters: { text: 'not json' },
      };
      const result = resolvePlaceholders('${{ parameters.text }}', inputValues);
      expect(result).toBe('not json');
    });

    it('should handle non-string primitive values', () => {
      const result = resolvePlaceholders(42, {
        parameters: { value: 'test' },
      });
      expect(result).toBe(42);
    });

    it('should handle multiple input value types', () => {
      const inputValues = {
        parameters: { name: 'test' },
        outputs: { url: 'https://example.com' },
      };
      const result = resolvePlaceholders(
        '${{ parameters.name }}-${{ outputs.url }}',
        inputValues,
      );
      expect(result).toBe('test-https://example.com');
    });
  });

  describe('type preservation', () => {
    it('should preserve array type for single placeholder', () => {
      const inputValues = {
        parameters: { items: [1, 2, 3] },
      };
      const result = resolvePlaceholders(
        '${{ parameters.items }}',
        inputValues,
      );
      expect(Array.isArray(result)).toBe(true);
    });

    it('should preserve object type for single placeholder', () => {
      const inputValues = {
        parameters: { config: { key: 'value' } },
      };
      const result = resolvePlaceholders(
        '${{ parameters.config }}',
        inputValues,
      );
      expect(result).toEqual({ key: 'value' });
      expect(typeof result).toBe('object');
      expect(Array.isArray(result)).toBe(false);
    });

    it('should preserve number type for single placeholder', () => {
      const inputValues = {
        parameters: { count: 42 },
      };
      const result = resolvePlaceholders(
        '${{ parameters.count }}',
        inputValues,
      );
      expect(result).toBe(42);
      expect(typeof result).toBe('number');
    });

    it('should preserve boolean type for single placeholder', () => {
      const inputValues = {
        parameters: { enabled: false },
      };
      const result = resolvePlaceholders(
        '${{ parameters.enabled }}',
        inputValues,
      );
      expect(result).toBe(false);
      expect(typeof result).toBe('boolean');
    });

    it('should not preserve type for mixed content', () => {
      const inputValues = {
        parameters: { count: 42 },
      };
      const result = resolvePlaceholders(
        'Count: ${{ parameters.count }}',
        inputValues,
      );
      expect(result).toBe('Count: 42');
      expect(typeof result).toBe('string');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle multi-step template parameter passing', () => {
      const inputValues = {
        outputs: {
          scaffoldService: {
            repoUrl: 'https://github.com/org/repo',
            serviceUrl: 'https://api.example.com',
            servicePort: 8080,
            namespace: 'dev',
          },
        },
      };

      const templateInput = {
        repoUrl: '${{ outputs.scaffoldService.repoUrl }}',
        apiEndpoint: '${{ outputs.scaffoldService.serviceUrl }}',
        port: '${{ outputs.scaffoldService.servicePort }}',
        deploymentNamespace: '${{ outputs.scaffoldService.namespace }}',
      };

      const result = resolvePlaceholders(templateInput, inputValues);

      expect(result).toEqual({
        repoUrl: 'https://github.com/org/repo',
        apiEndpoint: 'https://api.example.com',
        port: 8080,
        deploymentNamespace: 'dev',
      });
    });

    it('should handle complex configuration object', () => {
      const inputValues = {
        parameters: {
          serviceName: 'my-service',
          environment: 'production',
          replicas: 3,
          enableMonitoring: true,
        },
        outputs: {
          deployment: {
            imageTag: 'v1.2.3',
            registryUrl: 'registry.example.com',
          },
        },
      };

      const config = {
        apiVersion: 'v1',
        kind: 'Deployment',
        metadata: {
          name: '${{ parameters.serviceName }}',
          labels: {
            app: '${{ parameters.serviceName }}',
            environment: '${{ parameters.environment }}',
            monitoring: '${{ parameters.enableMonitoring }}',
          },
        },
        spec: {
          replicas: '${{ parameters.replicas }}',
          template: {
            spec: {
              containers: [
                {
                  name: '${{ parameters.serviceName }}',
                  image:
                    '${{ outputs.deployment.registryUrl }}/${{ parameters.serviceName }}:${{ outputs.deployment.imageTag }}',
                },
              ],
            },
          },
        },
      };

      const result = resolvePlaceholders(config, inputValues);

      expect(result).toEqual({
        apiVersion: 'v1',
        kind: 'Deployment',
        metadata: {
          name: 'my-service',
          labels: {
            app: 'my-service',
            environment: 'production',
            monitoring: true,
          },
        },
        spec: {
          replicas: 3,
          template: {
            spec: {
              containers: [
                {
                  name: 'my-service',
                  image: 'registry.example.com/my-service:v1.2.3',
                },
              ],
            },
          },
        },
      });
    });

    it('should handle array of configuration objects', () => {
      const inputValues = {
        parameters: { env: 'prod' },
        outputs: {
          services: {
            api: { url: 'https://api.example.com', port: 8080 },
            frontend: { url: 'https://app.example.com', port: 3000 },
          },
        },
      };

      const services = [
        {
          name: 'api',
          environment: '${{ parameters.env }}',
          url: '${{ outputs.services.api.url }}',
          port: '${{ outputs.services.api.port }}',
        },
        {
          name: 'frontend',
          environment: '${{ parameters.env }}',
          url: '${{ outputs.services.frontend.url }}',
          port: '${{ outputs.services.frontend.port }}',
        },
      ];

      const result = resolvePlaceholders(services, inputValues);

      expect(result).toEqual([
        {
          name: 'api',
          environment: 'prod',
          url: 'https://api.example.com',
          port: 8080,
        },
        {
          name: 'frontend',
          environment: 'prod',
          url: 'https://app.example.com',
          port: 3000,
        },
      ]);
    });
  });
});

describe('resolveInputReferences', () => {
  describe('basic functionality', () => {
    it('should resolve all placeholders in an input object', () => {
      const input = {
        name: '${{ parameters.serviceName }}',
        port: '${{ parameters.port }}',
        url: '${{ outputs.serviceUrl }}',
      };

      const parameters = {
        parameters: { serviceName: 'api', port: 8080 },
        outputs: { serviceUrl: 'https://api.example.com' },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        name: 'api',
        port: 8080,
        url: 'https://api.example.com',
      });
    });

    it('should handle undefined input', () => {
      const parameters = {
        parameters: { name: 'test' },
      };

      const result = resolveInputReferences(undefined, parameters);

      expect(result).toEqual({});
    });

    it('should handle empty input object', () => {
      const parameters = {
        parameters: { name: 'test' },
      };

      const result = resolveInputReferences({}, parameters);

      expect(result).toEqual({});
    });

    it('should handle undefined parameters', () => {
      const input = {
        name: '${{ parameters.serviceName }}',
        port: 8080,
      };

      const result = resolveInputReferences(input, undefined);

      expect(result).toEqual({
        name: '${{ parameters.serviceName }}', // Placeholder not resolved
        port: 8080,
      });
    });
  });

  describe('type preservation', () => {
    it('should preserve types for single placeholders', () => {
      const input = {
        items: '${{ parameters.items }}',
        config: '${{ parameters.config }}',
        count: '${{ parameters.count }}',
        enabled: '${{ parameters.enabled }}',
      };

      const parameters = {
        parameters: {
          items: [1, 2, 3],
          config: { key: 'value' },
          count: 42,
          enabled: true,
        },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        items: [1, 2, 3],
        config: { key: 'value' },
        count: 42,
        enabled: true,
      });
      expect(Array.isArray(result.items)).toBe(true);
      expect(typeof result.count).toBe('number');
      expect(typeof result.enabled).toBe('boolean');
    });

    it('should handle mixed literal and placeholder values', () => {
      const input = {
        name: '${{ parameters.name }}',
        version: '1.0.0', // literal value
        port: '${{ parameters.port }}',
        debug: false, // literal value
      };

      const parameters = {
        parameters: { name: 'my-service', port: 3000 },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        name: 'my-service',
        version: '1.0.0',
        port: 3000,
        debug: false,
      });
    });
  });

  describe('nested structures', () => {
    it('should resolve placeholders in nested objects', () => {
      const input = {
        service: {
          name: '${{ parameters.name }}',
          config: {
            host: '${{ parameters.host }}',
            port: '${{ parameters.port }}',
          },
        },
      };

      const parameters = {
        parameters: { name: 'api', host: 'localhost', port: 8080 },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        service: {
          name: 'api',
          config: {
            host: 'localhost',
            port: 8080,
          },
        },
      });
    });

    it('should resolve placeholders in arrays', () => {
      const input = {
        tags: ['${{ parameters.tag1 }}', '${{ parameters.tag2 }}', 'static'],
        ports: '${{ parameters.ports }}',
      };

      const parameters = {
        parameters: {
          tag1: 'frontend',
          tag2: 'react',
          ports: [3000, 8080],
        },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        tags: ['frontend', 'react', 'static'],
        ports: [3000, 8080],
      });
    });

    it('should resolve placeholders in arrays of objects', () => {
      const input = {
        services: [
          {
            name: '${{ parameters.service1Name }}',
            url: '${{ outputs.service1Url }}',
          },
          {
            name: '${{ parameters.service2Name }}',
            url: '${{ outputs.service2Url }}',
          },
        ],
      };

      const parameters = {
        parameters: {
          service1Name: 'api',
          service2Name: 'frontend',
        },
        outputs: {
          service1Url: 'https://api.example.com',
          service2Url: 'https://app.example.com',
        },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        services: [
          {
            name: 'api',
            url: 'https://api.example.com',
          },
          {
            name: 'frontend',
            url: 'https://app.example.com',
          },
        ],
      });
    });
  });

  describe('real-world scenarios', () => {
    it('should handle multi-step template workflow', () => {
      // Simulating step 2 using outputs from step 1
      const input = {
        repoUrl: '${{ outputs.scaffoldService.repoUrl }}',
        namespace: '${{ outputs.scaffoldService.namespace }}',
        serviceName: '${{ outputs.scaffoldService.serviceName }}',
        deploymentType: '${{ parameters.deploymentType }}',
        replicas: '${{ parameters.replicas }}',
      };

      const parameters = {
        parameters: {
          deploymentType: 'kubernetes',
          replicas: 3,
        },
        outputs: {
          scaffoldService: {
            repoUrl: 'https://github.com/org/my-service',
            namespace: 'production',
            serviceName: 'my-service',
          },
        },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        repoUrl: 'https://github.com/org/my-service',
        namespace: 'production',
        serviceName: 'my-service',
        deploymentType: 'kubernetes',
        replicas: 3,
      });
    });

    it('should handle complex configuration merging', () => {
      const input = {
        metadata: {
          name: '${{ parameters.name }}',
          owner: '${{ parameters.owner }}',
          tags: '${{ parameters.tags }}',
        },
        spec: {
          repoUrl: '${{ outputs.createRepo.repoUrl }}',
          imageUrl: '${{ outputs.buildImage.imageUrl }}',
          ports: '${{ parameters.ports }}',
        },
        config: {
          apiEndpoint:
            '${{ outputs.deployApi.url }}/api/${{ parameters.version }}',
          monitoring: '${{ parameters.enableMonitoring }}',
        },
      };

      const parameters = {
        parameters: {
          name: 'my-app',
          owner: 'team-platform',
          tags: ['frontend', 'react', 'production'],
          ports: [3000, 8080],
          version: 'v1',
          enableMonitoring: true,
        },
        outputs: {
          createRepo: {
            repoUrl: 'https://github.com/org/my-app',
          },
          buildImage: {
            imageUrl: 'registry.example.com/my-app:latest',
          },
          deployApi: {
            url: 'https://api.example.com',
          },
        },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        metadata: {
          name: 'my-app',
          owner: 'team-platform',
          tags: ['frontend', 'react', 'production'],
        },
        spec: {
          repoUrl: 'https://github.com/org/my-app',
          imageUrl: 'registry.example.com/my-app:latest',
          ports: [3000, 8080],
        },
        config: {
          apiEndpoint: 'https://api.example.com/api/v1',
          monitoring: true,
        },
      });
    });

    it('should handle golden path execution scenario', () => {
      // Typical usage in useTemplateForm hook
      const input = {
        targetRepo: '${{ outputs.scaffoldRepo.repoUrl }}',
        sourceTemplateId: '${{ parameters.templateId }}',
        environment: '${{ parameters.environment }}',
        features: '${{ parameters.features }}',
      };

      const parameters = {
        parameters: {
          templateId: 'template:default/nodejs-service',
          environment: 'staging',
          features: ['monitoring', 'logging', 'tracing'],
        },
        outputs: {
          scaffoldRepo: {
            repoUrl: 'https://github.com/org/new-service',
            namespace: 'staging',
          },
        },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        targetRepo: 'https://github.com/org/new-service',
        sourceTemplateId: 'template:default/nodejs-service',
        environment: 'staging',
        features: ['monitoring', 'logging', 'tracing'],
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null values in input', () => {
      const input = {
        name: '${{ parameters.name }}',
        optional: null,
      };

      const parameters = {
        parameters: { name: 'test' },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        name: 'test',
        optional: null,
      });
    });

    it('should handle empty string values', () => {
      const input = {
        name: '${{ parameters.name }}',
        description: '${{ parameters.description }}',
      };

      const parameters = {
        parameters: { name: 'service', description: '' },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        name: 'service',
        description: '',
      });
    });

    it('should handle unresolved placeholders', () => {
      const input = {
        name: '${{ parameters.name }}',
        missing: '${{ parameters.missing }}',
      };

      const parameters = {
        parameters: { name: 'test' },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        name: 'test',
        missing: '', // Unresolved placeholders become empty strings
      });
    });

    it('should maintain key order', () => {
      const input = {
        z_last: '${{ parameters.last }}',
        a_first: '${{ parameters.first }}',
        m_middle: '${{ parameters.middle }}',
      };

      const parameters = {
        parameters: { first: '1', middle: '2', last: '3' },
      };

      const result = resolveInputReferences(input, parameters);

      expect(Object.keys(result)).toEqual(['z_last', 'a_first', 'm_middle']);
      expect(result).toEqual({
        z_last: '3',
        a_first: '1',
        m_middle: '2',
      });
    });

    it('should handle special characters in keys', () => {
      const input = {
        'key-with-dashes': '${{ parameters.value1 }}',
        'key.with.dots': '${{ parameters.value2 }}',
        key_with_underscores: '${{ parameters.value3 }}',
      };

      const parameters = {
        parameters: { value1: 'a', value2: 'b', value3: 'c' },
      };

      const result = resolveInputReferences(input, parameters);

      expect(result).toEqual({
        'key-with-dashes': 'a',
        'key.with.dots': 'b',
        key_with_underscores: 'c',
      });
    });
  });
});

describe('useTemplateForm', () => {
  const mockDecoratorsRun = jest.fn();

  beforeEach(() => {
    mockDecoratorsRun.mockResolvedValue({
      formState: { istari: 'Gandalf' },
      secrets: { hobbit: 'Frodo' },
    });

    (useFormDecorators as jest.Mock).mockImplementation(() => ({
      run: mockDecoratorsRun,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should return proper structure of an object', async () => {
    const { result } = renderHook(() => useTemplateForm());

    expect(result.current.onCreate).toBeDefined();
    expect(result.current.onError).toBeDefined();
    expect(result.current.templateName).toBe('Gimli');
    expect(result.current.namespace).toBe('Erebor');
    expect(result.current.isCreating).toBe(false);
    expect(result.current.fieldExtensions).toEqual([]);
    expect(result.current.initialState).toEqual({});
  });

  it('should set `isCreating` to `true` when calling `onCreate', async () => {
    const spyCreateTemplate = jest.spyOn(
      useApi(goldenPathsApiRef),
      'createTemplate',
    );

    const { result } = renderHook(() => useTemplateForm());

    await waitFor(async () => {
      await result.current.onCreate({});

      expect(result.current.isCreating).toBe(true);
      expect(mockDecoratorsRun).toHaveBeenCalled();
      expect(spyCreateTemplate).toHaveBeenCalled();
    });
  });

  it('should do nothing when calling `onCreate` more times', async () => {
    const spyCreateTemplate = jest.spyOn(
      useApi(goldenPathsApiRef),
      'createTemplate',
    );

    const { result } = renderHook(() => useTemplateForm());

    await waitFor(async () => {
      await result.current.onCreate({});

      expect(result.current.isCreating).toBe(true);

      await result.current.onCreate({});
      await result.current.onCreate({});
      await result.current.onCreate({});

      expect(mockDecoratorsRun).toHaveBeenCalledTimes(1);
      expect(spyCreateTemplate).toHaveBeenCalledTimes(1);
    });
  });
});
