import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,

      // This overrides the default GitHub auth provider with a custom one.
      // Since the options are empty it will behave just like the default
      // provider, but if you uncomment the `signIn` section you will enable
      // sign-in via GitHub. This particular configuration uses a resolver
      // that matches the username to the user entity name. See the auth
      // documentation for more details on how to enable and customize sign-in:
      //
      //   https://backstage.io/docs/auth/identity-resolver
      github: providers.github.create({
        // signIn: {
        //   resolver: providers.github.resolvers.usernameMatchingUserEntityName(),
        // },
      }),
    },
  });
}
