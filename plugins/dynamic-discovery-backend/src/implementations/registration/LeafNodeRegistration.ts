/*
 * Copyright 2024 The Backstage Authors
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
  FeatureMetadata,
  InstanceMetadataService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import fetch from 'node-fetch';
import { LocalDiscoveryService } from '../discovery/LocalDiscoveryService';

export class LeafNodeRegistration {
  #localDiscovery: LocalDiscoveryService;
  #instanceMetadata: InstanceMetadataService;
  #gatewayUrl?: string;
  #hasGatewayUrl: boolean;
  #logger: LoggerService;

  static fromConfig(
    config: RootConfigService,
    {
      instanceMetadata,
      logger,
    }: { instanceMetadata: InstanceMetadataService; logger: LoggerService },
  ) {
    return new LeafNodeRegistration({
      instanceMetadata,
      gatewayUrl: config.getOptionalString('discovery.gateway.internalUrl'),
      logger,
      localDiscovery: LocalDiscoveryService.fromConfig(config),
    });
  }

  constructor(options: {
    instanceMetadata: InstanceMetadataService;
    gatewayUrl?: string;
    logger: LoggerService;
    localDiscovery: LocalDiscoveryService;
  }) {
    this.#instanceMetadata = options.instanceMetadata;
    this.#gatewayUrl = options.gatewayUrl;
    this.#hasGatewayUrl = options.gatewayUrl !== undefined;
    this.#logger = options.logger;
    this.#localDiscovery = options.localDiscovery;
  }

  async #registerWithGateway(feature: FeatureMetadata) {
    const request: {
      instanceLocation: { internalUrl: string; externalUrl: string };
      feature: FeatureMetadata;
      featureLocation: { internalUrl: string; externalUrl: string };
    } = {
      feature,
      instanceLocation: {
        internalUrl: this.#localDiscovery.internalBaseUrl,
        externalUrl: this.#localDiscovery.externalBaseUrl,
      },
      featureLocation: {
        internalUrl: await this.#localDiscovery.getBaseUrl(feature.pluginId),
        externalUrl: await this.#localDiscovery.getExternalBaseUrl(
          feature.pluginId,
        ),
      },
    };

    const response = await fetch(
      `${this.#gatewayUrl}/api/dynamic-discovery/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        timeout: 2500,
      },
    );
    if (!response.ok) {
      const errorMessage = await response.text();
      if (
        isJsonString(errorMessage) &&
        JSON.parse(errorMessage).message === 'AlreadyRegisteredError'
      ) {
        this.#logger.info(
          `Plugin ${feature.pluginId} is already registered with the gateway`,
        );
        return;
      }
      throw new Error(
        `Failed to register plugin ${feature.pluginId} with the gateway: ${response.status} ${response.statusText}`,
      );
    }
  }

  async register() {
    if (!this.#hasGatewayUrl) {
      this.#logger.info('No gateway URL provided, skipping registration');
      return;
    }
    for (const feature of this.#instanceMetadata.getInstalledFeatures()) {
      await this.#registerWithGateway(feature);
    }
  }
}

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
