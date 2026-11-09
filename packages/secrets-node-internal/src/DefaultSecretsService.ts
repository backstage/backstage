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
import { NotFoundError } from '@backstage/errors';
import type {
  ResolvedSecret,
  SecretProviderRegistry,
  SecretsResolveOptions,
  SecretsService,
} from './types';

/**
 * Options for {@link DefaultSecretsService.create}.
 *
 * @internal
 */
export interface DefaultSecretsServiceOptions {
  /** The validated provider lookup this service routes through. */
  registry: SecretProviderRegistry;
  logger: LoggerService;
}

/**
 * Default {@link SecretsService} that routes a reference to a registered provider
 * by id.
 *
 * @remarks
 *
 * The service never logs or persists the opaque reference payload or the
 * resolved value; only non-sensitive metadata (provider id) is emitted. The
 * plugin context comes from the plugin-scoped logger. Provider failures
 * propagate unchanged, so keeping sensitive data out of error messages is the
 * provider's responsibility — see {@link SecretProvider.resolve}.
 *
 * @internal
 */
export class DefaultSecretsService implements SecretsService {
  static create(options: DefaultSecretsServiceOptions): DefaultSecretsService {
    return new DefaultSecretsService(options.registry, options.logger);
  }

  private constructor(
    private readonly registry: SecretProviderRegistry,
    private readonly logger: LoggerService,
  ) {}

  async resolve({ reference }: SecretsResolveOptions): Promise<ResolvedSecret> {
    const provider = this.registry.getProvider(reference.provider);
    if (!provider) {
      throw new NotFoundError(
        `No secret provider registered with id '${reference.provider}'`,
      );
    }

    this.logger.debug(`Resolving secret via provider '${provider.id}'`);

    return provider.resolve({ reference: reference.reference });
  }
}
