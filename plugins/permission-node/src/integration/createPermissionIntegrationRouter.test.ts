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

import {
  AuthorizeResult,
  createPermission,
  Permission,
} from '@backstage/plugin-permission-common';
import express, { Express, Router } from 'express';
import request, { Response } from 'supertest';
import { createPermissionIntegrationRouter } from './createPermissionIntegrationRouter';
import { createPermissionRule } from './createPermissionRule';

const mockGetResources: jest.MockedFunction<
  Parameters<typeof createPermissionIntegrationRouter>[0]['getResources']
> = jest.fn(async resourceRefs =>
  resourceRefs.map(resourceRef => ({ id: resourceRef })),
);

const testPermission: Permission = createPermission({
  name: 'test.permission',
  attributes: {},
});

const testRule1 = createPermissionRule({
  name: 'test-rule-1',
  description: 'Test rule 1',
  resourceType: 'test-resource',
  apply: (_resource: any, _firstParam: string, _secondParam: number) => true,
  toQuery: (_firstParam: string, _secondParam: number) => ({}),
});

const testRule2 = createPermissionRule({
  name: 'test-rule-2',
  description: 'Test rule 2',
  resourceType: 'test-resource',
  apply: (_resource: any, _firstParam: object) => false,
  toQuery: (_firstParam: object) => ({}),
});

describe('createPermissionIntegrationRouter', () => {
  let app: Express;
  let router: Router;

  beforeAll(() => {
    router = createPermissionIntegrationRouter({
      resourceType: 'test-resource',
      permissions: [testPermission],
      getResources: mockGetResources,
      rules: [testRule1, testRule2],
    });

    app = express().use(router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('works', async () => {
    expect(router).toBeDefined();
  });

  describe('POST /.well-known/backstage/permissions/apply-conditions', () => {
    it.each([
      {
        rule: 'test-rule-1',
        resourceType: 'test-resource',
        params: ['abc', 123],
      },
      {
        anyOf: [
          {
            rule: 'test-rule-1',
            resourceType: 'test-resource',
            params: ['a', 1],
          },
          { rule: 'test-rule-2', resourceType: 'test-resource', params: [{}] },
        ],
      },
      {
        not: {
          rule: 'test-rule-2',
          resourceType: 'test-resource',
          params: [{}],
        },
      },
      {
        allOf: [
          {
            anyOf: [
              {
                rule: 'test-rule-1',
                resourceType: 'test-resource',
                params: ['a', 1],
              },
              {
                rule: 'test-rule-2',
                resourceType: 'test-resource',
                params: [{}],
              },
            ],
          },
          {
            not: {
              allOf: [
                {
                  rule: 'test-rule-1',
                  resourceType: 'test-resource',
                  params: ['b', 2],
                },
                {
                  rule: 'test-rule-2',
                  resourceType: 'test-resource',
                  params: [{ c: 3 }],
                },
              ],
            },
          },
        ],
      },
    ])('returns 200/ALLOW when criteria match (case %#)', async conditions => {
      const response = await request(app)
        .post('/.well-known/backstage/permissions/apply-conditions')
        .send({
          items: [
            {
              id: '123',
              resourceRef: 'default:test/resource',
              resourceType: 'test-resource',
              conditions,
            },
          ],
        });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        items: [
          {
            id: '123',
            result: AuthorizeResult.ALLOW,
          },
        ],
      });
    });

    it.each([
      {
        rule: 'test-rule-2',
        resourceType: 'test-resource',
        params: [{ foo: 0 }],
      },
      {
        allOf: [
          {
            rule: 'test-rule-1',
            resourceType: 'test-resource',
            params: ['a', 1],
          },
          { rule: 'test-rule-2', resourceType: 'test-resource', params: [{}] },
        ],
      },
      {
        allOf: [
          {
            anyOf: [
              {
                rule: 'test-rule-1',
                resourceType: 'test-resource',
                params: ['a', 1],
              },
              {
                rule: 'test-rule-2',
                resourceType: 'test-resource',
                params: [{ b: 2 }],
              },
            ],
          },
          {
            not: {
              allOf: [
                {
                  rule: 'test-rule-1',
                  resourceType: 'test-resource',
                  params: ['c', 3],
                },
                {
                  not: {
                    rule: 'test-rule-2',
                    resourceType: 'test-resource',
                    params: [{ d: 4 }],
                  },
                },
              ],
            },
          },
        ],
      },
    ])(
      'returns 200/DENY when criteria do not match (case %#)',
      async conditions => {
        const response = await request(app)
          .post('/.well-known/backstage/permissions/apply-conditions')
          .send({
            items: [
              {
                id: '123',
                resourceRef: 'default:test/resource',
                resourceType: 'test-resource',
                conditions,
              },
            ],
          });

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
          items: [{ id: '123', result: AuthorizeResult.DENY }],
        });
      },
    );

    describe('batched requests', () => {
      let response: Response;

      beforeEach(async () => {
        response = await request(app)
          .post('/.well-known/backstage/permissions/apply-conditions')
          .send({
            items: [
              {
                id: '123',
                resourceRef: 'default:test/resource-1',
                resourceType: 'test-resource',
                conditions: {
                  rule: 'test-rule-1',
                  resourceType: 'test-resource',
                  params: [],
                },
              },
              {
                id: '234',
                resourceRef: 'default:test/resource-1',
                resourceType: 'test-resource',
                conditions: {
                  rule: 'test-rule-2',
                  resourceType: 'test-resource',
                  params: [],
                },
              },
              {
                id: '345',
                resourceRef: 'default:test/resource-2',
                resourceType: 'test-resource',
                conditions: {
                  not: {
                    rule: 'test-rule-1',
                    resourceType: 'test-resource',
                    params: [],
                  },
                },
              },
              {
                id: '456',
                resourceRef: 'default:test/resource-3',
                resourceType: 'test-resource',
                conditions: {
                  not: {
                    rule: 'test-rule-2',
                    resourceType: 'test-resource',
                    params: [],
                  },
                },
              },
              {
                id: '567',
                resourceRef: 'default:test/resource-4',
                resourceType: 'test-resource',
                conditions: {
                  anyOf: [
                    {
                      rule: 'test-rule-1',
                      resourceType: 'test-resource',
                      params: [],
                    },
                    {
                      rule: 'test-rule-2',
                      resourceType: 'test-resource',
                      params: [],
                    },
                  ],
                },
              },
            ],
          });
      });

      it('processes batched requests', () => {
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
          items: [
            { id: '123', result: AuthorizeResult.ALLOW },
            { id: '234', result: AuthorizeResult.DENY },
            { id: '345', result: AuthorizeResult.DENY },
            { id: '456', result: AuthorizeResult.ALLOW },
            { id: '567', result: AuthorizeResult.ALLOW },
          ],
        });
      });

      it('calls getResources for all required resources at once', () => {
        expect(mockGetResources).toHaveBeenCalledWith([
          'default:test/resource-1',
          'default:test/resource-2',
          'default:test/resource-3',
          'default:test/resource-4',
        ]);
      });
    });

    it('returns 400 when called with incorrect resource type', async () => {
      const response = await request(app)
        .post('/.well-known/backstage/permissions/apply-conditions')
        .send({
          items: [
            {
              id: '123',
              resourceRef: 'default:test/resource-1',
              resourceType: 'test-incorrect-resource-1',
              conditions: {
                rule: 'test-rule-1',
                resourceType: 'test-incorrect-resource-1',
                params: [{}],
              },
            },
            {
              id: '234',
              resourceRef: 'default:test/resource-2',
              resourceType: 'test-resource',
              conditions: {
                rule: 'test-rule-1',
                resourceType: 'test-resource',
                params: [{}],
              },
            },
            {
              id: '345',
              resourceRef: 'default:test/resource-3',
              resourceType: 'test-incorrect-resource-2',
              conditions: {
                rule: 'test-rule-1',
                resourceType: 'test-incorrect-resource-2',
                params: [{}],
              },
            },
          ],
        });

      expect(response.status).toEqual(400);
      expect(response.error && response.error.text).toMatch(
        /unexpected resource types: test-incorrect-resource-1, test-incorrect-resource-2/i,
      );
    });

    it('returns 200/DENY when resource is not found', async () => {
      mockGetResources.mockImplementationOnce(async resourceRefs =>
        resourceRefs.map(() => undefined),
      );

      const response = await request(app)
        .post('/.well-known/backstage/permissions/apply-conditions')
        .send({
          items: [
            {
              id: '123',
              resourceRef: 'default:test/resource',
              resourceType: 'test-resource',
              conditions: {
                rule: 'test-rule-1',
                resourceType: 'test-resource',
                params: [],
              },
            },
          ],
        });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        items: [
          {
            id: '123',
            result: AuthorizeResult.DENY,
          },
        ],
      });
    });

    it('interleaves responses for present and missing resources', async () => {
      mockGetResources.mockImplementationOnce(async resourceRefs =>
        resourceRefs.map(resourceRef =>
          resourceRef === 'default:test/missing-resource'
            ? undefined
            : { id: resourceRef },
        ),
      );

      const response = await request(app)
        .post('/.well-known/backstage/permissions/apply-conditions')
        .send({
          items: [
            {
              id: '123',
              resourceRef: 'default:test/resource-1',
              resourceType: 'test-resource',
              conditions: {
                rule: 'test-rule-1',
                resourceType: 'test-resource',
                params: [],
              },
            },
            {
              id: '234',
              resourceRef: 'default:test/missing-resource',
              resourceType: 'test-resource',
              conditions: {
                rule: 'test-rule-1',
                resourceType: 'test-resource',
                params: [],
              },
            },
            {
              id: '345',
              resourceRef: 'default:test/resource-2',
              resourceType: 'test-resource',
              conditions: {
                rule: 'test-rule-1',
                resourceType: 'test-resource',
                params: [],
              },
            },
          ],
        });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        items: [
          {
            id: '123',
            result: AuthorizeResult.ALLOW,
          },
          {
            id: '234',
            result: AuthorizeResult.DENY,
          },
          {
            id: '345',
            result: AuthorizeResult.ALLOW,
          },
        ],
      });
    });

    it.each([
      undefined,
      '',
      {},
      { resourceType: 'test-resource-type' },
      [{ resourceType: 'test-resource-type' }],
      { items: [{ resourceType: 'test-resource-type' }] },
      { items: [{ resourceRef: 'test/resource-ref' }] },
      {
        items: [
          {
            resourceType: 'test-resource-type',
            resourceRef: 'test/resource-ref',
          },
        ],
      },
      { items: [{ conditions: { anyOf: [] } }] },
      {
        items: [
          { conditions: { rule: 'TEST_RULE', resourceType: 'test-resource' } },
        ],
      },
      { items: [{ conditions: { rule: 'TEST_RULE', params: ['foo'] } }] },
      {
        items: [
          { conditions: { resourceType: 'test-resource', params: ['foo'] } },
        ],
      },
    ])(`returns 400 for invalid input %#`, async input => {
      const response = await request(app)
        .post('/.well-known/backstage/permissions/apply-conditions')
        .send(input);

      expect(response.status).toEqual(400);
      expect(response.error && response.error.text).toMatch(/invalid/i);
    });
  });

  describe('GET /.well-known/backstage/permissions/metadata', () => {
    it('returns a list of permissions and rules used by a given backend', async () => {
      const response = await request(app).get(
        '/.well-known/backstage/permissions/metadata',
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        permissions: [testPermission],
        rules: [
          {
            name: testRule1.name,
            description: testRule1.description,
            resourceType: testRule1.resourceType,
            parameters: { count: 2 },
          },
          {
            name: testRule2.name,
            description: testRule2.description,
            resourceType: testRule2.resourceType,
            parameters: { count: 1 },
          },
        ],
      });
    });
  });
});
