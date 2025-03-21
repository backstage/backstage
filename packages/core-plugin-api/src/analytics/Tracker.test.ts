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

import { getOrCreateGlobalSingleton } from '@backstage/version-bridge';
import { Tracker, routableExtensionRenderedEvent } from './Tracker';

describe('Tracker', () => {
  const defaultContext = {
    routeRef: 'unknown',
    pluginId: 'root',
    extension: 'App',
  };
  const globalEvents = getOrCreateGlobalSingleton<any>(
    'core-plugin-api:analytics-tracker-events',
    () => ({}),
  );
  const analyticsApiSpy = {
    captureEvent: jest.fn(),
  };
  let trackerUnderTest: Tracker;

  beforeEach(() => {
    // Reset mocks and global state
    jest.resetAllMocks();
    globalEvents.mostRecentGatheredNavigation = undefined;
    globalEvents.mostRecentRoutableExtensionRender = undefined;

    // Set up a new tracker to test.
    trackerUnderTest = new Tracker(analyticsApiSpy);
  });

  it('captures simple event with default context', () => {
    trackerUnderTest.captureEvent('click', 'test 1');

    expect(analyticsApiSpy.captureEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'click',
        subject: 'test 1',
        context: defaultContext,
      }),
    );
  });

  it('captures simple event with set context', () => {
    trackerUnderTest.setContext({
      routeRef: 'catalog:entity',
      pluginId: 'catalog',
      extension: 'App',
    });
    trackerUnderTest.captureEvent('click', 'test 2', {
      value: 2,
      attributes: { to: '/page-2' },
    });

    expect(analyticsApiSpy.captureEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'click',
        subject: 'test 2',
        value: 2,
        attributes: { to: '/page-2' },
        context: {
          routeRef: 'catalog:entity',
          pluginId: 'catalog',
          extension: 'App',
        },
      }),
    );
  });

  describe('accurate navigate events', () => {
    it('never captures _routeNodeType context key on navigate event', () => {
      trackerUnderTest.setContext({
        routeRef: 'catalog:entity',
        pluginId: 'catalog',
        extension: 'App',
        _routeNodeType: 'mounted',
      });
      trackerUnderTest.captureEvent('navigate', '/page-3');

      const receivedContext =
        analyticsApiSpy.captureEvent.mock.calls[0][0].context;
      expect(receivedContext.pluginId).toBe('catalog');
      expect(receivedContext._routeNodeType).toBe(undefined);
    });

    it('never immediately captures navigate event with _routeNodeType "gathered"', () => {
      trackerUnderTest.setContext({
        ...defaultContext,
        _routeNodeType: 'gathered',
      });
      trackerUnderTest.captureEvent('navigate', '/page-4');

      expect(analyticsApiSpy.captureEvent).not.toHaveBeenCalled();
    });

    it('never captures "routable-extension-rendered" events', () => {
      trackerUnderTest.captureEvent(routableExtensionRenderedEvent, '');

      expect(analyticsApiSpy.captureEvent).not.toHaveBeenCalled();
    });

    it('captures deferred navigate event with expected context', () => {
      // User navigates to a gathered mountpoint with multiple plugins
      trackerUnderTest.setContext({
        ...defaultContext,
        _routeNodeType: 'gathered',
      });
      trackerUnderTest.captureEvent('navigate', '/page-5');

      // A routable extension is rendered with specific plugin context
      trackerUnderTest.setContext({
        routeRef: 'some:ref',
        pluginId: 'some-plugin',
        extension: 'App',
      });
      trackerUnderTest.captureEvent(routableExtensionRenderedEvent, '');

      // A non-navigate event
      trackerUnderTest.captureEvent('click', 'test 5');

      expect(analyticsApiSpy.captureEvent).toHaveBeenCalledTimes(2);
      expect(analyticsApiSpy.captureEvent).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          action: 'navigate',
          subject: '/page-5',
          context: {
            routeRef: 'some:ref',
            pluginId: 'some-plugin',
            extension: 'App',
          },
        }),
      );
      expect(analyticsApiSpy.captureEvent).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          action: 'click',
          subject: 'test 5',
          context: {
            routeRef: 'some:ref',
            pluginId: 'some-plugin',
            extension: 'App',
          },
        }),
      );
    });

    it('captures deferred navigate event with expected context when second event is also deferrable', () => {
      // User navigates to a gathered mountpoint with multiple plugins
      trackerUnderTest.setContext({
        ...defaultContext,
        _routeNodeType: 'gathered',
      });
      trackerUnderTest.captureEvent('navigate', '/page-6');

      // A routable extension is rendered with specific plugin context
      trackerUnderTest.setContext({
        routeRef: 'another:ref',
        pluginId: 'another-plugin',
        extension: 'App',
      });
      trackerUnderTest.captureEvent(routableExtensionRenderedEvent, '');

      // User navigates to another gathered mountpoint with multiple plugins
      trackerUnderTest.setContext({
        ...defaultContext,
        _routeNodeType: 'gathered',
      });
      trackerUnderTest.captureEvent('navigate', '/page-6-2');

      expect(analyticsApiSpy.captureEvent).toHaveBeenCalledTimes(1);
      expect(analyticsApiSpy.captureEvent).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          action: 'navigate',
          subject: '/page-6',
          context: {
            routeRef: 'another:ref',
            pluginId: 'another-plugin',
            extension: 'App',
          },
        }),
      );
    });

    it('captures deferred navigate event with default context when no extension is rendered in between', () => {
      // User navigates to a gathered mountpoint with multiple plugins
      trackerUnderTest.setContext({
        ...defaultContext,
        _routeNodeType: 'gathered',
      });
      trackerUnderTest.captureEvent('navigate', '/page-7');

      // A non-navigate event with no routable extension render in between
      trackerUnderTest.captureEvent('click', 'test 7');

      expect(analyticsApiSpy.captureEvent).toHaveBeenCalledTimes(2);
      expect(analyticsApiSpy.captureEvent).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          action: 'navigate',
          subject: '/page-7',
          context: defaultContext,
        }),
      );
      expect(analyticsApiSpy.captureEvent).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          action: 'click',
          subject: 'test 7',
          context: defaultContext,
        }),
      );
    });

    it('captures deferred navigate event with expected context across separate trackers', () => {
      // User navigates to a gathered mountpoint with multiple plugins
      trackerUnderTest.setContext({
        ...defaultContext,
        _routeNodeType: 'gathered',
      });
      trackerUnderTest.captureEvent('navigate', '/page-8');

      // A routable extension is rendered with specific plugin context and
      // captured via a separate tracker instance.
      const anotherTracker = new Tracker(analyticsApiSpy, {
        routeRef: 'the:ref',
        pluginId: 'the-plugin',
        extension: 'App',
      });
      anotherTracker.captureEvent(routableExtensionRenderedEvent, '');

      // A non-navigate event is captured
      const aThirdTracker = new Tracker(analyticsApiSpy);
      aThirdTracker.captureEvent('click', 'test 8');

      expect(analyticsApiSpy.captureEvent).toHaveBeenCalledTimes(2);
      expect(analyticsApiSpy.captureEvent).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          action: 'navigate',
          subject: '/page-8',
          context: {
            routeRef: 'the:ref',
            pluginId: 'the-plugin',
            extension: 'App',
          },
        }),
      );
      expect(analyticsApiSpy.captureEvent).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          action: 'click',
          subject: 'test 8',
        }),
      );
    });

    it('replaces extension context with "App" when capturing deferred events', () => {
      // User navigates to a gathered mountpoint with multiple plugins
      trackerUnderTest.setContext({
        ...defaultContext,
        _routeNodeType: 'gathered',
      });
      trackerUnderTest.captureEvent('navigate', '/page-9');

      // A routable extension is rendered with specific plugin context
      trackerUnderTest.setContext({
        routeRef: 'very:ref',
        pluginId: 'very-plugin',
        extension: 'ShouldBeReplaced',
      });
      trackerUnderTest.captureEvent(routableExtensionRenderedEvent, '');

      // A non-navigate event
      trackerUnderTest.captureEvent('click', 'test 9');

      // Extension context should have been replaced with just "App"
      expect(analyticsApiSpy.captureEvent).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          action: 'navigate',
          subject: '/page-9',
          context: {
            routeRef: 'very:ref',
            pluginId: 'very-plugin',
            extension: 'App',
          },
        }),
      );
    });
  });
});
