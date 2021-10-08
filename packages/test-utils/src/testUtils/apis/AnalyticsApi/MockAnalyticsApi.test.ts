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

import { MockAnalyticsApi } from './MockAnalyticsApi';

describe('MockAnalyticsApi', () => {
  const context = {
    pluginId: 'some-plugin',
    routeRef: 'some-route-ref',
    extension: 'some-extension',
  };

  it('should collect events', () => {
    const api = new MockAnalyticsApi();

    api.captureEvent({ action: 'action-1', subject: 'subject-1', context });
    api.captureEvent({
      action: 'action-2',
      subject: 'subject-2',
      value: 42,
      context,
    });
    api.captureEvent({
      action: 'action-3',
      subject: 'subject-3',
      value: 1337,
      attributes: { some: 'context' },
      context,
    });

    expect(api.getEvents()[0]).toMatchObject({
      subject: 'subject-1',
      action: 'action-1',
      context,
    });
    expect(api.getEvents()[1]).toMatchObject({
      subject: 'subject-2',
      action: 'action-2',
      value: 42,
      context,
    });
    expect(api.getEvents()[2]).toMatchObject({
      subject: 'subject-3',
      action: 'action-3',
      value: 1337,
      context,
      attributes: {
        some: 'context',
      },
    });
  });
});
