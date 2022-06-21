/*
 * Copyright 2020 The Backstage Authors
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
import { MockFetchApi } from '@backstage/test-utils';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { PagerDutyClient, UnauthorizedError } from './client';
import { PagerDutyService, PagerDutyUser } from '../components/types';
import { NotFoundError } from '@backstage/errors';
import { Entity } from '@backstage/catalog-model';

const mockFetch = jest.fn().mockName('fetch');
const mockDiscoveryApi: jest.Mocked<DiscoveryApi> = {
  getBaseUrl: jest
    .fn()
    .mockName('discoveryApi')
    .mockResolvedValue('http://localhost:7007/proxy'),
};
const mockFetchApi: MockFetchApi = new MockFetchApi({
  baseImplementation: mockFetch,
});

let client: PagerDutyClient;
let entity: Entity;

const user: PagerDutyUser = {
  name: 'person1',
  id: 'p1',
  summary: 'person1',
  email: 'person1@example.com',
  html_url: 'http://a.com/id1',
};

const service: PagerDutyService = {
  id: 'def456',
  name: 'pagerduty-name',
  html_url: 'www.example.com',
  escalation_policy: {
    id: 'def',
    user: user,
    html_url: 'http://a.com/id1',
  },
  integrationKey: 'abc123',
};

const requestHeaders = {
  headers: {
    Accept: 'application/vnd.pagerduty+json;version=2',
    'Content-Type': 'application/json',
  },
  method: 'GET',
};

describe('PagerDutyClient', () => {
  beforeEach(() => {
    mockFetch.mockReset();

    client = new PagerDutyClient({
      eventsBaseUrl: 'https://events.pagerduty.com/v2',
      discoveryApi: mockDiscoveryApi,
      fetchApi: mockFetchApi,
    });
  });

  describe('getServiceByEntity', () => {
    describe('when provided entity has an integrationKey value', () => {
      beforeEach(() => {
        entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'pagerduty-test',
            annotations: {
              'pagerduty.com/integration-key': 'abc123',
            },
          },
        };
      });

      it('queries proxy path by integration id', async () => {
        mockFetch.mockResolvedValueOnce({
          status: 200,
          ok: true,
          json: () => Promise.resolve({ services: [service] }),
        });

        expect(await client.getServiceByEntity(entity)).toEqual({
          service,
        });
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:7007/proxy/pagerduty/services?time_zone=UTC&include[]=integrations&include[]=escalation_policies&query=abc123',
          requestHeaders,
        );
      });

      describe('on 401 response code', () => {
        beforeEach(() => {
          mockFetch.mockResolvedValueOnce({
            status: 401,
            ok: false,
            json: () => Promise.resolve({}),
          });
        });

        it('throws UnauthorizedError', async () => {
          await expect(client.getServiceByEntity(entity)).rejects.toThrowError(
            UnauthorizedError,
          );
        });
      });

      describe('on 404 response code', () => {
        beforeEach(() => {
          mockFetch.mockResolvedValueOnce({
            status: 404,
            ok: false,
            json: () => Promise.resolve({}),
          });
        });

        it('throws NotFoundError', async () => {
          await expect(client.getServiceByEntity(entity)).rejects.toThrowError(
            NotFoundError,
          );
        });
      });

      describe('on other non-ok response', () => {
        beforeEach(() => {
          mockFetch.mockResolvedValueOnce({
            status: 500,
            ok: false,
            json: () =>
              Promise.resolve({
                errors: ['Not valid request', 'internal error occurred'],
              }),
          });
        });

        it('throws NotFoundError', async () => {
          await expect(client.getServiceByEntity(entity)).rejects.toThrowError(
            'Request failed with 500, Not valid request internal error occurred',
          );
        });
      });

      describe('when services response is empty', () => {
        beforeEach(() => {
          mockFetch.mockResolvedValueOnce({
            status: 200,
            ok: true,
            json: () => Promise.resolve({ services: [] }),
          });
        });

        it('throws NotFoundError', async () => {
          await expect(client.getServiceByEntity(entity)).rejects.toThrowError(
            NotFoundError,
          );
        });
      });
    });

    describe('when provided entity has a serviceId value', () => {
      beforeEach(() => {
        entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'pagerduty-test',
            annotations: {
              'pagerduty.com/service-id': 'def456',
            },
          },
        };
      });

      it('queries proxy path by integration id', async () => {
        mockFetch.mockResolvedValueOnce({
          status: 200,
          ok: true,
          json: () => Promise.resolve({ service }),
        });

        expect(await client.getServiceByEntity(entity)).toEqual({
          service,
        });
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:7007/proxy/pagerduty/services/def456?time_zone=UTC&include[]=integrations&include[]=escalation_policies',
          requestHeaders,
        );
      });

      describe('on 401 response code', () => {
        beforeEach(() => {
          mockFetch.mockResolvedValueOnce({
            status: 401,
            ok: false,
            json: () => Promise.resolve({}),
          });
        });

        it('throws UnauthorizedError', async () => {
          await expect(client.getServiceByEntity(entity)).rejects.toThrowError(
            UnauthorizedError,
          );
        });
      });

      describe('on 404 response code', () => {
        beforeEach(() => {
          mockFetch.mockResolvedValueOnce({
            status: 404,
            ok: false,
            json: () => Promise.resolve({}),
          });
        });

        it('throws NotFoundError', async () => {
          await expect(client.getServiceByEntity(entity)).rejects.toThrowError(
            NotFoundError,
          );
        });
      });

      describe('on other non-ok response', () => {
        beforeEach(() => {
          mockFetch.mockResolvedValueOnce({
            status: 500,
            ok: false,
            json: () =>
              Promise.resolve({
                errors: ['Not valid request', 'internal error occurred'],
              }),
          });
        });

        it('throws NotFoundError', async () => {
          await expect(client.getServiceByEntity(entity)).rejects.toThrowError(
            'Request failed with 500, Not valid request internal error occurred',
          );
        });
      });
    });

    describe('when provided entity has both integrationKey and serviceId', () => {
      beforeEach(() => {
        entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'pagerduty-test',
            annotations: {
              'pagerduty.com/integration-key': 'abc123',
              'pagerduty.com/service-id': 'def456',
            },
          },
        };
      });

      it('queries proxy path by integration id', async () => {
        mockFetch.mockResolvedValueOnce({
          status: 200,
          ok: true,
          json: () => Promise.resolve({ services: [service] }),
        });

        expect(await client.getServiceByEntity(entity)).toEqual({
          service,
        });
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:7007/proxy/pagerduty/services?time_zone=UTC&include[]=integrations&include[]=escalation_policies&query=abc123',
          requestHeaders,
        );
      });

      describe('on 401 response code', () => {
        beforeEach(() => {
          mockFetch.mockResolvedValueOnce({
            status: 401,
            ok: false,
            json: () => Promise.resolve({}),
          });
        });

        it('throws UnauthorizedError', async () => {
          await expect(client.getServiceByEntity(entity)).rejects.toThrowError(
            UnauthorizedError,
          );
        });
      });

      describe('on 404 response code', () => {
        beforeEach(() => {
          mockFetch.mockResolvedValueOnce({
            status: 404,
            ok: false,
            json: () => Promise.resolve({}),
          });
        });

        it('throws NotFoundError', async () => {
          await expect(client.getServiceByEntity(entity)).rejects.toThrowError(
            NotFoundError,
          );
        });
      });

      describe('on other non-ok response', () => {
        beforeEach(() => {
          mockFetch.mockResolvedValueOnce({
            status: 500,
            ok: false,
            json: () =>
              Promise.resolve({
                errors: ['Not valid request', 'internal error occurred'],
              }),
          });
        });

        it('throws NotFoundError', async () => {
          await expect(client.getServiceByEntity(entity)).rejects.toThrowError(
            'Request failed with 500, Not valid request internal error occurred',
          );
        });
      });

      describe('when services response is empty', () => {
        beforeEach(() => {
          mockFetch.mockResolvedValueOnce({
            status: 200,
            ok: true,
            json: () => Promise.resolve({ services: [] }),
          });
        });

        it('throws NotFoundError', async () => {
          await expect(client.getServiceByEntity(entity)).rejects.toThrowError(
            NotFoundError,
          );
        });
      });
    });

    describe('when provided entity has no integrationKey or serviceId values', () => {
      beforeEach(() => {
        entity = {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'pagerduty-test',
            annotations: {},
          },
        };
      });

      it('throws NotFoundError', async () => {
        await expect(client.getServiceByEntity(entity)).rejects.toThrowError(
          NotFoundError,
        );
        expect(mockFetch).not.toHaveBeenCalled();
      });
    });
  });
});
