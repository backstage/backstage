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
import {
  actionsRegistryServiceRef,
  actionsServiceRef,
  metricsServiceRef,
  tracingServiceRef,
} from '@backstage/backend-plugin-api/alpha';
import { parseServerConfigs } from './config';

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
        metrics: metricsServiceRef,
        tracing: tracingServiceRef,
        auditor: coreServices.auditor,
      },
      async init({
        actions,
        logger,
        httpRouter,
        httpAuth,
        rootRouter,
        discovery,
        config,
        metrics,
        tracing,
        auditor,
      }) {
        const serverConfigs = parseServerConfigs(config);
        const namespacedToolNames = config.getOptionalBoolean(
          'mcpActions.namespacedToolNames',
        );
        const captureToolPayloads =
          config.getOptionalBoolean('mcpActions.tracing.capture.toolPayload') ??
          false;

        const mcpService = await McpService.create({
          actions,
          metrics,
          logger,
          auditor,
          namespacedToolNames,
          tracingService: tracing,
          captureToolPayloads,
        });

        const router = Router();
        router.use(json());

        if (serverConfigs && serverConfigs.size > 0) {
          for (const [key, serverConfig] of serverConfigs) {
            const streamableRouter = createStreamableRouter({
              mcpService,
              httpAuth,
              logger,
              metrics,
              tracing,
              auditor,
              serverConfig,
            });

            router.use(`/v1/${key}`, streamableRouter);
          }
        }

        // The default server is always mounted and never filtered, so named
        // servers are subsets of it rather than partitions of it. Mounted last
        // so that the more specific named server paths match first.
        const defaultServerConfig = {
          name: config.getOptionalString('mcpActions.name') ?? 'backstage',
          description: config.getOptionalString('mcpActions.description'),
          instructions: config.getOptionalString('mcpActions.instructions'),
          includeRules: [],
          excludeRules: [],
        };

        router.use(
          '/v1',
          createStreamableRouter({
            mcpService,
            httpAuth,
            logger,
            metrics,
            tracing,
            auditor,
            serverConfig: defaultServerConfig,
          }),
        );

        httpRouter.use(router);

        const cimdConfigPath = config.has('auth.clientIdMetadataDocuments')
          ? 'auth.clientIdMetadataDocuments'
          : 'auth.experimentalClientIdMetadataDocuments';
        const oauthEnabled =
          config.getOptionalBoolean(
            'auth.experimentalDynamicClientRegistration.enabled',
          ) || config.getOptionalBoolean(`${cimdConfigPath}.enabled`);

        if (oauthEnabled) {
          // OAuth Authorization Server Metadata (RFC 8414)
          // This should be replaced with throwing a WWW-Authenticate header, but that doesn't seem to be supported by
          // many of the MCP clients as of yet. So this seems to be the oldest version of the spec that's implemented.
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
          const refreshTokenEnabled = config.getOptionalBoolean(
            'auth.experimentalRefreshToken.enabled',
          );

          // Registered once for the whole /v1 prefix, since the root router
          // rejects a named server path as conflicting with the default one.
          // The server is therefore resolved from the remaining path.
          rootRouter.use(
            '/.well-known/oauth-protected-resource/api/mcp-actions/v1',
            async (req, res) => {
              const key = req.path.replace(/^\/+|\/+$/g, '');
              if (key && !serverConfigs?.has(key)) {
                res.status(404).end();
                return;
              }

              const [authBaseUrl, mcpBaseUrl] = await Promise.all([
                discovery.getExternalBaseUrl('auth'),
                discovery.getExternalBaseUrl('mcp-actions'),
              ]);

              const suffix = key ? `/v1/${key}` : '/v1';

              res.json({
                resource: `${mcpBaseUrl}${suffix}`,
                authorization_servers: [authBaseUrl],
                // RFC 9728 §2: clients discover which scope to request from
                // this field. Without it, RFC-compliant MCP clients request
                // no scope and never receive a refresh token (OIDC Core §11
                // requires offline_access to signal refresh token issuance).
                scopes_supported: [
                  'openid',
                  ...(refreshTokenEnabled ? ['offline_access'] : []),
                ],
              });
            },
          );
        }
      },
    });
  },
});
