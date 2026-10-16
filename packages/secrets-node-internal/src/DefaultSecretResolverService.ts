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

import type { LoggerService } from '@backstage/backend-plugin-api';
import { ConflictError, NotFoundError } from '@backstage/errors';
import type {
  ResolvedSecret,
  SecretConsumerContext,
  SecretProvider,
  SecretResolverResolveOptions,
  SecretResolverService,
} from './types';

/**
 * Options for {@link DefaultSecretResolverService.create}.
 *
 * @public
 */
export interface DefaultSecretResolverServiceOptions {
  /** Providers registered for this resolver instance. */
  providers: SecretProvider[];
  /** The consumer this resolver instance acts on behalf of. */
  consumer: SecretConsumerContext;
  logger: LoggerService;
}

/**
 * Default {@link SecretResolverService} that routes a reference to a registered
 * provider by id.
 *
 * @remarks
 *
 * The resolver never logs or persists the opaque reference payload or the
 * resolved value; only non-sensitive metadata (provider id, consuming plugin
 * id) is emitted.
 *
 * @public
 */
export class DefaultSecretResolverService implements SecretResolverService {
  static create(
    options: DefaultSecretResolverServiceOptions,
  ): DefaultSecretResolverService {
    const providers = new Map<string, SecretProvider>();
    for (const provider of options.providers) {
      if (providers.has(provider.id)) {
        throw new ConflictError(
          `Duplicate secret provider registered with id '${provider.id}'`,
        );
      }
      providers.set(provider.id, provider);
    }
    return new DefaultSecretResolverService(
      providers,
      options.consumer,
      options.logger,
    );
  }

  private constructor(
    private readonly providers: Map<string, SecretProvider>,
    private readonly consumer: SecretConsumerContext,
    private readonly logger: LoggerService,
  ) {}

  async resolve({
    reference,
  }: SecretResolverResolveOptions): Promise<ResolvedSecret> {
    const provider = this.providers.get(reference.provider);
    if (!provider) {
      throw new NotFoundError(
        `No secret provider registered with id '${reference.provider}'`,
      );
    }

    this.logger.debug(
      `Resolving secret via provider '${provider.id}' for plugin '${this.consumer.pluginId}'`,
    );

    return provider.resolve({
      reference: reference.reference,
      consumer: this.consumer,
    });
  }
}
