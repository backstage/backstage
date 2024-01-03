import { createServiceBuilder } from '@backstage/backend-common';

import { Router } from 'express';
import { Logger } from 'winston';

import { Server } from 'http';

// import { createRouter } from './router';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const logger = options.logger.child({ service: 'notifications-backend' });

  logger.debug('Starting application server...');
  const router = Router();
  /* const router = await createRouter({
    logger,
    // TODO: get dbClient in standalone mode
  }); */

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/notifications', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
