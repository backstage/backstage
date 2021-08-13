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
import ReactGA from 'react-ga';
import { GoogleAnalytics } from './GoogleAnalytics';

describe('GoogleAnalytics', () => {
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
      expect(() => GoogleAnalytics.fromConfig(config)).toThrowError(
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
    const domain = {
      componentName: 'App',
      pluginId: 'some-plugin',
      releaseNum: 1337,
    };
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
                source: 'domain',
                attribute: 'pluginId',
              },
              {
                type: 'dimension',
                index: 2,
                source: 'context',
                attribute: 'extraDimension',
              },
              {
                type: 'metric',
                index: 1,
                source: 'domain',
                attribute: 'releaseNum',
              },
              {
                type: 'metric',
                index: 2,
                source: 'context',
                attribute: 'extraMetric',
              },
            ],
          },
        },
      },
    });

    it('tracks basic pageview', () => {
      const api = GoogleAnalytics.fromConfig(basicValidConfig);
      api.captureEvent({
        verb: 'navigate',
        noun: '/',
        domain,
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
        verb: expectedAction,
        noun: expectedLabel,
        value: expectedValue,
        domain,
      });

      const [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'event',
        eventCategory: domain.componentName,
        eventAction: expectedAction,
        eventLabel: expectedLabel,
        eventValue: expectedValue,
      });
    });

    it('captures configured custom dimensions/metrics on pageviews', () => {
      const api = GoogleAnalytics.fromConfig(advancedConfig);
      api.captureEvent({
        verb: 'navigate',
        noun: '/a-page',
        domain,
      });

      // Expect a set command first.
      const [setCommand, setData] = ReactGA.testModeAPI.calls[1];
      expect(setCommand).toBe('set');
      expect(setData).toMatchObject({
        dimension1: domain.pluginId,
        metric1: domain.releaseNum,
      });

      // Followed by a send command.
      const [sendCommand, sendData] = ReactGA.testModeAPI.calls[2];
      expect(sendCommand).toBe('send');
      expect(sendData).toMatchObject({
        hitType: 'pageview',
        page: '/a-page',
      });
    });

    it('captures configured custom dimensions/metrics on events', () => {
      const api = GoogleAnalytics.fromConfig(advancedConfig);

      const expectedAction = 'search';
      const expectedLabel = 'some query';
      const expectedValue = 5;
      api.captureEvent({
        verb: expectedAction,
        noun: expectedLabel,
        value: expectedValue,
        context: {
          extraDimension: false,
          extraMetric: 0,
        },
        domain,
      });

      const [command, data] = ReactGA.testModeAPI.calls[1];
      expect(command).toBe('send');
      expect(data).toMatchObject({
        hitType: 'event',
        eventCategory: domain.componentName,
        eventAction: expectedAction,
        eventLabel: expectedLabel,
        eventValue: expectedValue,
        dimension1: domain.pluginId,
        metric1: domain.releaseNum,
        dimension2: false,
        metric2: 0,
      });
    });

    it('does not pass non-numeric data on metrics', () => {
      const api = GoogleAnalytics.fromConfig(advancedConfig);

      api.captureEvent({
        verb: 'verb',
        noun: 'noun',
        context: {
          extraMetric: 'not a number',
        },
        domain,
      });

      const [, data] = ReactGA.testModeAPI.calls[1];
      expect(data).not.toMatchObject({
        metric2: 'not a number',
      });
    });
  });
});
