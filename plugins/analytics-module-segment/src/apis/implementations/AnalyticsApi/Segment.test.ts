/*
 * Copyright 2022 The Backstage Authors
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
import { SegmentAnalytics } from './Segment';

const mockIdentify = jest.fn();
const mockPage = jest.fn();
const mockTrack = jest.fn();
jest.mock('@segment/analytics-next', () => {
  return {
    AnalyticsBrowser: {
      load: jest.fn(() => {
        return {
          identify: mockIdentify,
          page: mockPage,
          track: mockTrack,
        };
      }),
    },
  };
});

describe('SegmentAnalytics', () => {
  const context = {
    extension: 'App',
    pluginId: 'some-plugin',
    routeRef: 'unknown',
    releaseNum: 1337,
  };
  const writeKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  const basicValidConfig = new ConfigReader({
    app: { analytics: { segment: { writeKey, testMode: false } } },
  });

  describe('fromConfig', () => {
    it('throws when missing writeKey', () => {
      const config = new ConfigReader({ app: { analytics: { segment: {} } } });
      expect(() => SegmentAnalytics.fromConfig(config)).toThrowError(
        /Missing required config value/,
      );
    });

    it('returns implementation', () => {
      const api = SegmentAnalytics.fromConfig(basicValidConfig);
      expect(api.captureEvent).toBeDefined();
    });
  });

  describe('integration', () => {
    it('track identify calls', () => {
      const api = SegmentAnalytics.fromConfig(basicValidConfig);
      api.captureEvent({
        action: 'identify',
        subject: 'jdoe',
        context,
      });

      expect(mockIdentify).toBeCalledTimes(1);
    });

    it('tracks basic pageview', () => {
      const api = SegmentAnalytics.fromConfig(basicValidConfig);
      api.captureEvent({
        action: 'navigate',
        subject: '/',
        context,
      });

      expect(mockPage).toBeCalledTimes(1);
    });

    it('tracks basic event', () => {
      const api = SegmentAnalytics.fromConfig(basicValidConfig);

      const expectedAction = 'click';
      const expectedLabel = 'on something';
      const expectedValue = 42;
      api.captureEvent({
        action: expectedAction,
        subject: expectedLabel,
        value: expectedValue,
        context,
      });

      expect(mockTrack).toBeCalledTimes(1);
    });
  });
});
