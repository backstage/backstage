import { AuthProvider } from './types';
import { provider as GoogleAuthProvider } from './google/provider';

const providerFactories: AuthProvider = {
  google: GoogleAuthProvider,
};

export const makeProvider = (config: any) => {
  const provider = config.provider;
  const providerFactory = providerFactories[provider];
  const strategy = providerFactory.makeStrategy(config.options);
  const providerRouter = providerFactory.makeRouter();
  return { provider, strategy, providerRouter };
};
