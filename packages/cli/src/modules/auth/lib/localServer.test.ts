/*
 * Copyright 2025 The Backstage Authors
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

import fetch from 'cross-fetch';
import { startCallbackServer } from './localServer';

describe('localServer', () => {
  describe('startCallbackServer', () => {
    it('should start server on a random port', async () => {
      const { url, close } = await startCallbackServer({ state: 'test-state' });

      expect(url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/callback$/);

      await close();
    });

    it('should accept callback with code parameter', async () => {
      const { url, waitForCode, close } = await startCallbackServer({
        state: 'test-state',
      });

      // Test with both code and state
      const response1 = await fetch(`${url}?code=test-code&state=test-state`);
      expect(response1.status).toBe(200);
      expect(await response1.text()).toBe('You may now close this window.');

      const result1 = await waitForCode();
      expect(result1).toEqual({
        code: 'test-code',
        state: 'test-state',
      });

      await close();

      // Test with only code
      const {
        url: url2,
        waitForCode: waitForCode2,
        close: close2,
      } = await startCallbackServer({ state: 'test-state' });
      const response2 = await fetch(`${url2}?code=test-code`);
      expect(response2.status).toBe(200);

      const result2 = await waitForCode2();
      expect(result2).toEqual({
        code: 'test-code',
        state: undefined,
      });

      await close2();
    });

    it('should return 400 for missing code parameter', async () => {
      const { url, close } = await startCallbackServer({ state: 'test-state' });

      const callbackUrl = `${url}?state=test-state`;
      const response = await fetch(callbackUrl);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe('Missing code');

      await close();
    });

    it('should return 404 for non-callback paths', async () => {
      const { url, close } = await startCallbackServer({ state: 'test-state' });

      const baseUrl = url.replace('/callback', '');
      const response = await fetch(`${baseUrl}/other-path`);

      expect(response.status).toBe(404);
      expect(await response.text()).toBe('Not Found');

      await close();
    });

    it('should handle multiple requests and close gracefully', async () => {
      const { url, close } = await startCallbackServer({ state: 'test-state' });

      // Multiple requests before code
      const response1 = await fetch(url.replace('/callback', '/other'));
      expect(response1.status).toBe(404);

      const response2 = await fetch(url);
      expect(response2.status).toBe(400);

      const response3 = await fetch(`${url}?code=test-code`);
      expect(response3.status).toBe(200);

      // Verify server is running
      const response4 = await fetch(`${url}?code=test`);
      expect(response4.status).toBe(200);

      // Close server
      await close();

      // Verify server is closed
      await expect(fetch(url)).rejects.toThrow();
    });

    it('should bind to localhost address', async () => {
      const { url, close } = await startCallbackServer({ state: 'test-state' });

      expect(url).toContain('127.0.0.1');
      expect(url).not.toContain('0.0.0.0');

      await close();
    });

    it('should use different ports for multiple servers', async () => {
      const server1 = await startCallbackServer({ state: 'test-state-1' });
      const server2 = await startCallbackServer({ state: 'test-state-2' });

      const port1 = new URL(server1.url).port;
      const port2 = new URL(server2.url).port;

      expect(port1).not.toBe(port2);

      await server1.close();
      await server2.close();
    });

    it('should resolve waitForCode promise when code is received', async () => {
      const { url, waitForCode, close } = await startCallbackServer({
        state: 'test-state',
      });

      const codePromise = waitForCode();

      // Wait a bit to ensure promise is pending
      await new Promise(resolve => setTimeout(resolve, 100));

      // Trigger callback
      await fetch(`${url}?code=auth-code&state=test-state`);

      const result = await codePromise;
      expect(result).toEqual({
        code: 'auth-code',
        state: 'test-state',
      });

      await close();
    });

    it('should handle URL with query parameters correctly', async () => {
      const { url, waitForCode, close } = await startCallbackServer({
        state: 'test-state',
      });

      const callbackUrl = `${url}?code=test-code&state=test-state&extra=param`;
      const response = await fetch(callbackUrl);

      expect(response.status).toBe(200);

      const result = await waitForCode();
      expect(result.code).toBe('test-code');
      expect(result.state).toBe('test-state');

      await close();
    });

    it('should set correct content-type header', async () => {
      const { url, close } = await startCallbackServer({ state: 'test-state' });

      const response = await fetch(`${url}?code=test-code`);

      expect(response.headers.get('content-type')).toBe(
        'text/plain; charset=utf-8',
      );

      await close();
    });

    it('should handle special characters in code and state parameters', async () => {
      const { url, waitForCode, close } = await startCallbackServer({
        state: 'test-state',
      });

      const specialCode = 'test-code+with/special=chars';
      const specialState = 'test-state+with/special=chars';
      const callbackUrl = `${url}?code=${encodeURIComponent(
        specialCode,
      )}&state=${encodeURIComponent(specialState)}`;

      await fetch(callbackUrl);

      const result = await waitForCode();
      expect(result.code).toBe(specialCode);
      expect(result.state).toBe(specialState);

      await close();
    });

    it('should handle multiple concurrent requests', async () => {
      const { url, waitForCode, close } = await startCallbackServer({
        state: 'test-state',
      });

      const requests = [
        fetch(`${url}?code=code1`),
        fetch(`${url}?code=code2`),
        fetch(`${url}?code=code3`),
      ];

      const responses = await Promise.all(requests);
      expect(responses.every(r => r.status === 200)).toBe(true);

      const result = await waitForCode();
      expect(result.code).toBe('code1');

      await close();
    });
  });
});
