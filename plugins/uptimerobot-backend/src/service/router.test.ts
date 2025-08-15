import { createRouter } from './router';
import { mockServices } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import request from 'supertest';
import express from 'express';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      config: new ConfigReader({
        uptimerobot: {
          apiKey: 'test-api-key',
        },
      }),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /monitors', () => {
    it('returns 500 when API key is missing', async () => {
      const router = await createRouter({
        logger: mockServices.logger.mock(),
        config: new ConfigReader({}),
      });
      const testApp = express().use(router);

      const response = await request(testApp).get('/monitors');

      expect(response.status).toEqual(500);
      expect(response.body.error).toContain('UptimeRobot API key not configured');
    });
  });
});