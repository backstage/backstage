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

import { AuthorizeResult } from '@backstage/plugin-permission-common';
import express, { Express, Router } from 'express';
import request, { Response } from 'supertest';
import { createPermissionIntegrationRouter } from './createPermissionIntegrationRouter';

const mockGetResources: jest.MockedFunction<
  Parameters<typeof createPermissionIntegrationRouter>[0]['getResources']
> = jest.fn(async resourceRefs =>
  resourceRefs.map(resourceRef => ({ id: resourceRef })),
);

const testRule1 = {
  name: 'test-rule-1',
  description: 'Test rule 1',
  apply: jest.fn(
    (_resource: any, _firstParam: string, _secondParam: number) => true,
  ),
  toQuery: jest.fn(),
};

const testRule2 = {
  name: 'test-rule-2',
  description: 'Test rule 2',
  apply: jest.fn((_firstParam: object) => false),
  toQuery: jest.fn(),
};

describe('createPermissionIntegrationRouter', () => {
  let app: Express;
  let router: Router;

  beforeAll(() => {
    router = createPermissionIntegrationRouter({
      resourceType: 'test-resource',
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
      { rule: 'test-rule-1', params: ['abc', 123] },
      {
        anyOf: [
          { rule: 'test-rule-1', params: ['a', 1] },
          { rule: 'test-rule-2', params: [{}] },
        ],
      },
      {
        not: { rule: 'test-rule-2', params: [{}] },
      },
      {
        allOf: [
          {
            anyOf: [
              { rule: 'test-rule-1', params: ['a', 1] },
              { rule: 'test-rule-2', params: [{}] },
            ],
          },
          {
            not: {
              allOf: [
                { rule: 'test-rule-1', params: ['b', 2] },
                { rule: 'test-rule-2', params: [{ c: 3 }] },
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
      { rule: 'test-rule-2', params: [{ foo: 0 }] },
      {
        allOf: [
          { rule: 'test-rule-1', params: ['a', 1] },
          { rule: 'test-rule-2', params: [{}] },
        ],
      },
      {
        allOf: [
          {
            anyOf: [
              { rule: 'test-rule-1', params: ['a', 1] },
              { rule: 'test-rule-2', params: [{ b: 2 }] },
            ],
          },
          {
            not: {
              allOf: [
                { rule: 'test-rule-1', params: ['c', 3] },
                { not: { rule: 'test-rule-2', params: [{ d: 4 }] } },
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
                conditions: { rule: 'test-rule-1', params: [] },
              },
              {
                id: '234',
                resourceRef: 'default:test/resource-1',
                resourceType: 'test-resource',
                conditions: { rule: 'test-rule-2', params: [] },
              },
              {
                id: '345',
                resourceRef: 'default:test/resource-2',
                resourceType: 'test-resource',
                conditions: { not: { rule: 'test-rule-1', params: [] } },
              },
              {
                id: '456',
                resourceRef: 'default:test/resource-3',
                resourceType: 'test-resource',
                conditions: { not: { rule: 'test-rule-2', params: [] } },
              },
              {
                id: '567',
                resourceRef: 'default:test/resource-4',
                resourceType: 'test-resource',
                conditions: {
                  anyOf: [
                    { rule: 'test-rule-1', params: [] },
                    { rule: 'test-rule-2', params: [] },
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
              resourceRef: 'default:test/resource',
              resourceType: 'test-incorrect-resource',
              conditions: {
                anyOf: [],
              },
            },
          ],
        });

      expect(response.status).toEqual(400);
      expect(response.error && response.error.text).toMatch(
        /unexpected resource type: test-incorrect-resource/i,
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
              conditions: { rule: 'test-rule-1', params: [] },
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
    ])(`returns 400 for invalid input %#`, async input => {
      const response = await request(app)
        .post('/.well-known/backstage/permissions/apply-conditions')
        .send(input);

      expect(response.status).toEqual(400);
      expect(response.error && response.error.text).toMatch(/invalid/i);
    });
  });
});
