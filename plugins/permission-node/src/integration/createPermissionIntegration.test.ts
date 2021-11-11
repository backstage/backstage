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

import { AuthorizeResult } from '@backstage/permission-common';
import express, { Express, Router } from 'express';
import request from 'supertest';
import { createPermissionIntegration } from './createPermissionIntegration';

const mockGetResource: jest.MockedFunction<
  (resourceRef: string) => Promise<any>
> = jest.fn((resourceRef: string) =>
  Promise.resolve({
    resourceRef,
  }),
);

const testIntegration = () =>
  createPermissionIntegration({
    pluginId: 'test-plugin',
    resourceType: 'test-resource',
    getResource: mockGetResource,
    rules: {
      testRule1: {
        name: 'testRule1',
        description: 'Test rule 1',
        apply: jest.fn(
          (_resource: any, _firstParam: string, _secondParam: number) => true,
        ),
        toQuery: jest.fn((firstParam: string, secondParam: number) => ({
          query: 'testRule1',
          params: [firstParam, secondParam],
        })),
      },
      testRule2: {
        name: 'testRule2',
        description: 'Test rule 2',
        apply: jest.fn((_firstParam: object) => false),
        toQuery: jest.fn((firstParam: object) => ({
          query: 'testRule2',
          params: [firstParam],
        })),
      },
    },
  });

describe('createPermissionIntegration', () => {
  describe('createPermissionIntegrationRouter', () => {
    let app: Express;
    let router: Router;

    beforeEach(() => {
      const { createPermissionIntegrationRouter } = testIntegration();

      router = createPermissionIntegrationRouter();
      app = express().use(router);
    });

    it('works', async () => {
      expect(router).toBeDefined();
    });

    describe('POST /permissions/apply-conditions', () => {
      it('returns 200/ALLOW when criteria match', async () => {
        const response = await request(app)
          .post('/permissions/apply-conditions')
          .send({
            resourceRef: 'default:test/resource',
            resourceType: 'test-resource',
            conditions: {
              rule: 'testRule1',
              params: ['a', 1],
            },
          });

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ result: AuthorizeResult.ALLOW });
      });

      it('returns 200/DENY when criteria do not match', async () => {
        const response = await request(app)
          .post('/permissions/apply-conditions')
          .send({
            resourceRef: 'default:test/resource',
            resourceType: 'test-resource',
            conditions: {
              anyOf: [],
            },
          });

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ result: AuthorizeResult.DENY });
      });

      it('returns 400 when called with incorrect resource type', async () => {
        const response = await request(app)
          .post('/permissions/apply-conditions')
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
          .post('/permissions/apply-conditions')
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
          .post('/permissions/apply-conditions')
          .send(input);

        expect(response.status).toEqual(400);
        expect(response.error && response.error.text).toMatch(
          /invalid request body/i,
        );
      });
    });
  });

  describe('toQuery', () => {
    it('converts conditions to plugin-specific queries using rule toQuery methods', () => {
      const { toQuery } = testIntegration();

      expect(
        toQuery({
          anyOf: [
            {
              allOf: [
                { rule: 'testRule1', params: ['a', 1] },
                { rule: 'testRule2', params: [{ foo: 'bar' }] },
              ],
            },
            {
              not: { rule: 'testRule1', params: ['b', 2] },
            },
          ],
        }),
      ).toEqual({
        anyOf: [
          {
            allOf: [
              { query: 'testRule1', params: ['a', 1] },
              { query: 'testRule2', params: [{ foo: 'bar' }] },
            ],
          },
          {
            not: { query: 'testRule1', params: ['b', 2] },
          },
        ],
      });
    });
  });

  describe('conditions', () => {
    it('creates condition factories for the supplied rules', () => {
      const { conditions } = testIntegration();

      expect(conditions.testRule1('a', 1)).toEqual({
        rule: 'testRule1',
        params: ['a', 1],
      });

      expect(conditions.testRule2({ baz: 'quux' })).toEqual({
        rule: 'testRule2',
        params: [{ baz: 'quux' }],
      });
    });
  });

  describe('createConditions', () => {
    it('wraps conditions in an object with resourceType and pluginId', () => {
      const { createConditions } = testIntegration();

      expect(
        createConditions({ allOf: [{ rule: 'testRule1', params: ['a', 1] }] }),
      ).toEqual({
        pluginId: 'test-plugin',
        resourceType: 'test-resource',
        conditions: {
          allOf: [{ rule: 'testRule1', params: ['a', 1] }],
        },
      });
    });
  });

  describe('registerPermissionRule', () => {
    it('adds support for the new rule in toQuery', () => {
      const { registerPermissionRule, toQuery } = testIntegration();

      registerPermissionRule({
        name: 'testRule3',
        description: 'Test rule 3',
        apply: jest.fn((_resource: any, _firstParam: string) => false),
        toQuery: jest.fn((firstParam: string) => ({
          query: 'testRule3',
          params: [firstParam],
        })),
      });

      expect(
        toQuery({
          rule: 'testRule3',
          params: ['abc'],
        }),
      ).toEqual({
        query: 'testRule3',
        params: ['abc'],
      });
    });

    it('adds support for the new rule in the apply-conditions endpoint', async () => {
      const { registerPermissionRule, createPermissionIntegrationRouter } =
        testIntegration();

      const app = express().use(createPermissionIntegrationRouter());

      registerPermissionRule({
        name: 'testRule3',
        description: 'Test rule 3',
        apply: jest.fn((_resource: any, _firstParam: string) => false),
        toQuery: jest.fn((firstParam: string) => ({
          query: 'testRule3',
          params: [firstParam],
        })),
      });

      const response = await request(app)
        .post('/permissions/apply-conditions')
        .send({
          resourceRef: 'default:test/resource',
          resourceType: 'test-resource',
          conditions: {
            not: {
              rule: 'testRule3',
              params: ['a'],
            },
          },
        });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ result: AuthorizeResult.ALLOW });
    });
  });
});
