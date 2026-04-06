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

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as proxyAgents from './proxyAgents';
import { bootstrapEnvProxyAgents } from './proxyBootstrap';

describe('bootstrapEnvProxyAgents', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
    delete process.env.GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE;
    delete process.env.GLOBAL_AGENT_HTTP_PROXY;
    delete process.env.GLOBAL_AGENT_HTTPS_PROXY;
    delete process.env.HTTP_PROXY;
    delete process.env.HTTPS_PROXY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should bootstrap global-agent if GLOBAL_AGENT_HTTP_PROXY is set', () => {
    const spy = vi.spyOn(proxyAgents, 'bootstrapGlobalAgent').mockReturnValue();
    process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://proxy.example.com';

    bootstrapEnvProxyAgents();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should bootstrap global-agent if GLOBAL_AGENT_HTTPS_PROXY is set', () => {
    const spy = vi.spyOn(proxyAgents, 'bootstrapGlobalAgent').mockReturnValue();
    process.env.GLOBAL_AGENT_HTTPS_PROXY = 'https://proxy.example.com';

    bootstrapEnvProxyAgents();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should use undici EnvHttpProxyAgent if HTTP_PROXY is set', () => {
    const spy = vi.spyOn(proxyAgents, 'bootstrapUndiciProxy').mockReturnValue();
    process.env.HTTP_PROXY = 'http://proxy.example.com';

    bootstrapEnvProxyAgents();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should use undici EnvHttpProxyAgent if HTTPS_PROXY is set', () => {
    const spy = vi.spyOn(proxyAgents, 'bootstrapUndiciProxy').mockReturnValue();
    process.env.HTTPS_PROXY = 'https://proxy.example.com';

    bootstrapEnvProxyAgents();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not bootstrap global-agent or set undici dispatcher if no proxy is set', () => {
    const globalAgentSpy = vi
      .spyOn(proxyAgents, 'bootstrapGlobalAgent')
      .mockReturnValue();
    const undiciSpy = vi
      .spyOn(proxyAgents, 'bootstrapUndiciProxy')
      .mockReturnValue();

    bootstrapEnvProxyAgents();

    expect(globalAgentSpy).not.toHaveBeenCalled();
    expect(undiciSpy).not.toHaveBeenCalled();
  });

  it('should respect GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE', () => {
    const spy = vi.spyOn(proxyAgents, 'bootstrapGlobalAgent').mockReturnValue();
    process.env.GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE = 'CUSTOM_AGENT_';
    process.env.CUSTOM_AGENT_HTTP_PROXY = 'http://proxy.example.com';

    bootstrapEnvProxyAgents();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
