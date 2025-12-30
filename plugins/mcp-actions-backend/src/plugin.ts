/*
 * Copyright 2025 The Backstage Authors
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
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { json } from 'express';
import Router from 'express-promise-router';
import { McpService } from './services/McpService';
import { createStreamableRouter } from './routers/createStreamableRouter';
import { createSseRouter } from './routers/createSseRouter';
import {
  actionsRegistryServiceRef,
  actionsServiceRef,
} from '@backstage/backend-plugin-api/alpha';

/**
 * mcpPlugin backend plugin
 *
 * @public
 */
export const mcpPlugin = createBackendPlugin({
  pluginId: 'mcp-actions',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        actions: actionsServiceRef,
        registry: actionsRegistryServiceRef,
        rootRouter: coreServices.rootHttpRouter,
        discovery: coreServices.discovery,
        config: coreServices.rootConfig,
      },
      async init({
        actions,
        logger,
        httpRouter,
        httpAuth,
        rootRouter,
        discovery,
        config,
      }) {
        const mcpService = await McpService.create({
          actions,
        });

        const sseRouter = createSseRouter({
          mcpService,
          httpAuth,
        });

        const streamableRouter = createStreamableRouter({
          mcpService,
          httpAuth,
          logger,
        });

        const router = Router();
        router.use(json());

        router.use('/v1/sse', sseRouter);
        router.use('/v1', streamableRouter);

        httpRouter.use(router);

        const oauthEnabled =
          config.getOptionalBoolean(
            'auth.experimentalDynamicClientRegistration.enabled',
          ) ||
          config.getOptionalBoolean(
            'auth.experimentalClientIdMetadataDocuments.enabled',
          );

        if (oauthEnabled) {
          // This should be replaced with throwing a WWW-Authenticate header, but that doesn't seem to be supported by
          // many of the MCP client as of yet. So this seems to be the oldest version of the spec thats implemented.
          rootRouter.use(
            '/.well-known/oauth-authorization-server',
            async (_, res) => {
              const authBaseUrl = await discovery.getBaseUrl('auth');
              const oidcResponse = await fetch(
                `${authBaseUrl}/.well-known/openid-configuration`,
              );

              res.json(await oidcResponse.json());
            },
          );

          // Protected Resource Metadata (RFC 9728)
          // https://datatracker.ietf.org/doc/html/rfc9728
          // This allows MCP clients to discover the authorization server for this resource
          rootRouter.use(
            '/.well-known/oauth-protected-resource',
            async (_, res) => {
              const authBaseUrl = await discovery.getExternalBaseUrl('auth');
              const mcpBaseUrl = await discovery.getExternalBaseUrl(
                'mcp-actions',
              );

              res.json({
                resource: mcpBaseUrl,
                authorization_servers: [authBaseUrl],
              });
            },
          );
        }
      },
    });
  },
});
