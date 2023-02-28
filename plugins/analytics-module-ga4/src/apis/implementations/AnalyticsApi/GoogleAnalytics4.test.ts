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

const fnSend = jest.spyOn(ReactGA, 'send');
// @ts-ignore
fnSend.mockImplementation((fieldObject: any) => {
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
    app: { analytics: { ga4: { measurementId: measurementId, testMode: true } } },
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
      expect(fnSend).toHaveBeenCalledWith({
        hitType: 'pageview',
        page: '/',
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

    it('testing content grouping', () => {
      const api = GoogleAnalytics4.fromConfig(configWithContentGrouping);
      api.captureEvent({
        action: 'navigate',
        subject: '/a-page',
        context,
      });

      expect(fnSend).toHaveBeenCalledWith({
        hitType: 'pageview',
        page: '/a-page',
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
      expect(fnSend).toHaveBeenCalledWith({
        hitType: 'event',
        eventAction: 'search',
        eventCategory: 'App',
        eventLabel: 'search-term',
        eventValue: 42,
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

      expect(fnSend).toHaveBeenCalledWith({
        hitType: 'event',
        eventCategory: context.extension,
        eventAction: expectedAction,
        eventLabel: expectedLabel,
        eventValue: expectedValue,
      });
    });

    it('captures configured custom dimensions/metrics on pageviews', () => {
      const api = GoogleAnalytics4.fromConfig(advancedConfig);
      api.captureEvent({
        action: 'navigate',
        subject: '/a-page',
        context,
      });

      expect(fnSend).toHaveBeenCalledWith({
        hitType: 'pageview',
        page: '/a-page',
        c_pluginId: context.pluginId,
        c_releaseNum: context.releaseNum,
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

      expect(fnSend).toHaveBeenCalledWith({
        hitType: 'event',
        eventCategory: context.extension,
        eventAction: expectedAction,
        eventLabel: expectedLabel,
        eventValue: expectedValue,
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
        eventCategory: context.extension,
        eventAction: 'verb',
        eventLabel: 'noun',
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
            ga4: { measurementId: measurementId, testMode: true, identity: 'optional' },
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
            ga4: { measurementId: measurementId, testMode: true, identity: 'optional' },
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
            ga4: { measurementId: measurementId, testMode: true, identity: 'disabled' },
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
      expect(fnSend).toHaveBeenCalledWith({
        hitType: 'pageview',
        page: '/',
      });

      // There should not have been a UserID set.
      expect(fnSet).toHaveBeenCalledTimes(0);
    });

    it('throws error when ga4.identity is required but no identityApi is provided', async () => {
      // Instantiate without identityApi and identity explicitly disabled.
      const requiredConfig = new ConfigReader({
        app: {
          analytics: {
            ga4: { measurementId: measurementId, testMode: true, identity: 'required' },
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
            ga4: { measurementId: measurementId, testMode: true, identity: 'required' },
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
      expect(fnSend).toHaveBeenCalledWith({
        hitType: 'pageview',
        page: '/',
        timestamp_micros: expect.any(Number),
      });

      // Then an event should have been fired with a queue time.
      expect(fnSend).toHaveBeenCalledWith({
        hitType: 'event',
        timestamp_micros: expect.any(Number),
        eventAction: 'test',
        eventCategory: 'App',
        eventLabel: 'some label',
        eventValue: undefined,
      });

      // And subsequent hits should not have a queue time.
      api.captureEvent({
        action: 'navigate',
        subject: '/page-2',
        context,
      });

      expect(fnSend).toHaveBeenCalledWith({
        hitType: 'pageview',
        page: '/page-2',
      });
    });
  });
});
