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

import {
  coreExtensionData,
  createExtension,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import { createApiRef } from '@backstage/core-plugin-api';
import { shallowExtensionInstance } from './shallowExtensionInstance';

const stringDataRef = createExtensionDataRef<string>().with({
  id: 'test.string',
});

const numberDataRef = createExtensionDataRef<number>().with({
  id: 'test.number',
});

interface TestApi {
  getValue(): string;
}

const testApiRef = createApiRef<TestApi>({
  id: 'test.api',
});

describe('shallowExtensionInstance', () => {
  it('should execute extension factory and return outputs', () => {
    const extension = createExtension({
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      factory: () => [stringDataRef('test-value')],
    });

    const instance = shallowExtensionInstance(extension);

    expect(instance.get(stringDataRef)).toBe('test-value');
  });

  it('should support extension config', () => {
    const extension = createExtension({
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      config: {
        schema: {
          prefix: z => z.string().default('default'),
        },
      },
      factory: ({ config }) => [stringDataRef(`${config.prefix}-value`)],
    });

    const instance = shallowExtensionInstance(extension, {
      config: { prefix: 'custom' },
    });

    expect(instance.get(stringDataRef)).toBe('custom-value');
  });

  it('should support custom APIs', () => {
    const mockApi: TestApi = {
      getValue: () => 'api-value',
    };

    const extension = createExtension({
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      factory: ({ apis }) => {
        const api = apis.get(testApiRef);
        return [stringDataRef(api?.getValue() ?? 'no-api')];
      },
    });

    const instance = shallowExtensionInstance(extension, {
      apis: [[testApiRef, mockApi]],
    });

    expect(instance.get(stringDataRef)).toBe('api-value');
  });

  it('should support multiple outputs', () => {
    const extension = createExtension({
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef, numberDataRef],
      factory: () => [stringDataRef('text'), numberDataRef(42)],
    });

    const instance = shallowExtensionInstance(extension);

    expect(instance.get(stringDataRef)).toBe('text');
    expect(instance.get(numberDataRef)).toBe(42);
  });

  it('should return react element output', () => {
    const extension = createExtension({
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [coreExtensionData.reactElement],
      factory: () => [coreExtensionData.reactElement(<div>Test Element</div>)],
    });

    const instance = shallowExtensionInstance(extension);
    const element = instance.get(coreExtensionData.reactElement);

    expect(element).toBeDefined();
    expect(element.props.children).toBe('Test Element');
  });

  it('should be iterable over output values', () => {
    const extension = createExtension({
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef, numberDataRef],
      factory: () => [stringDataRef('text'), numberDataRef(42)],
    });

    const instance = shallowExtensionInstance(extension);
    const outputs = Array.from(instance);

    expect(outputs).toHaveLength(2);
    expect(outputs.map(o => o.id).sort()).toEqual(['test.number', 'test.string']);
  });

  it('should throw for invalid config', () => {
    const extension = createExtension({
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      config: {
        schema: {
          required: z => z.string(),
        },
      },
      factory: ({ config }) => [stringDataRef(config.required)],
    });

    expect(() =>
      shallowExtensionInstance(extension, {
        // @ts-expect-error - missing required config
        config: {},
      }),
    ).toThrow();
  });
});
