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

import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { SonarqubeFindings } from './sonarqubeInfoProvider';

describe('createRouter', () => {
  let app: express.Express;
  const getBaseUrlMock: jest.Mock<
    { baseUrl: string },
    [{ instanceName: string }]
  > = jest.fn();
  const getFindingsMock: jest.Mock<
    Promise<SonarqubeFindings | undefined>,
    [
      {
        componentKey: string;
        instanceName: string;
      },
    ]
  > = jest.fn();

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      sonarqubeInfoProvider: {
        getBaseUrl: getBaseUrlMock,
        getFindings: getFindingsMock,
      },
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /findings', () => {
    const DUMMY_COMPONENT_KEY = 'my:component';
    const DUMMY_INSTANCE_KEY = 'myInstance';
    it('returns ok', async () => {
      const measures = {
        analysisDate: '2022-01-01T00:00:00Z',
        measures: [{ metric: 'vulnerabilities', value: '54' }],
      };

      getFindingsMock.mockReturnValue(Promise.resolve(measures));
      const response = await request(app)
        .get('/findings')
        .query({
          componentKey: DUMMY_COMPONENT_KEY,
          instanceKey: DUMMY_INSTANCE_KEY,
        })
        .send();
      expect(getFindingsMock).toHaveBeenCalledTimes(1);
      expect(getFindingsMock).toHaveBeenCalledWith({
        componentKey: DUMMY_COMPONENT_KEY,
        instanceName: DUMMY_INSTANCE_KEY,
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(measures);
    });
    it('returns an error when component key is not defined', async () => {
      const response = await request(app)
        .get('/findings')
        .query({
          instanceKey: DUMMY_INSTANCE_KEY,
        })
        .send();

      expect(response.status).toEqual(400);
    });

    it('use the value as instance name when instance key not provided', async () => {
      const measures = {
        analysisDate: '2021-04-08',
        measures: [{ metric: 'vulnerabilities', value: '54' }],
      };

      getFindingsMock.mockReturnValue(Promise.resolve(measures));
      const response = await request(app)
        .get('/findings')
        .query({
          componentKey: DUMMY_COMPONENT_KEY,
          instanceKey: undefined,
        })
        .send();

      expect(getFindingsMock).toHaveBeenCalledTimes(1);
      expect(getFindingsMock).toHaveBeenCalledWith({
        componentKey: DUMMY_COMPONENT_KEY,
        instanceName: undefined,
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(measures);
    });
  });
  describe('GET /instanceUrl', () => {
    const DUMMY_INSTANCE_KEY = 'myInstance';
    const DUMMY_INSTANCE_URL = 'http://sonarqube.example.com';
    it('returns ok', async () => {
      getBaseUrlMock.mockReturnValue({ baseUrl: DUMMY_INSTANCE_URL });
      const response = await request(app)
        .get('/instanceUrl')
        .query({
          instanceKey: DUMMY_INSTANCE_KEY,
        })
        .send();
      expect(getBaseUrlMock).toHaveBeenCalledTimes(1);
      expect(getBaseUrlMock).toHaveBeenCalledWith({
        instanceName: DUMMY_INSTANCE_KEY,
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ instanceUrl: DUMMY_INSTANCE_URL });
    });

    it('query default instance when instanceKey not provided', async () => {
      getBaseUrlMock.mockReturnValue({ baseUrl: DUMMY_INSTANCE_URL });
      const response = await request(app).get('/instanceUrl').send();
      expect(getBaseUrlMock).toHaveBeenCalledTimes(1);
      expect(getBaseUrlMock).toHaveBeenCalledWith({
        instanceName: undefined,
      });
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ instanceUrl: DUMMY_INSTANCE_URL });
    });
  });
});
