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
import { bootstrapEnvProxyAgents } from './proxyBootstrap';

// Avoid mutating the global agents used in other tests
jest.mock('global-agent', () => ({
  bootstrap: jest.fn(),
}));
jest.mock('undici', () => ({
  setGlobalDispatcher: jest.fn(),
  EnvHttpProxyAgent: jest.fn(),
}));

describe('bootstrapEnvProxyAgents', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('should bootstrap global-agent if GLOBAL_AGENT_HTTP_PROXY is set', () => {
    process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://proxy.example.com';

    const { bootstrap } =
      require('global-agent') as typeof import('global-agent');
    bootstrapEnvProxyAgents();

    expect(bootstrap).toHaveBeenCalledTimes(1);
  });

  it('should bootstrap global-agent if GLOBAL_AGENT_HTTPS_PROXY is set', () => {
    process.env.GLOBAL_AGENT_HTTPS_PROXY = 'https://proxy.example.com';

    const { bootstrap } =
      require('global-agent') as typeof import('global-agent');
    bootstrapEnvProxyAgents();

    expect(bootstrap).toHaveBeenCalledTimes(1);
  });

  it('should use undici EnvHttpProxyAgent if HTTP_PROXY is set', () => {
    process.env.HTTP_PROXY = 'http://proxy.example.com';

    const { setGlobalDispatcher, EnvHttpProxyAgent } =
      require('undici') as typeof import('undici');
    bootstrapEnvProxyAgents();

    expect(EnvHttpProxyAgent).toHaveBeenCalledTimes(1);
    expect(setGlobalDispatcher).toHaveBeenCalledWith(
      expect.any(EnvHttpProxyAgent),
    );
  });

  it('should use undici EnvHttpProxyAgent if HTTPS_PROXY is set', () => {
    process.env.HTTPS_PROXY = 'https://proxy.example.com';

    const { setGlobalDispatcher, EnvHttpProxyAgent } =
      require('undici') as typeof import('undici');
    bootstrapEnvProxyAgents();

    expect(EnvHttpProxyAgent).toHaveBeenCalledTimes(1);
    expect(setGlobalDispatcher).toHaveBeenCalledWith(
      expect.any(EnvHttpProxyAgent),
    );
  });

  it('should not bootstrap global-agent or set undici dispatcher if no proxy is set', () => {
    const { bootstrap } =
      require('global-agent') as typeof import('global-agent');
    const { setGlobalDispatcher } =
      require('undici') as typeof import('undici');

    bootstrapEnvProxyAgents();

    expect(bootstrap).not.toHaveBeenCalled();
    expect(setGlobalDispatcher).not.toHaveBeenCalled();
  });

  it('should respect GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE', () => {
    process.env.GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE = 'CUSTOM_AGENT_';
    process.env.CUSTOM_AGENT_HTTP_PROXY = 'http://proxy.example.com';

    const { bootstrap } =
      require('global-agent') as typeof import('global-agent');
    bootstrapEnvProxyAgents();

    expect(bootstrap).toHaveBeenCalledTimes(1);
  });
});
