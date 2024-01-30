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
import { IdentityApi } from '@backstage/core-plugin-api';
import ReactGA from 'react-ga';
import { GoogleAnalytics } from './GoogleAnalytics';

describe('GoogleAnalytics', () => {
  const context = {
    extension: 'App',
    pluginId: 'some-plugin',
    routeRef: 'unknown',
    releaseNum: 1337,
    searchTypes: 'test category',
  };
  const trackingId = 'UA-000000-0';
  const basicValidConfig = new ConfigReader({
    app: { analytics: { ga: { trackingId, testMode: true } } },
  });

  beforeEach(() => {
    ReactGA.testModeAPI.resetCalls();
  });

  describe('fromConfig', () => {
    it('throws when missing trackingId', () => {
      const config = new ConfigReader({ app: { analytics: { ga: {} } } });
      expect(() => GoogleAnalytics.fromConfig(config)).toThrow(
        /Missing required config value/,
      );
    });

    it('returns implementation', () => {
      const api = GoogleAnalytics.fromConfig(basicValidConfig);
      expect(api.captureEvent).toBeDefined();

      // Initializes GA with tracking ID.
      expect(ReactGA.testModeAPI.calls[0]).toEqual([
        'create',
        trackingId,
        'auto',
      ]);
    });
  });

  describe('integration', () => {
    const advancedConfig = new ConfigReader({
      app: {
        analytics: {
          ga: {
            trackingId,
            testMode: true,
            customDimensionsMetrics: [
              {
                type: 'dimension',
                index: 1,
                source: 'context',
                key: 'pluginId',
              },
              {
                type: 'dimension',
                index: 2,
                source: 'attributes',
                key: 'extraDimension',
              },
              {
                type: 'metric',
                index: 1,
                source: 'context',
                key: 'releaseNum',
              },
              {
                type: 'metric',
                index: 2,
                source: 'attributes',
                key: 'extraMetric',
              },
            ],
          },
        },
      },
    });

    it('tracks basic pageview', () => {
      const api = GoogleAnalytics.fromConfig(basicValidConfig);
      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });

      const [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'pageview',
        page: '/',
      });
    });

    it('tracks basic event', () => {
      const api = GoogleAnalytics.fromConfig(basicValidConfig);

      const expectedAction = 'click';
      const expectedLabel = 'on something';
      const expectedValue = 42;
      api.captureEvent({
        action: expectedAction,
        subject: expectedLabel,
        value: expectedValue,
        context,
      });

      const [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'event',
        eventCategory: context.extension,
        eventAction: expectedAction,
        eventLabel: expectedLabel,
        eventValue: expectedValue,
      });
    });

    it('captures configured custom dimensions/metrics on pageviews', () => {
      const api = GoogleAnalytics.fromConfig(advancedConfig);
      api.captureEvent({
        action: 'navigate',
        subject: '/a-page',
        context,
      });

      const [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'pageview',
        page: '/a-page',
        dimension1: context.pluginId,
        metric1: context.releaseNum,
      });
    });

    it('captures virtual pageviews instead of search events', () => {
      const config = new ConfigReader({
        app: {
          analytics: {
            ga: {
              trackingId,
              testMode: true,
              virtualSearchPageView: { mode: 'only' },
            },
          },
        },
      });
      const api = GoogleAnalytics.fromConfig(config);
      api.captureEvent({
        action: 'search',
        subject: 'test search',
        context,
      });

      const [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'pageview',
        page: '/search?query=test+search',
      });
      expect(ReactGA.testModeAPI.calls).toHaveLength(2);
    });

    it('captures virtual pageviews alongside search events', () => {
      const config = new ConfigReader({
        app: {
          analytics: {
            ga: {
              trackingId,
              testMode: true,
              virtualSearchPageView: { mode: 'both' },
            },
          },
        },
      });
      const api = GoogleAnalytics.fromConfig(config);
      api.captureEvent({
        action: 'search',
        subject: 'test search',
        context,
      });

      const [pageviewCommand, pageViewData] = ReactGA.testModeAPI.calls[1];
      expect(pageviewCommand).toBe('send');
      expect(pageViewData).toMatchObject({
        hitType: 'pageview',
        page: '/search?query=test+search',
      });
      const [searchCommand, searchData] = ReactGA.testModeAPI.calls[2];
      expect(searchCommand).toBe('send');
      expect(searchData).toMatchObject({
        hitType: 'event',
        eventCategory: context.extension,
        eventAction: 'search',
        eventLabel: 'test search',
      });
    });

    it('captures virtual pageviews on custom route with custom search query and custom category', () => {
      const config = new ConfigReader({
        app: {
          analytics: {
            ga: {
              trackingId,
              testMode: true,
              virtualSearchPageView: {
                mode: 'only',
                mountPath: '/custom',
                searchQuery: 'term',
                categoryQuery: 'sc',
              },
            },
          },
        },
      });
      const api = GoogleAnalytics.fromConfig(config);
      api.captureEvent({
        action: 'search',
        subject: 'test search',
        context,
      });

      const [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'pageview',
        page: '/custom?term=test+search&sc=test+category',
      });
    });

    it('captures configured custom dimensions/metrics on events', () => {
      const api = GoogleAnalytics.fromConfig(advancedConfig);

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

      const [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'event',
        eventCategory: context.extension,
        eventAction: expectedAction,
        eventLabel: expectedLabel,
        eventValue: expectedValue,
        dimension1: context.pluginId,
        metric1: context.releaseNum,
        dimension2: false,
        metric2: 0,
      });
    });

    it('does not pass non-numeric data on metrics', () => {
      const api = GoogleAnalytics.fromConfig(advancedConfig);

      api.captureEvent({
        action: 'verb',
        subject: 'noun',
        attributes: {
          extraMetric: 'not a number',
        },
        context,
      });

      const [, data] = ReactGA.testModeAPI.calls[1];
      expect(data).not.toMatchObject({
        metric2: 'not a number',
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
      const api = GoogleAnalytics.fromConfig(basicValidConfig, { identityApi });
      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });

      // Wait for any/all promises involved to settle.
      await new Promise(resolve => setTimeout(resolve));

      // A pageview should have been fired immediately.
      const [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'pageview',
        page: '/',
      });

      // There should not have been a UserID set.
      expect(ReactGA.testModeAPI.calls).toHaveLength(2);
    });

    it('sets hashed userId when identityApi is provided', async () => {
      // Instantiate with identityApi and identity set to optional
      const optionalConfig = new ConfigReader({
        app: {
          analytics: {
            ga: { trackingId, testMode: true, identity: 'optional' },
          },
        },
      });
      const api = GoogleAnalytics.fromConfig(optionalConfig, { identityApi });
      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });

      // Wait for any/all promises involved to settle.
      await new Promise(resolve => setTimeout(resolve));

      // A pageview should have been fired immediately.
      const [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'pageview',
        page: '/',
      });

      // User ID should have been set after the pageview.
      const [setCommand, setData] = ReactGA.testModeAPI.calls[2];
      expect(setCommand).toBe('set');
      expect(setData).toMatchObject({
        // String indicating userEntityRef went through expected hashing.
        userId: '557365723a64656661756c742f736f6d656f6e65',
      });
    });

    it('set custom-hashed userId when userIdTransform is provided', async () => {
      const userIdTransform = jest.fn().mockResolvedValue('s0m3hash3dvalu3');
      const optionalConfig = new ConfigReader({
        app: {
          analytics: {
            ga: { trackingId, testMode: true, identity: 'optional' },
          },
        },
      });
      const api = GoogleAnalytics.fromConfig(optionalConfig, {
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
      const [setCommand, setData] = ReactGA.testModeAPI.calls[2];
      expect(setCommand).toBe('set');
      expect(setData).toMatchObject({
        userId: 's0m3hash3dvalu3',
      });
      expect(userIdTransform).toHaveBeenCalledWith('User:default/someone');
    });

    it('does not set userId when identityApi is provided and ga.identity is explicitly disabled', async () => {
      // Instantiate with identityApi and identity explicitly disabled.
      const disabledConfig = new ConfigReader({
        app: {
          analytics: {
            ga: { trackingId, testMode: true, identity: 'disabled' },
          },
        },
      });
      const api = GoogleAnalytics.fromConfig(disabledConfig, { identityApi });
      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });

      // Wait for any/all promises involved to settle.
      await new Promise(resolve => setTimeout(resolve));

      // A pageview should have been fired immediately.
      const [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'pageview',
        page: '/',
      });

      // There should not have been a UserID set.
      expect(ReactGA.testModeAPI.calls).toHaveLength(2);
    });

    it('throws error when ga.identity is required but no identityApi is provided', async () => {
      // Instantiate without identityApi and identity explicitly disabled.
      const requiredConfig = new ConfigReader({
        app: {
          analytics: {
            ga: { trackingId, testMode: true, identity: 'required' },
          },
        },
      });

      expect(() => GoogleAnalytics.fromConfig(requiredConfig)).toThrow();
    });

    it('defers event capture when ga.identity is required', async () => {
      // Instantiate with identityApi and identity explicitly required.
      const requiredConfig = new ConfigReader({
        app: {
          analytics: {
            ga: { trackingId, testMode: true, identity: 'required' },
          },
        },
      });
      const api = GoogleAnalytics.fromConfig(requiredConfig, { identityApi });

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
      const [setCommand, setData] = ReactGA.testModeAPI.calls[1];
      expect(setCommand).toBe('set');
      expect(setData).toMatchObject({
        // String indicating userEntityRef went through expected hashing.
        userId: '557365723a64656661756c742f736f6d656f6e65',
      });

      // Then a pageview should have been fired with a queue time.
      const [pageCommand, pageData] = ReactGA.testModeAPI.calls[2];
      expect(pageCommand).toBe('send');
      expect(pageData).toMatchObject({
        hitType: 'pageview',
        page: '/',
        queueTime: expect.any(Number),
      });

      // Then an event should have been fired with a queue time.
      const [eventCommand, eventData] = ReactGA.testModeAPI.calls[3];
      expect(eventCommand).toBe('send');
      expect(eventData).toMatchObject({
        hitType: 'event',
        queueTime: expect.any(Number),
      });

      // And subsequent hits should not have a queue time.
      api.captureEvent({
        action: 'navigate',
        subject: '/page-2',
        context,
      });

      const [lastCommand, lastData] = ReactGA.testModeAPI.calls[4];
      expect(lastCommand).toBe('send');
      expect(lastData).toMatchObject({
        hitType: 'pageview',
        page: '/page-2',
      });
      expect(lastData.queueTime).toBeUndefined();
    });
  });

  describe('api backward compatibility', () => {
    it('continue working with legacy App category', () => {
      const api = GoogleAnalytics.fromConfig(basicValidConfig);

      expect(api.captureEvent).toBeDefined();

      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });

      let [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'pageview',
        page: '/',
      });

      api.captureEvent({
        action: 'click',
        subject: 'on something',
        value: 42,
        context,
      });

      [command, data] = ReactGA.testModeAPI.calls[2];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'event',
        // expect to use the legacy default category
        eventCategory: 'App',
        eventAction: 'click',
        eventLabel: 'on something',
        eventValue: 42,
      });
    });

    it('use lowercase app as the new default category', () => {
      const api = GoogleAnalytics.fromConfig(basicValidConfig);

      expect(api.captureEvent).toBeDefined();

      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context: {
          ...context,
          extensionId: '',
          extension: '',
        },
      });

      let [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'pageview',
        page: '/',
      });

      api.captureEvent({
        action: 'click',
        subject: 'on something',
        value: 42,
        context: {
          ...context,
          extensionId: '',
          extension: '',
        },
      });

      [command, data] = ReactGA.testModeAPI.calls[2];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'event',
        // expect to use the new default category
        eventCategory: 'App',
        eventAction: 'click',
        eventLabel: 'on something',
        eventValue: 42,
      });
    });

    it('prioritize new context extension id over old extension property', () => {
      const api = GoogleAnalytics.fromConfig(basicValidConfig);

      expect(api.captureEvent).toBeDefined();

      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context: {
          ...context,
          extensionId: 'app',
          extension: '',
        },
      });

      let [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'pageview',
        page: '/',
      });

      api.captureEvent({
        action: 'click',
        subject: 'on something',
        value: 42,
        context: {
          ...context,
          extensionId: 'page:index',
          extension: '',
        },
      });

      [command, data] = ReactGA.testModeAPI.calls[2];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'event',
        // expect use the new context extension id
        eventCategory: 'page:index',
        eventAction: 'click',
        eventLabel: 'on something',
        eventValue: 42,
      });
    });
  });
});
