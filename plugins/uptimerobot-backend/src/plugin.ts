import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';

/**
 * UptimeRobot backend plugin
 *
 * @public
 */
export const uptimerobotPlugin = createBackendPlugin({
  pluginId: 'uptimerobot',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
      },
      async init({
        httpRouter,
        logger,
        config,
      }) {
        logger.info('Starting UptimeRobot backend plugin');
        
        const router = await createRouter({
          logger,
          config,
        });
        
        httpRouter.use('/uptimerobot', router);
        httpRouter.addAuthPolicy({
          path: '/uptimerobot',
          allow: 'unauthenticated',
        });
      },
    });
  },
});