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
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { analyticsApi } from './AnalyticsApi';
import {
  AnalyticsImplementationBlueprint,
  AnalyticsImplementation,
  ApiBlueprint,
  configApiRef,
  createExtension,
  identityApiRef,
} from '@backstage/frontend-plugin-api';

describe('analyticsApi', () => {
  const mockEvent = {
    action: '',
    subject: '',
    context: {
      pluginId: '',
      extensionId: '',
      routeRef: '',
    },
  };
  const captureEventSpy1 = jest.fn();
  const MockImplementation1 = createExtension({
    name: 'mock-implementation-1',
    attachTo: { id: 'api:analytics', input: 'implementations' },
    output: [AnalyticsImplementationBlueprint.dataRefs.factory],
    factory() {
      return [
        AnalyticsImplementationBlueprint.dataRefs.factory({
          deps: { configApi: configApiRef },
          factory: deps => ({
            captureEvent: event => captureEventSpy1(event, deps),
          }),
        }),
      ];
    },
  });
  const captureEventSpy2 = jest.fn();
  const MockImplementation2 = createExtension({
    name: 'mock-implementation-2',
    attachTo: { id: 'api:analytics', input: 'implementations' },
    output: [AnalyticsImplementationBlueprint.dataRefs.factory],
    factory() {
      return [
        AnalyticsImplementationBlueprint.dataRefs.factory({
          deps: { config: configApiRef, identityApi: identityApiRef },
          factory: deps => ({
            captureEvent: event => captureEventSpy2(event, deps),
          }),
        }),
      ];
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('wires up a single AnalyticsImplementationFactory', async () => {
    // Given the Analytics API and a single mock implementation
    const tester = createExtensionTester(analyticsApi).add(MockImplementation1);
    const apiFactory = tester.get(ApiBlueprint.dataRefs.factory);

    // Then the API's deps should contain the mock implementation's deps.
    expect(apiFactory.deps).toMatchObject({
      'core.config': expect.anything(),
    });

    // And the returned instance should be an Analytics Implementation
    const concreteImplementation = apiFactory.factory({
      'core.config': 'ConfigApiImplementation',
    });
    expect(concreteImplementation).toHaveProperty('captureEvent');

    // When the resulting API's captureEvent method is called
    (concreteImplementation as AnalyticsImplementation).captureEvent(mockEvent);

    // Then the mock implementation's captureEvent should have been called
    expect(captureEventSpy1.mock.calls[0][0]).toEqual(mockEvent);

    // And the mock's factory should have resolved the expected deps
    expect(captureEventSpy1.mock.calls[0][1]).toEqual({
      configApi: 'ConfigApiImplementation',
    });
  });

  it('wires up more than one AnalyticsImplementationFactory', () => {
    // Given the Analytics API and two mock implementations
    const tester = createExtensionTester(analyticsApi)
      .add(MockImplementation1)
      .add(MockImplementation2);
    const apiFactory = tester.get(ApiBlueprint.dataRefs.factory);

    // Then the API's deps should contain the mock implementations' deps.
    expect(apiFactory.deps).toMatchObject({
      'core.config': expect.anything(),
      'core.identity': expect.anything(),
    });

    // And the returned instance should be an Analytics Implementation
    const concreteImplementation = apiFactory.factory({
      'core.config': 'ConfigApiImplementation',
      'core.identity': 'IdentityApiImplementation',
    });
    expect(concreteImplementation).toHaveProperty('captureEvent');

    // When the resulting API's captureEvent method is called
    (concreteImplementation as AnalyticsImplementation).captureEvent(mockEvent);

    // Then the 1st mock implementation's captureEvent should have been called
    expect(captureEventSpy1.mock.calls[0][0]).toEqual(mockEvent);

    // And the 1st mock's factory should have resolved the expected deps
    expect(captureEventSpy1.mock.calls[0][1]).toEqual({
      configApi: 'ConfigApiImplementation',
    });

    // And the 2nd mock implementation's captureEvent should have been called
    expect(captureEventSpy2.mock.calls[0][0]).toEqual(mockEvent);

    // And the 2nd mock's factory should have resolved the expected deps
    expect(captureEventSpy2.mock.calls[0][1]).toEqual({
      config: 'ConfigApiImplementation',
      identityApi: 'IdentityApiImplementation',
    });
  });

  it('works fine with no AnalyticsImplementationFactory instances provided', () => {
    // Given the Analytics API and no mock implementations
    const tester = createExtensionTester(analyticsApi);
    const apiFactory = tester.get(ApiBlueprint.dataRefs.factory);

    // Then the API's deps should be empty
    expect(apiFactory.deps).toEqual({});

    // And the returned instance should be an Analytics Implementation
    const concreteImplementation = apiFactory.factory({});
    expect(concreteImplementation).toHaveProperty('captureEvent');

    // Invoking the API's captureEvent method should result in no errors
    expect(() =>
      (concreteImplementation as AnalyticsImplementation).captureEvent(
        mockEvent,
      ),
    ).not.toThrow();
  });
});
