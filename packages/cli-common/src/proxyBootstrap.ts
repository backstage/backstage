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

/**
 * This function can be called to setup undici and node-fetch Proxy agents.
 *
 * You can set GLOBAL_AGENT_HTTP(S)_PROXY to configure a proxy to be used in the
 * CLIs.
 *
 * You can also configure a custom namespace by setting
 * GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE which will replace the default
 * "GLOBAL_AGENT_" env-var prefix.
 *
 * Make sure to call this function before any other imports.
 *
 * @public
 * @deprecated Use Node.js built-in proxy support by setting `NODE_USE_ENV_PROXY=1`
 * alongside your `HTTP_PROXY` / `HTTPS_PROXY` environment variables instead.
 * This function will be removed in a future release.
 * See {@link https://backstage.io/docs/tutorials/corporate-proxy/ | the corporate proxy guide} for details.
 */
export function bootstrapEnvProxyAgents() {
  const globalAgentNamespace =
    process.env.GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE ?? 'GLOBAL_AGENT_';

  const hasGlobalAgentProxy =
    process.env[`${globalAgentNamespace}HTTP_PROXY`] ||
    process.env[`${globalAgentNamespace}HTTPS_PROXY`];
  const hasStandardProxy = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;

  // Mimics the internal getOptionValue('--use-env-proxy') check in Node.js, which
  // normalizes the --use-env-proxy CLI flag and NODE_USE_ENV_PROXY=1 env var.
  // https://github.com/nodejs/node/blob/v22.x/src/node_options.cc
  const hasNodeEnvProxy =
    process.env.NODE_USE_ENV_PROXY === '1' ||
    process.execArgv.includes('--use-env-proxy') ||
    (process.env.NODE_OPTIONS?.split(/\s+/) ?? []).includes('--use-env-proxy');

  // Node.js never reads GLOBAL_AGENT_* vars, so global-agent must always
  // handle those to preserve behavior during the deprecation period.
  if (hasGlobalAgentProxy) {
    process.emitWarning(
      `Configuration of proxy agents through ${globalAgentNamespace}* environment variables is deprecated and will be removed in a future release. Switch to the standard HTTP_PROXY/HTTPS_PROXY environment variables and set NODE_USE_ENV_PROXY=1 instead. See https://backstage.io/docs/tutorials/corporate-proxy/ for details.`,
      { type: 'DeprecationWarning', code: 'BACKSTAGE_CLI_GLOBAL_AGENT_PROXY' },
    );

    const globalAgent =
      require('global-agent') as typeof import('global-agent');
    globalAgent.bootstrap();
  }

  // Skip undici dispatcher setup when Node.js built-in proxy support is active,
  // as it already configures the global dispatcher during startup.
  if (hasStandardProxy && !hasNodeEnvProxy) {
    process.emitWarning(
      'bootstrapEnvProxyAgents() is deprecated and will be removed in a future release. Set NODE_USE_ENV_PROXY=1 to use Node.js built-in proxy support instead. See https://backstage.io/docs/tutorials/corporate-proxy/ for details.',
      { type: 'DeprecationWarning', code: 'BACKSTAGE_CLI_PROXY_BOOTSTRAP' },
    );

    const { setGlobalDispatcher, EnvHttpProxyAgent } =
      require('undici') as typeof import('undici');
    setGlobalDispatcher(new EnvHttpProxyAgent());
  }
}
