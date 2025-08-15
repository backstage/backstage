import express from 'express';
import Router from 'express-promise-router';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import fetch from 'node-fetch';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('UptimeRobot backend plugin health check');
    response.json({ status: 'ok' });
  });

  router.get('/monitors', async (request, response) => {
    try {
      logger.info('Fetching UptimeRobot monitors');
      
      const apiKey = config.getOptionalString('uptimerobot.apiKey');
      if (!apiKey) {
        logger.warn('UptimeRobot API key not configured');
        response.status(500).json({ 
          error: 'UptimeRobot API key not configured. Please set uptimerobot.apiKey in your app-config.yaml' 
        });
        return;
      }

      const uptimeRobotResponse = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          api_key: apiKey,
          format: 'json',
        }),
      });

      if (!uptimeRobotResponse.ok) {
        logger.error(`UptimeRobot API error: ${uptimeRobotResponse.status} ${uptimeRobotResponse.statusText}`);
        response.status(uptimeRobotResponse.status).json({ 
          error: 'Failed to fetch monitors from UptimeRobot API' 
        });
        return;
      }

      const data = await uptimeRobotResponse.json();
      response.json(data);
    } catch (error) {
      logger.error('Error fetching UptimeRobot monitors:', error);
      response.status(500).json({ 
        error: 'Internal server error while fetching monitors' 
      });
    }
  });

  return router;
}