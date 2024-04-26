/*
 * Copyright 2023 The Backstage Authors
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
import { IdentityApi } from '@backstage/core-plugin-api';
import ReactGA from 'react-ga4';
import { GoogleAnalytics4 } from './GoogleAnalytics4';
import { UaEventOptions } from 'react-ga4/types/ga4';

const fnEvent = jest.spyOn(ReactGA, 'event');

fnEvent.mockImplementation(
  // @ts-ignore
  (optionsOrName: string | UaEventOptions, params?: any) => {
    return;
  },
);

const fnSet = jest.spyOn(ReactGA, 'set');
// @ts-ignore
fnSet.mockImplementation((fieldObject: any) => {
  return;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GoogleAnalytics4', () => {
  const context = {
    extension: 'App',
    pluginId: 'some-plugin',
    routeRef: 'unknown',
    releaseNum: 1337,
  };
  const measurementId = 'G-000000-0';
  const basicValidConfig = new ConfigReader({
    app: {
      analytics: { ga4: { measurementId: measurementId, testMode: true } },
    },
  });

  describe('fromConfig', () => {
    it('throws when missing measurementId', () => {
      const config = new ConfigReader({ app: { analytics: { ga4: {} } } });
      expect(() => GoogleAnalytics4.fromConfig(config)).toThrow(
        /Missing required config value/,
      );
    });

    it('returns implementation', () => {
      const api = GoogleAnalytics4.fromConfig(basicValidConfig);

      expect(api.captureEvent).toBeDefined();

      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });
      expect(fnEvent).toHaveBeenCalledWith('page_view', {
        action: 'page_view',
        label: '/',
        category: 'App',
      });
    });
  });

  describe('integration', () => {
    const searchConfig = new ConfigReader({
      app: {
        analytics: {
          ga4: {
            measurementId: measurementId,
            testMode: true,
            virtualSearchPageView: {
              mode: 'both',
              searchQuery: 'term',
            },
          },
        },
      },
    });

    const configWithContentGrouping = new ConfigReader({
      app: {
        analytics: {
          ga4: {
            measurementId: measurementId,
            testMode: true,
            contentGrouping: 'pluginId',
          },
        },
      },
    });

    const advancedConfig = new ConfigReader({
      app: {
        analytics: {
          ga4: {
            measurementId: measurementId,
            testMode: true,
            allowedContexts: ['pluginId', 'releaseNum'],
            allowedAttributes: ['extraDimension', 'extraMetric'],
          },
        },
      },
    });

    const allowAllContextsAndAttrsConfig = new ConfigReader({
      app: {
        analytics: {
          ga4: {
            measurementId: measurementId,
            testMode: true,
            allowedContexts: ['*'],
            allowedAttributes: ['*'],
          },
        },
      },
    });

    it('testing content grouping', () => {
      const api = GoogleAnalytics4.fromConfig(configWithContentGrouping);
      api.captureEvent({
        action: 'navigate',
        subject: '/a-page',
        context,
      });

      expect(fnEvent).toHaveBeenCalledWith('page_view', {
        action: 'page_view',
        label: '/a-page',
        category: 'App',
        value: undefined,
        content_group: context.pluginId,
      });
    });

    it('tracks search', () => {
      const api = GoogleAnalytics4.fromConfig(searchConfig);
      const expectedAction = 'search';
      const expectedLabel = 'search-term';
      const expectedValue = 42;
      api.captureEvent({
        action: expectedAction,
        subject: expectedLabel,
        value: expectedValue,
        context,
      });
      expect(fnEvent).toHaveBeenCalledWith('search', {
        action: 'search',
        category: 'App',
        label: 'search-term',
        value: 42,
        search_term: 'search-term',
      });
    });

    it('tracks basic event', () => {
      const api = GoogleAnalytics4.fromConfig(basicValidConfig);

      const expectedAction = 'click';
      const expectedLabel = 'on something';
      const expectedValue = 42;
      api.captureEvent({
        action: expectedAction,
        subject: expectedLabel,
        value: expectedValue,
        context,
      });

      expect(fnEvent).toHaveBeenCalledWith('click', {
        action: 'click',
        category: context.extension,
        label: 'on something',
        value: expectedValue,
      });
    });

    it('captures configured custom dimensions/metrics on pageviews', () => {
      const api = GoogleAnalytics4.fromConfig(advancedConfig);
      api.captureEvent({
        action: 'navigate',
        subject: '/a-page',
        context,
      });

      expect(fnEvent).toHaveBeenCalledWith('page_view', {
        action: 'page_view',
        label: '/a-page',
        category: 'App',
        value: undefined,
        c_pluginId: context.pluginId,
        c_releaseNum: context.releaseNum,
      });
    });

    it('captures all dimensions/metrics on pageviews', () => {
      const api = GoogleAnalytics4.fromConfig(allowAllContextsAndAttrsConfig);
      api.captureEvent({
        action: 'navigate',
        subject: '/a-page',
        context,
        attributes: {
          'attr-1': 'attr-value-1',
          'attr-2': 'attr-value-2',
        },
      });
      expect(fnEvent).toHaveBeenCalledWith('page_view', {
        action: 'page_view',
        category: 'App',
        label: '/a-page',
        value: undefined,
        c_pluginId: context.pluginId,
        c_releaseNum: context.releaseNum,
        c_routeRef: context.routeRef,
        c_extension: context.extension,
        'a_attr-1': 'attr-value-1',
        'a_attr-2': 'attr-value-2',
      });
    });

    it('captures configured custom dimensions/metrics on events', () => {
      const api = GoogleAnalytics4.fromConfig(advancedConfig);

      const expectedAction = 'search';
      const expectedLabel = 'some query';
      const expectedValue = 5;
      api.captureEvent({
        action: expectedAction,
        subject: expectedLabel,
        value: expectedValue,
        attributes: {
          extraDimension: false,
          extraMetric: 0,
        },
        context,
      });

      expect(fnEvent).toHaveBeenCalledWith('search', {
        action: 'search',
        category: context.extension,
        label: expectedLabel,
        value: expectedValue,
        c_pluginId: context.pluginId,
        c_releaseNum: context.releaseNum,
        search_term: expectedLabel,
      });
    });

    it('does not pass non-numeric data on metrics', () => {
      const api = GoogleAnalytics4.fromConfig(advancedConfig);

      api.captureEvent({
        action: 'verb',
        subject: 'noun',
        attributes: {
          extraMetric: 'not a number',
        },
        context,
      });

      expect(fnEvent).not.toHaveBeenCalledWith({
        category: context.extension,
        action: 'verb',
        label: 'noun',
        c_pluginId: context.pluginId,
        c_releaseNum: context.releaseNum,
        c_extraMetric: 'not a number',
      });
    });
  });

  describe('identityApi', () => {
    const identityApi = {
      getBackstageIdentity: jest.fn().mockResolvedValue({
        userEntityRef: 'User:default/someone',
      }),
    } as unknown as IdentityApi;

    it('does not set userId unless explicitly configured', async () => {
      // Instantiate with identityApi and default configs.
      const api = GoogleAnalytics4.fromConfig(basicValidConfig, {
        identityApi,
      });
      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });

      // Wait for any/all promises involved to settle.
      await new Promise(resolve => setTimeout(resolve));
      // There should not have been a UserID set.
      expect(fnSet).not.toHaveBeenCalled();
    });

    it('sets hashed userId when identityApi is provided', async () => {
      // Instantiate with identityApi and identity set to optional
      const optionalConfig = new ConfigReader({
        app: {
          analytics: {
            ga4: {
              measurementId: measurementId,
              testMode: true,
              identity: 'optional',
            },
          },
        },
      });
      const api = GoogleAnalytics4.fromConfig(optionalConfig, { identityApi });
      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });

      // Wait for any/all promises involved to settle.
      await new Promise(resolve => setTimeout(resolve));

      expect(fnSet).toHaveBeenCalledTimes(1);
      expect(fnSet).toHaveBeenCalledWith({
        // String indicating userEntityRef went through expected hashing.
        user_id: '557365723a64656661756c742f736f6d656f6e65',
      });
    });

    it('set custom-hashed userId when userIdTransform is provided', async () => {
      const userIdTransform = jest.fn().mockResolvedValue('s0m3hash3dvalu3');
      const optionalConfig = new ConfigReader({
        app: {
          analytics: {
            ga4: {
              measurementId: measurementId,
              testMode: true,
              identity: 'optional',
            },
          },
        },
      });
      const api = GoogleAnalytics4.fromConfig(optionalConfig, {
        identityApi,
        userIdTransform,
      });
      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });

      // Wait for any/all promises involved to settle.
      await new Promise(resolve => setTimeout(resolve));

      // User ID should have been set after the pageview.
      expect(fnSet).toHaveBeenCalledWith({
        user_id: 's0m3hash3dvalu3',
      });
      expect(userIdTransform).toHaveBeenCalledWith('User:default/someone');
    });

    it('does not set userId when identityApi is provided and ga4.identity is explicitly disabled', async () => {
      // Instantiate with identityApi and identity explicitly disabled.
      const disabledConfig = new ConfigReader({
        app: {
          analytics: {
            ga4: {
              measurementId: measurementId,
              testMode: true,
              identity: 'disabled',
            },
          },
        },
      });
      const api = GoogleAnalytics4.fromConfig(disabledConfig, { identityApi });
      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });

      // Wait for any/all promises involved to settle.
      await new Promise(resolve => setTimeout(resolve));

      // A pageview should have been fired immediately.
      expect(fnEvent).toHaveBeenCalledWith('page_view', {
        action: 'page_view',
        label: '/',
        category: 'App',
        value: undefined,
      });

      // There should not have been a UserID set.
      expect(fnSet).toHaveBeenCalledTimes(0);
    });

    it('throws error when ga4.identity is required but no identityApi is provided', async () => {
      // Instantiate without identityApi and identity explicitly disabled.
      const requiredConfig = new ConfigReader({
        app: {
          analytics: {
            ga4: {
              measurementId: measurementId,
              testMode: true,
              identity: 'required',
            },
          },
        },
      });

      expect(() => GoogleAnalytics4.fromConfig(requiredConfig)).toThrow();
    });

    it('defers event capture when ga4.identity is required', async () => {
      // Instantiate with identityApi and identity explicitly required.
      const requiredConfig = new ConfigReader({
        app: {
          analytics: {
            ga4: {
              measurementId: measurementId,
              testMode: true,
              identity: 'required',
            },
          },
        },
      });
      const api = GoogleAnalytics4.fromConfig(requiredConfig, { identityApi });

      // Fire a pageview and an event.
      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });
      api.captureEvent({
        action: 'test',
        subject: 'some label',
        context,
      });

      // Wait for any/all promises involved to settle.
      await new Promise(resolve => setTimeout(resolve));

      // User ID should have been set first.
      expect(fnSet).toHaveBeenCalledWith({
        // String indicating userEntityRef went through expected hashing.
        user_id: '557365723a64656661756c742f736f6d656f6e65',
      });

      // Then a pageview should have been fired with a queue time.
      expect(fnEvent).toHaveBeenCalledWith('page_view', {
        action: 'page_view',
        label: '/',
        timestamp_micros: expect.any(Number),
        value: undefined,
        category: 'App',
      });

      // Then an event should have been fired with a queue time.
      expect(fnEvent).toHaveBeenCalledWith('test', {
        action: 'test',
        timestamp_micros: expect.any(Number),
        label: 'some label',
        category: 'App',
        value: undefined,
      });

      // And subsequent hits should not have a queue time.
      api.captureEvent({
        action: 'navigate',
        subject: '/page-2',
        context,
      });

      expect(fnEvent).toHaveBeenCalledWith('page_view', {
        action: 'page_view',
        label: '/page-2',
        category: 'App',
        value: undefined,
      });
    });
  });

  describe('api backward compatibility', () => {
    it('continue working with legacy App category', () => {
      const api = GoogleAnalytics4.fromConfig(basicValidConfig);

      expect(api.captureEvent).toBeDefined();

      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });

      expect(fnEvent).toHaveBeenCalledWith('page_view', {
        action: 'page_view',
        label: '/',
        category: 'App',
      });
    });

    it('use lowercase app as the new default category', () => {
      const api = GoogleAnalytics4.fromConfig(basicValidConfig);

      expect(api.captureEvent).toBeDefined();

      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context: { ...context, extensionId: '', extension: '' },
      });

      expect(fnEvent).toHaveBeenCalledWith('page_view', {
        action: 'page_view',
        label: '/',
        category: 'App',
      });
    });

    it('prioritize new context extension id over old extension property', () => {
      const api = GoogleAnalytics4.fromConfig(basicValidConfig);

      expect(api.captureEvent).toBeDefined();

      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context: { ...context, extensionId: 'app', extension: '' },
      });

      expect(fnEvent).toHaveBeenCalledWith('page_view', {
        action: 'page_view',
        label: '/',
        category: 'app',
      });
    });
  });
});
