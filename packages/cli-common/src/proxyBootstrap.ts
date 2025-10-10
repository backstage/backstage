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

export function maybeBootstrapProxy() {
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
