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

import { RestContext, rest } from 'msw';
import { setupServer } from 'msw/node';
import { ConfigReader } from '@backstage/config';
import {
  BatchedAuthorizePermissionRequest,
  PermissionClient,
} from './PermissionClient';
import {
  EvaluatePermissionRequest,
  AuthorizeResult,
  IdentifiedPermissionMessage,
  ConditionalPolicyDecision,
} from './types/api';
import { DiscoveryApi } from './types/discovery';
import { createPermission } from './permissions';

const server = setupServer();
const token = 'fake-token';

const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';
const discovery: DiscoveryApi = {
  async getBaseUrl() {
    return mockBaseUrl;
  },
};
let client: PermissionClient;

const mockPermission = createPermission({
  name: 'test.permission',
  attributes: {},
  resourceType: 'foo',
});

describe('PermissionClient', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  describe('authorize', () => {
    beforeAll(() => {
      client = new PermissionClient({
        discovery,
        config: new ConfigReader({ permission: { enabled: true } }),
      });
    });

    const mockAuthorizeConditional = {
      permission: mockPermission,
      resourceRef: 'foo:bar',
    };

    const mockAuthorizeHandler = jest.fn((req, res, { json }: RestContext) => {
      const responses = req.body.items.map(
        (a: IdentifiedPermissionMessage<EvaluatePermissionRequest>) => ({
          id: a.id,
          result: AuthorizeResult.ALLOW,
        }),
      );

      return res(json({ items: responses }));
    });

    beforeEach(() => {
      server.use(rest.post(`${mockBaseUrl}/authorize`, mockAuthorizeHandler));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch entities from correct endpoint', async () => {
      await client.authorize([mockAuthorizeConditional]);
      expect(mockAuthorizeHandler).toHaveBeenCalled();
    });

    it('should include a request body', async () => {
      await client.authorize([mockAuthorizeConditional]);

      const request = mockAuthorizeHandler.mock.calls[0][0];

      expect(request.body).toEqual({
        items: [
          expect.objectContaining({
            permission: mockPermission,
            resourceRef: 'foo:bar',
          }),
        ],
      });
    });

    it('should return the response from the fetch request', async () => {
      const response = await client.authorize([mockAuthorizeConditional]);
      expect(response[0]).toEqual(
        expect.objectContaining({ result: AuthorizeResult.ALLOW }),
      );
    });

    it('should not include authorization headers if no token is supplied', async () => {
      await client.authorize([mockAuthorizeConditional]);

      const request = mockAuthorizeHandler.mock.calls[0][0];
      expect(request.headers.has('authorization')).toEqual(false);
    });

    it('should include correctly-constructed authorization header if token is supplied', async () => {
      await client.authorize([mockAuthorizeConditional], { token });

      const request = mockAuthorizeHandler.mock.calls[0][0];
      expect(request.headers.get('authorization')).toEqual('Bearer fake-token');
    });

    it('should forward response errors', async () => {
      mockAuthorizeHandler.mockImplementationOnce(
        (_req, res, { status }: RestContext) => {
          return res(status(401));
        },
      );
      await expect(
        client.authorize([mockAuthorizeConditional], { token }),
      ).rejects.toThrow(/request failed with 401/i);
    });

    it('should reject responses with missing ids', async () => {
      mockAuthorizeHandler.mockImplementationOnce(
        (_req, res, { json }: RestContext) => {
          return res(
            json({
              items: [{ id: 'wrong-id', result: AuthorizeResult.ALLOW }],
            }),
          );
        },
      );
      await expect(
        client.authorize([mockAuthorizeConditional], { token }),
      ).rejects.toThrow(/items in response do not match request/i);
    });

    it('should reject invalid responses', async () => {
      mockAuthorizeHandler.mockImplementationOnce(
        (req, res, { json }: RestContext) => {
          const responses = req.body.items.map(
            (a: IdentifiedPermissionMessage<EvaluatePermissionRequest>) => ({
              id: a.id,
              outcome: AuthorizeResult.ALLOW,
            }),
          );

          return res(json({ items: responses }));
        },
      );
      await expect(
        client.authorize([mockAuthorizeConditional], { token }),
      ).rejects.toThrow(/invalid input/i);
    });

    it('should allow all when permission.enabled is false', async () => {
      mockAuthorizeHandler.mockImplementationOnce(
        (req, res, { json }: RestContext) => {
          const responses = req.body.map(
            (a: IdentifiedPermissionMessage<EvaluatePermissionRequest>) => ({
              id: a.id,
              result: AuthorizeResult.DENY,
            }),
          );

          return res(json({ items: responses }));
        },
      );
      const disabled = new PermissionClient({
        discovery,
        config: new ConfigReader({ permission: { enabled: false } }),
      });
      const response = await disabled.authorize([mockAuthorizeConditional]);
      expect(response[0]).toEqual(
        expect.objectContaining({ result: AuthorizeResult.ALLOW }),
      );
      expect(mockAuthorizeHandler).not.toHaveBeenCalled();
    });

    it('should allow all when permission.enabled is not configured', async () => {
      mockAuthorizeHandler.mockImplementationOnce(
        (req, res, { json }: RestContext) => {
          const responses = req.body.map(
            (a: IdentifiedPermissionMessage<EvaluatePermissionRequest>) => ({
              id: a.id,
              outcome: AuthorizeResult.DENY,
            }),
          );

          return res(json(responses));
        },
      );
      const disabled = new PermissionClient({
        discovery,
        config: new ConfigReader({}),
      });
      const response = await disabled.authorize([mockAuthorizeConditional]);
      expect(response[0]).toEqual(
        expect.objectContaining({ result: AuthorizeResult.ALLOW }),
      );
      expect(mockAuthorizeHandler).not.toHaveBeenCalled();
    });
  });

  describe('authorize (batched)', () => {
    beforeAll(() => {
      client = new PermissionClient({
        discovery,
        config: new ConfigReader({
          permission: {
            enabled: true,
            EXPERIMENTAL_enableBatchedRequests: true,
          },
        }),
      });
    });

    const mockAuthorizeConditional = {
      permission: mockPermission,
      resourceRef: 'foo:bar',
    };

    const mockAuthorizeHandler = jest.fn();

    beforeEach(() => {
      mockAuthorizeHandler.mockReset();
      server.use(rest.post(`${mockBaseUrl}/authorize`, mockAuthorizeHandler));

      mockAuthorizeHandler.mockImplementation(
        (req, res, { json }: RestContext) => {
          const responses = req.body.items.map(
            (a: BatchedAuthorizePermissionRequest) => ({
              id: a.id,
              result: [AuthorizeResult.ALLOW],
            }),
          );

          return res(json({ items: responses }));
        },
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch entities from correct endpoint', async () => {
      await client.authorize([mockAuthorizeConditional]);
      expect(mockAuthorizeHandler).toHaveBeenCalled();
    });

    it('should include a request body', async () => {
      const basicPermission = createPermission({
        name: 'test.permission-basic',
        attributes: {},
      });

      await client.authorize([
        { permission: mockPermission, resourceRef: 'foo:bar' },
        { permission: mockPermission, resourceRef: 'foo:car' },
        { permission: mockPermission, resourceRef: 'foo:baz' },
        { permission: basicPermission },
      ]);

      const request = mockAuthorizeHandler.mock.calls[0][0];

      expect(request.body).toEqual({
        items: [
          {
            id: expect.any(String),
            permission: mockPermission,
            resourceRef: ['foo:bar', 'foo:car', 'foo:baz'],
          },
          {
            id: expect.any(String),
            permission: basicPermission,
          },
        ],
      });
    });

    it('should return the response from the fetch request', async () => {
      const response = await client.authorize([mockAuthorizeConditional]);
      expect(response[0]).toEqual(
        expect.objectContaining({ result: AuthorizeResult.ALLOW }),
      );
    });

    it('should not include authorization headers if no token is supplied', async () => {
      await client.authorize([mockAuthorizeConditional]);

      const request = mockAuthorizeHandler.mock.calls[0][0];
      expect(request.headers.has('authorization')).toEqual(false);
    });

    it('should include correctly-constructed authorization header if token is supplied', async () => {
      await client.authorize([mockAuthorizeConditional], { token });

      const request = mockAuthorizeHandler.mock.calls[0][0];
      expect(request.headers.get('authorization')).toEqual('Bearer fake-token');
    });

    it('should forward response errors', async () => {
      mockAuthorizeHandler.mockImplementationOnce(
        (_req, res, { status }: RestContext) => {
          return res(status(401));
        },
      );
      await expect(
        client.authorize([mockAuthorizeConditional], { token }),
      ).rejects.toThrow(/request failed with 401/i);
    });

    it('should reject responses with missing ids', async () => {
      mockAuthorizeHandler.mockImplementationOnce(
        (_req, res, { json }: RestContext) => {
          return res(
            json({
              items: [{ id: 'wrong-id', result: [AuthorizeResult.ALLOW] }],
            }),
          );
        },
      );
      await expect(
        client.authorize([mockAuthorizeConditional], { token }),
      ).rejects.toThrow(/items in response do not match request/i);
    });

    it('should reject invalid responses', async () => {
      mockAuthorizeHandler.mockImplementationOnce(
        (req, res, { json }: RestContext) => {
          const responses = req.body.items.map(
            (a: IdentifiedPermissionMessage<EvaluatePermissionRequest>) => ({
              id: a.id,
              outcome: AuthorizeResult.ALLOW,
            }),
          );

          return res(json({ items: responses }));
        },
      );
      await expect(
        client.authorize([mockAuthorizeConditional], { token }),
      ).rejects.toThrow(/invalid_type/i);
    });

    it('should allow all when permission.enabled is false', async () => {
      const disabled = new PermissionClient({
        discovery,
        config: new ConfigReader({ permission: { enabled: false } }),
      });
      const response = await disabled.authorize([mockAuthorizeConditional]);
      expect(response[0]).toEqual(
        expect.objectContaining({ result: AuthorizeResult.ALLOW }),
      );
      expect(mockAuthorizeHandler).not.toHaveBeenCalled();
    });

    it('should allow all when permission.enabled is not configured', async () => {
      const disabled = new PermissionClient({
        discovery,
        config: new ConfigReader({}),
      });
      const response = await disabled.authorize([mockAuthorizeConditional]);
      expect(response[0]).toEqual(
        expect.objectContaining({ result: AuthorizeResult.ALLOW }),
      );
      expect(mockAuthorizeHandler).not.toHaveBeenCalled();
    });

    it('should properly map the permissions', async () => {
      const mockPermission2 = createPermission({
        name: 'test.permission2',
        attributes: {},
        resourceType: 'foo',
      });

      const mockPermission3 = createPermission({
        name: 'test.permission3',
        attributes: {},
      });

      mockAuthorizeHandler.mockImplementationOnce(
        (req, res, { json }: RestContext) => {
          return res(
            json({
              items: [
                {
                  id: req.body.items[0].id,
                  result: [AuthorizeResult.ALLOW, AuthorizeResult.DENY],
                },
                {
                  id: req.body.items[1].id,
                  result: AuthorizeResult.DENY,
                },
                {
                  id: req.body.items[2].id,
                  result: [AuthorizeResult.DENY, AuthorizeResult.ALLOW],
                },
              ],
            }),
          );
        },
      );

      const response = await client.authorize([
        {
          permission: mockPermission,
          resourceRef: 'foo:bar', // allow
        },
        {
          permission: mockPermission3, // deny
        },
        {
          permission: mockPermission,
          resourceRef: 'foo:car', // deny
        },
        {
          permission: mockPermission3, // deny
        },
        {
          permission: mockPermission2,
          resourceRef: 'r2', // deny
        },
        {
          permission: mockPermission2,
          resourceRef: 'r1', // allow
        },
      ]);

      expect(mockAuthorizeHandler.mock.calls[0][0].body).toEqual({
        items: [
          {
            permission: {
              type: 'resource',
              name: 'test.permission',
              attributes: {},
              resourceType: 'foo',
            },
            resourceRef: ['foo:bar', 'foo:car'],
            id: expect.any(String),
          },
          {
            permission: {
              type: 'basic',
              name: 'test.permission3',
              attributes: {},
            },
            id: expect.any(String),
          },
          {
            permission: {
              type: 'resource',
              name: 'test.permission2',
              attributes: {},
              resourceType: 'foo',
            },
            resourceRef: ['r2', 'r1'],
            id: expect.any(String),
          },
        ],
      });

      expect(response).toEqual([
        { result: 'ALLOW' },
        { result: 'DENY' },
        { result: 'DENY' },
        { result: 'DENY' },
        { result: 'DENY' },
        { result: 'ALLOW' },
      ]);
    });
  });

  describe('authorizeConditional', () => {
    beforeAll(() => {
      client = new PermissionClient({
        discovery,
        config: new ConfigReader({ permission: { enabled: true } }),
      });
    });

    const mockResourceAuthorizeConditional = {
      permission: mockPermission,
    };

    const mockPolicyDecisionHandler = jest.fn(
      (req, res, { json }: RestContext) => {
        const responses = req.body.items.map(
          (a: IdentifiedPermissionMessage<ConditionalPolicyDecision>) => ({
            id: a.id,
            pluginId: 'test-plugin',
            resourceType: 'test-resource',
            result: AuthorizeResult.CONDITIONAL,
            conditions: {
              resourceType: 'test-resource',
              rule: 'FOO',
              params: { foo: 'bar' },
            },
          }),
        );

        return res(json({ items: responses }));
      },
    );

    beforeEach(() => {
      server.use(
        rest.post(`${mockBaseUrl}/authorize`, mockPolicyDecisionHandler),
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should fetch entities from correct endpoint', async () => {
      await client.authorizeConditional([mockResourceAuthorizeConditional]);
      expect(mockPolicyDecisionHandler).toHaveBeenCalled();
    });

    it('should include a request body', async () => {
      await client.authorizeConditional([mockResourceAuthorizeConditional]);

      const request = mockPolicyDecisionHandler.mock.calls[0][0];

      expect(request.body).toEqual({
        items: [
          expect.objectContaining({
            permission: mockPermission,
          }),
        ],
      });
    });

    it('should return the response from the fetch request', async () => {
      const response = await client.authorizeConditional([
        mockResourceAuthorizeConditional,
      ]);
      expect(response[0]).toEqual(
        expect.objectContaining({
          result: AuthorizeResult.CONDITIONAL,
          conditions: {
            rule: 'FOO',
            resourceType: 'test-resource',
            params: { foo: 'bar' },
          },
        }),
      );
    });

    it('should not include authorization headers if no token is supplied', async () => {
      await client.authorizeConditional([mockResourceAuthorizeConditional]);

      const request = mockPolicyDecisionHandler.mock.calls[0][0];
      expect(request.headers.has('authorization')).toEqual(false);
    });

    it('should include correctly-constructed authorization header if token is supplied', async () => {
      await client.authorizeConditional([mockResourceAuthorizeConditional], {
        token,
      });

      const request = mockPolicyDecisionHandler.mock.calls[0][0];
      expect(request.headers.get('authorization')).toEqual('Bearer fake-token');
    });

    it('should forward response errors', async () => {
      mockPolicyDecisionHandler.mockImplementationOnce(
        (_req, res, { status }: RestContext) => {
          return res(status(401));
        },
      );
      await expect(
        client.authorizeConditional([mockResourceAuthorizeConditional], {
          token,
        }),
      ).rejects.toThrow(/request failed with 401/i);
    });

    it('should handle responses with rules with no params', async () => {
      mockPolicyDecisionHandler.mockImplementationOnce(
        (req, res, { json }: RestContext) => {
          const responses = req.body.items.map(
            (a: IdentifiedPermissionMessage<ConditionalPolicyDecision>) => ({
              id: a.id,
              pluginId: 'test-plugin',
              resourceType: 'test-resource',
              result: AuthorizeResult.CONDITIONAL,
              conditions: {
                resourceType: 'test-resource',
                rule: 'FOO',
              },
            }),
          );

          return res(json({ items: responses }));
        },
      );

      const response = await client.authorizeConditional([
        mockResourceAuthorizeConditional,
      ]);
      expect(response[0]).toEqual(
        expect.objectContaining({
          result: AuthorizeResult.CONDITIONAL,
          conditions: {
            rule: 'FOO',
            resourceType: 'test-resource',
          },
        }),
      );
    });

    it('should reject responses with missing ids', async () => {
      mockPolicyDecisionHandler.mockImplementationOnce(
        (_req, res, { json }: RestContext) => {
          return res(
            json({
              items: [{ id: 'wrong-id', result: AuthorizeResult.ALLOW }],
            }),
          );
        },
      );
      await expect(
        client.authorizeConditional([mockResourceAuthorizeConditional], {
          token,
        }),
      ).rejects.toThrow(/items in response do not match request/i);
    });

    it('should reject invalid responses', async () => {
      mockPolicyDecisionHandler.mockImplementationOnce(
        (req, res, { json }: RestContext) => {
          const responses = req.body.items.map(
            (a: IdentifiedPermissionMessage<ConditionalPolicyDecision>) => ({
              id: a.id,
              outcome: AuthorizeResult.ALLOW,
            }),
          );

          return res(json({ items: responses }));
        },
      );
      await expect(
        client.authorizeConditional([mockResourceAuthorizeConditional], {
          token,
        }),
      ).rejects.toThrow(/invalid input/i);
    });

    it('should allow all when permission.enabled is false', async () => {
      mockPolicyDecisionHandler.mockImplementationOnce(
        (req, res, { json }: RestContext) => {
          const responses = req.body.map(
            (a: IdentifiedPermissionMessage<ConditionalPolicyDecision>) => ({
              id: a.id,
              result: AuthorizeResult.DENY,
            }),
          );

          return res(json({ items: responses }));
        },
      );
      const disabled = new PermissionClient({
        discovery,
        config: new ConfigReader({ permission: { enabled: false } }),
      });
      const response = await disabled.authorizeConditional(
        [mockResourceAuthorizeConditional],
        {
          token,
        },
      );
      expect(response[0]).toEqual(
        expect.objectContaining({ result: AuthorizeResult.ALLOW }),
      );
      expect(mockPolicyDecisionHandler).not.toHaveBeenCalled();
    });

    it('should allow all when permission.enabled is not configured', async () => {
      mockPolicyDecisionHandler.mockImplementationOnce(
        (req, res, { json }: RestContext) => {
          const responses = req.body.map(
            (a: IdentifiedPermissionMessage<ConditionalPolicyDecision>) => ({
              id: a.id,
              outcome: AuthorizeResult.DENY,
            }),
          );

          return res(json({ items: responses }));
        },
      );
      const disabled = new PermissionClient({
        discovery,
        config: new ConfigReader({}),
      });
      const response = await disabled.authorizeConditional(
        [mockResourceAuthorizeConditional],
        {
          token,
        },
      );
      expect(response[0]).toEqual(
        expect.objectContaining({ result: AuthorizeResult.ALLOW }),
      );
      expect(mockPolicyDecisionHandler).not.toHaveBeenCalled();
    });
  });
});
