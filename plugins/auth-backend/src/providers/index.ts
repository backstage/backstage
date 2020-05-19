import Router from 'express-promise-router';
import { AuthProviderRouteHandlers, AuthProviderFactories } from './types';

import { GoogleAuthProvider } from './google/provider';

const providerFactories: AuthProviderFactories = {
  google: GoogleAuthProvider,
};

export const makeProvider = (config: any) => {
  const provider = config.provider;
  const providerImpl = providerFactories[provider];
  if (!providerImpl) {
    throw Error(`Provider Implementation missing for provider: ${provider}`);
  }
  const providerInstance = new providerImpl(config);
  const strategy = providerInstance.strategy();
  const providerRouter = defaultRouter(providerInstance);
  return { provider, strategy, providerRouter };
};

export const defaultRouter = (provider: AuthProviderRouteHandlers) => {
  const router = Router();
  router.get('/start', provider.start);
  router.get('/handler/frame', provider.frameHandler);
  router.get('/logout', provider.logout);
  if (provider.refresh) {
    router.get('/refreshToken', provider.refresh);
  }
  return router;
};
