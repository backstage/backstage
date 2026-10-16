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
import { ConflictError, NotFoundError } from '@backstage/errors';
import { DefaultSecretResolverService } from './DefaultSecretResolverService';
import type {
  ResolvedSecret,
  SecretConsumerContext,
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
  readonly observedConsumers: ReadonlyArray<SecretConsumerContext>;
}

/**
 * A minimal fake {@link SecretProvider} for these tests. It holds mutable
 * in-memory values, can inject resolve failures, and records disposals so the
 * tests can assert routing, identity propagation, expiry, value changes, and
 * cleanup without any real backend.
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
  const observedConsumers: SecretConsumerContext[] = [];
  let disposalCount = 0;

  return {
    id: options.id,
    setSecret(key, secret) {
      secrets.set(key, toValue(secret));
    },
    get disposalCount() {
      return disposalCount;
    },
    get observedConsumers() {
      return observedConsumers;
    },
    async resolve(
      request: SecretProviderResolveRequest,
    ): Promise<ResolvedSecret> {
      if (options.failWith) {
        throw options.failWith;
      }
      observedConsumers.push(request.consumer);

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

describe('DefaultSecretResolverService', () => {
  const consumer = { pluginId: 'test-consumer' };

  const createService = (
    providers: TestSecretProvider[],
    logger = mockServices.logger.mock(),
  ) => DefaultSecretResolverService.create({ providers, consumer, logger });

  it('routes by provider id and propagates identity, value, expiry, and disposal', async () => {
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

    // Identity is derived from the resolver instance, not the reference, so it
    // cannot be spoofed by the caller.
    expect(providerA.observedConsumers).toEqual([
      { pluginId: 'test-consumer' },
    ]);
    expect(providerB.observedConsumers).toEqual([
      { pluginId: 'test-consumer' },
    ]);

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

  it('fails safely on duplicate and unknown provider ids without leaking the reference', async () => {
    expect(() =>
      DefaultSecretResolverService.create({
        providers: [
          createTestSecretProvider({ id: 'dup' }),
          createTestSecretProvider({ id: 'dup' }),
        ],
        consumer,
        logger: mockServices.logger.mock(),
      }),
    ).toThrow(ConflictError);

    const service = createService([createTestSecretProvider({ id: 'known' })]);
    const resolveUnknown = () =>
      service.resolve({
        reference: { provider: 'unknown', reference: { key: 'secret-key' } },
      });

    await expect(resolveUnknown()).rejects.toThrow(NotFoundError);
    // The error names the (non-sensitive) provider id but never the reference.
    let error: Error | undefined;
    try {
      await resolveUnknown();
    } catch (e) {
      error = e as Error;
    }
    expect(error?.message).toContain('unknown');
    expect(error?.message).not.toContain('secret-key');
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

  it('propagates provider failures and supports consumer cleanup on partial failure', async () => {
    const good = createTestSecretProvider({
      id: 'good',
      secrets: { token: 'ok' },
    });
    const bad = createTestSecretProvider({
      id: 'bad',
      failWith: new Error('boom'),
    });
    const service = createService([good, bad]);

    await expect(
      service.resolve({ reference: { provider: 'bad', reference: {} } }),
    ).rejects.toThrow('boom');

    // A consumer resolving several references disposes the handles it already
    // holds when a later resolve fails.
    const held: ResolvedSecret[] = [];
    await expect(
      (async () => {
        held.push(
          await service.resolve({
            reference: { provider: 'good', reference: { key: 'token' } },
          }),
        );
        held.push(
          await service.resolve({
            reference: { provider: 'bad', reference: {} },
          }),
        );
      })(),
    ).rejects.toThrow('boom');

    await Promise.all(held.map(handle => handle.dispose?.()));
    expect(good.disposalCount).toBe(1);
  });
});
