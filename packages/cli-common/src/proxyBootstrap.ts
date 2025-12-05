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
 */
export function bootstrapEnvProxyAgents() {
  // see https://www.npmjs.com/package/global-agent
  const globalAgentNamespace =
    process.env.GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE ?? 'GLOBAL_AGENT_';
  if (
    process.env[`${globalAgentNamespace}HTTP_PROXY`] ||
    process.env[`${globalAgentNamespace}HTTPS_PROXY`]
  ) {
    const globalAgent =
      require('global-agent') as typeof import('global-agent');
    globalAgent.bootstrap();
  }

  if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
    const { setGlobalDispatcher, EnvHttpProxyAgent } =
      require('undici') as typeof import('undici');
    setGlobalDispatcher(new EnvHttpProxyAgent());
  }
}
