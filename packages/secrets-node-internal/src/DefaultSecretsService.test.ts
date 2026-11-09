/*
 * Copyright 2026 The Backstage Authors
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

import { mockServices } from '@backstage/backend-test-utils';
import { DefaultSecretsService } from './DefaultSecretsService';
import { createSecretProviderRegistry } from './SecretProviderRegistry';
import type {
  ResolvedSecret,
  SecretProvider,
  SecretProviderResolveRequest,
} from './types';

interface TestSecretValue {
  value: string;
  expiresAt?: Date;
}

interface TestSecretProvider extends SecretProvider {
  setSecret(key: string, secret: string | TestSecretValue): void;
  readonly disposalCount: number;
}

/**
 * A minimal fake {@link SecretProvider} for these tests. It holds mutable
 * in-memory values, can inject resolve failures, and records disposals so the
 * tests can assert routing, expiry, value changes, and cleanup without any real
 * backend.
 */
function createTestSecretProvider(options: {
  id: string;
  secrets?: Record<string, string | TestSecretValue>;
  failWith?: Error;
}): TestSecretProvider {
  const toValue = (secret: string | TestSecretValue): TestSecretValue =>
    typeof secret === 'string' ? { value: secret } : { ...secret };

  const secrets = new Map<string, TestSecretValue>(
    Object.entries(options.secrets ?? {}).map(([key, secret]) => [
      key,
      toValue(secret),
    ]),
  );
  let disposalCount = 0;

  return {
    id: options.id,
    setSecret(key, secret) {
      secrets.set(key, toValue(secret));
    },
    get disposalCount() {
      return disposalCount;
    },
    async resolve(
      request: SecretProviderResolveRequest,
    ): Promise<ResolvedSecret> {
      if (options.failWith) {
        throw options.failWith;
      }
      const key = request.reference.key;
      if (typeof key !== 'string') {
        throw new Error(
          `Test provider '${options.id}' requires a string 'key' in the reference`,
        );
      }

      // Read the value at resolve time so later setSecret calls are observed.
      const secret = secrets.get(key);
      if (!secret) {
        throw new Error(
          `Test provider '${options.id}' has no secret for the requested key`,
        );
      }

      return {
        value: secret.value,
        expiresAt: secret.expiresAt,
        async dispose() {
          disposalCount += 1;
        },
      };
    },
  };
}

describe('DefaultSecretsService', () => {
  const createService = (
    providers: TestSecretProvider[],
    logger = mockServices.logger.mock(),
  ) =>
    DefaultSecretsService.create({
      registry: createSecretProviderRegistry(providers),
      logger,
    });

  it('routes by provider id and propagates value, expiry, and disposal', async () => {
    const expiresAt = new Date('2026-01-01T00:00:00Z');
    const providerA = createTestSecretProvider({
      id: 'a',
      secrets: { token: { value: 'a-value', expiresAt } },
    });
    const providerB = createTestSecretProvider({
      id: 'b',
      secrets: { token: 'b-value' },
    });
    const service = createService([providerA, providerB]);

    const handleA = await service.resolve({
      reference: { provider: 'a', reference: { key: 'token' } },
    });
    const handleB = await service.resolve({
      reference: { provider: 'b', reference: { key: 'token' } },
    });

    expect(handleA.value).toBe('a-value');
    expect(handleA.expiresAt).toEqual(expiresAt);
    expect(handleB.value).toBe('b-value');

    // Disposal is forwarded to the provider's handle.
    await handleA.dispose?.();
    expect(providerA.disposalCount).toBe(1);
    expect(providerB.disposalCount).toBe(0);
  });

  it('observes a provider-side value change on a later resolve', async () => {
    const provider = createTestSecretProvider({
      id: 'p',
      secrets: { token: 'v1' },
    });
    const service = createService([provider]);

    const first = await service.resolve({
      reference: { provider: 'p', reference: { key: 'token' } },
    });
    provider.setSecret('token', 'v2');
    const second = await service.resolve({
      reference: { provider: 'p', reference: { key: 'token' } },
    });

    expect(first.value).toBe('v1');
    expect(second.value).toBe('v2');
  });

  it('fails on an unknown provider id without leaking the reference', async () => {
    const service = createService([createTestSecretProvider({ id: 'known' })]);

    const resolution = service.resolve({
      reference: { provider: 'unknown', reference: { key: 'secret-key' } },
    });

    await expect(resolution).rejects.toMatchObject({
      name: 'NotFoundError',
      message: expect.stringContaining('unknown'),
    });
    await expect(resolution).rejects.toMatchObject({
      message: expect.not.stringContaining('secret-key'),
    });
  });

  it('logs only non-sensitive metadata, never the reference payload or value', async () => {
    const logger = mockServices.logger.mock();
    const provider = createTestSecretProvider({
      id: 'p',
      secrets: { 'reference-key': 'super-secret-value' },
    });
    const service = createService([provider], logger);

    await service.resolve({
      reference: { provider: 'p', reference: { key: 'reference-key' } },
    });

    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining("provider 'p'"),
    );
    const logged = JSON.stringify(logger.debug.mock.calls);
    expect(logged).not.toContain('super-secret-value');
    expect(logged).not.toContain('reference-key');
  });

  it('propagates provider failures', async () => {
    const bad = createTestSecretProvider({
      id: 'bad',
      failWith: new Error('boom'),
    });
    const service = createService([bad]);

    await expect(
      service.resolve({ reference: { provider: 'bad', reference: {} } }),
    ).rejects.toThrow('boom');
  });
});
