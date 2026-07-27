/*
 * Copyright 2026 The Backstage Authors
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
import { UsageAnalyticsClient } from './UsageAnalyticsClient';

describe('UsageAnalyticsClient', () => {
  it('builds report query parameters', async () => {
    const fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ buckets: [] }),
    });
    const client = new UsageAnalyticsClient(
      { getBaseUrl: jest.fn().mockResolvedValue('http://api') },
      { fetch },
    );

    await client.getTimeseries('week', {
      from: '2026-01-01T00:00:00Z',
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://api/v1/timeseries?from=2026-01-01T00%3A00%3A00Z&interval=week',
    );

    await client.getPages({
      limit: 25,
      offset: 50,
      orderField: 'pageViews',
      orderDirection: 'desc',
    });

    expect(fetch).toHaveBeenLastCalledWith(
      'http://api/v1/pages?limit=25&offset=50&orderField=pageViews&orderDirection=desc',
    );
  });
});
