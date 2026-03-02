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
  AuthService,
  DiscoveryService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { ResponseError } from '@backstage/errors';
import {
  CatalogModelService,
  CatalogModelAnnotationDescriptor,
  CatalogModelValidationResult,
} from '@backstage/backend-plugin-api/alpha';
import Ajv from 'ajv';

export class DefaultCatalogModelService implements CatalogModelService {
  private readonly discovery: DiscoveryService;
  private readonly config: RootConfigService;
  private readonly logger: LoggerService;
  private readonly auth: AuthService;
  private readonly ajv: Ajv;

  private constructor(
    discovery: DiscoveryService,
    config: RootConfigService,
    logger: LoggerService,
    auth: AuthService,
  ) {
    this.discovery = discovery;
    this.config = config;
    this.logger = logger;
    this.auth = auth;
    this.ajv = new Ajv();
  }

  static create({
    discovery,
    config,
    logger,
    auth,
  }: {
    discovery: DiscoveryService;
    config: RootConfigService;
    logger: LoggerService;
    auth: AuthService;
  }) {
    return new DefaultCatalogModelService(discovery, config, logger, auth);
  }

  async listAnnotations(
    options?: { entityKind?: string } | undefined,
  ): Promise<CatalogModelAnnotationDescriptor[]> {
    const pluginSources =
      this.config.getOptionalStringArray(
        'backend.catalogModel.pluginSources',
      ) ?? [];

    const allAnnotations = await Promise.all(
      pluginSources.map(async source => {
        try {
          const response = await this.makeRequest({
            path: '/.backstage/catalog-model/v1/annotations',
            pluginId: source,
          });

          if (!response.ok) {
            throw await ResponseError.fromResponse(response);
          }

          const { annotations } = (await response.json()) as {
            annotations: CatalogModelAnnotationDescriptor[];
          };

          return annotations;
        } catch (error) {
          this.logger.warn(
            `Failed to fetch catalog model annotations from ${source}`,
            error,
          );
          return [];
        }
      }),
    );

    const flat = allAnnotations.flat();

    if (options?.entityKind) {
      return flat.filter(a => a.entityKind === options.entityKind);
    }

    return flat;
  }

  async validateEntity(entity: {
    kind: string;
    metadata: { annotations?: Record<string, string> };
  }): Promise<CatalogModelValidationResult> {
    const descriptors = await this.listAnnotations({
      entityKind: entity.kind,
    });

    const entityAnnotations = entity.metadata.annotations ?? {};
    const errors: CatalogModelValidationResult['errors'] = [];

    for (const descriptor of descriptors) {
      const value = entityAnnotations[descriptor.key];
      if (value === undefined) {
        continue;
      }

      const validate = this.ajv.compile(descriptor.schema);
      if (!validate(value)) {
        for (const error of validate.errors ?? []) {
          errors.push({
            pluginId: descriptor.pluginId,
            annotation: descriptor.key,
            message: error.message ?? 'Validation failed',
          });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private async makeRequest(opts: {
    path: string;
    pluginId: string;
    options?: RequestInit;
  }) {
    const baseUrl = await this.discovery.getBaseUrl(opts.pluginId);

    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: await this.auth.getOwnServiceCredentials(),
      targetPluginId: opts.pluginId,
    });

    return fetch(`${baseUrl}${opts.path}`, {
      ...opts.options,
      headers: {
        ...opts.options?.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
