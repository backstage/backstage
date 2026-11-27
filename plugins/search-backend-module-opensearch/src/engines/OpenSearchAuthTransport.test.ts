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

import { Transport } from '@opensearch-project/opensearch';
import { createOpenSearchAuthTransport } from './OpenSearchAuthTransport';

describe('createOpenSearchAuthTransport', () => {
  it('returns an OpenSearch Transport constructor', () => {
    const TransportClass = createOpenSearchAuthTransport({
      getAuthHeaders: jest.fn().mockResolvedValue({}),
    });

    expect(TransportClass.prototype).toBeInstanceOf(Transport);
    expect(TransportClass.sniffReasons).toBeDefined();
  });

  it('injects resolved headers into each request', async () => {
    let token = 'first';
    const getAuthHeaders = jest
      .fn()
      .mockImplementation(async () => ({ Authorization: `Bearer ${token}` }));
    const TransportClass = createOpenSearchAuthTransport({ getAuthHeaders });
    const parentRequest = jest
      .fn()
      .mockResolvedValue({ body: { acknowledged: true } });

    const transport = Object.create(TransportClass.prototype);
    Object.getPrototypeOf(Object.getPrototypeOf(transport)).request =
      parentRequest;

    await transport.request(
      { method: 'GET', path: '/' },
      { headers: { 'X-Trace': 'abc' } },
    );
    token = 'rotated';
    await transport.request({ method: 'GET', path: '/' }, {});

    expect(getAuthHeaders).toHaveBeenCalledTimes(2);
    expect(parentRequest).toHaveBeenNthCalledWith(
      1,
      { method: 'GET', path: '/' },
      {
        headers: { 'X-Trace': 'abc', Authorization: 'Bearer first' },
      },
    );
    expect(parentRequest).toHaveBeenNthCalledWith(
      2,
      { method: 'GET', path: '/' },
      { headers: { Authorization: 'Bearer rotated' } },
    );
  });

  it('passes authentication failures to the callback in callback mode', async () => {
    const failure = new Error('Token fetch failed');
    const TransportClass = createOpenSearchAuthTransport({
      getAuthHeaders: jest.fn().mockRejectedValue(failure),
    });
    const transport = Object.create(TransportClass.prototype);
    const parentRequest = jest.fn();
    Object.getPrototypeOf(Object.getPrototypeOf(transport)).request =
      parentRequest;
    const callback = jest.fn();

    const result = transport.request({ method: 'GET', path: '/' }, callback);

    expect(result).toHaveProperty('abort', expect.any(Function));
    await new Promise(resolve => setImmediate(resolve));
    expect(callback).toHaveBeenCalledWith(failure);
    expect(parentRequest).not.toHaveBeenCalled();
  });
});
