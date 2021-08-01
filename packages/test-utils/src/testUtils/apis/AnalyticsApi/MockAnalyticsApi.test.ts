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
  const domain = {
    pluginId: 'some-plugin',
  };

  it('should collect events', () => {
    const api = new MockAnalyticsApi();
    const tracker = api.getDecoratedTracker({ domain });

    tracker.captureEvent('verb-1', 'noun-1');
    tracker.captureEvent('verb-2', 'noun-2', 42);
    tracker.captureEvent('verb-3', 'noun-3', 1337, { some: 'context' });

    expect(api.getEvents()[0]).toMatchObject({
      noun: 'noun-1',
      verb: 'verb-1',
      domain,
    });
    expect(api.getEvents()[1]).toMatchObject({
      noun: 'noun-2',
      verb: 'verb-2',
      value: 42,
      domain,
    });
    expect(api.getEvents()[2]).toMatchObject({
      noun: 'noun-3',
      verb: 'verb-3',
      value: 1337,
      domain,
      context: {
        some: 'context',
      },
    });
  });
});
