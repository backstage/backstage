/*
 * Copyright 2024 The Backstage Authors
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
import { MultipleAnalyticsApi } from './MultipleAnalyticsApi';

describe('MultipleAnalyticsApi', () => {
  const analyticsApiOne = { captureEvent: jest.fn() };
  const analyticsApiTwo = { captureEvent: jest.fn() };
  const multipleApis = MultipleAnalyticsApi.fromApis([
    analyticsApiOne,
    analyticsApiTwo,
  ]);

  const event = {
    action: 'navivate',
    subject: '/path',
    context: {
      extension: 'App',
      pluginId: 'plugin',
      routeRef: 'unknown',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards events to all apis', () => {
    // When an event is captured
    multipleApis.captureEvent(event);

    // Then both underlying APIs should have received the event
    expect(analyticsApiOne.captureEvent).toHaveBeenCalledTimes(1);
    expect(analyticsApiOne.captureEvent).toHaveBeenCalledWith(event);
    expect(analyticsApiTwo.captureEvent).toHaveBeenCalledTimes(1);
    expect(analyticsApiTwo.captureEvent).toHaveBeenCalledWith(event);
  });

  it('forwards events to all apis even if one throws an error', () => {
    // Given one underlying API that throws on capture
    analyticsApiOne.captureEvent.mockImplementation(() => {
      throw new Error('!!!');
    });

    // When an event is captured
    multipleApis.captureEvent(event);

    // Then the other underlying API should have still received the event
    expect(analyticsApiTwo.captureEvent).toHaveBeenCalledTimes(1);
    expect(analyticsApiTwo.captureEvent).toHaveBeenCalledWith(event);
  });
});
