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
import request from 'supertest';
import { createPermissionIntegrationRouter } from './createPermissionIntegrationRouter';

const mockGetResource: jest.MockedFunction<
  (resourceRef: string) => Promise<any>
> = jest.fn((resourceRef: string) =>
  Promise.resolve({
    resourceRef,
  }),
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

  beforeEach(() => {
    router = createPermissionIntegrationRouter({
      resourceType: 'test-resource',
      getResource: mockGetResource,
      rules: [testRule1, testRule2],
    });

    app = express().use(router);
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
          resourceRef: 'default:test/resource',
          resourceType: 'test-resource',
          conditions,
        });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ result: AuthorizeResult.ALLOW });
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
            resourceRef: 'default:test/resource',
            resourceType: 'test-resource',
            conditions,
          });

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ result: AuthorizeResult.DENY });
      },
    );

    it('returns 400 when called with incorrect resource type', async () => {
      const response = await request(app)
        .post('/.well-known/backstage/permissions/apply-conditions')
        .send({
          resourceRef: 'default:test/resource',
          resourceType: 'test-incorrect-resource',
          conditions: {
            anyOf: [],
          },
        });

      expect(response.status).toEqual(400);
      expect(response.error && response.error.text).toMatch(
        /unexpected resource type: test-incorrect-resource/i,
      );
    });

    it('returns 400 when resource is not found', async () => {
      mockGetResource.mockReturnValueOnce(Promise.resolve(undefined));

      const response = await request(app)
        .post('/.well-known/backstage/permissions/apply-conditions')
        .send({
          resourceRef: 'default:test/resource',
          resourceType: 'test-resource',
          conditions: {
            not: {
              rule: 'testRule1',
              params: ['a', 1],
            },
          },
        });

      expect(response.status).toEqual(400);
      expect(response.error && response.error.text).toMatch(
        /resource for ref default:test\/resource not found/i,
      );
    });

    it.each([
      undefined,
      {},
      { resourceType: 'test-resource-type' },
      { resourceRef: 'test/resource-ref' },
      {
        resourceType: 'test-resource-type',
        resourceRef: 'test/resource-ref',
      },
      { conditions: { anyOf: [] } },
    ])(`returns 400 for invalid input %#`, async input => {
      const response = await request(app)
        .post('/.well-known/backstage/permissions/apply-conditions')
        .send(input);

      expect(response.status).toEqual(400);
      expect(response.error && response.error.text).toMatch(
        /invalid request body/i,
      );
    });
  });
});
