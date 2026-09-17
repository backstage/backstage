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

import {
  KubernetesWatcher,
  KubernetesWatchParams,
} from '@backstage/plugin-kubernetes-node';
import split2 from 'split2';
import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  KubernetesWatchEvent,
  KubernetesWatchOptions,
} from '@backstage/plugin-kubernetes-common';
import fetch from 'node-fetch';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  KubernetesConnection,
  statusCodeToErrorType,
} from './KubernetesConnection';

const CLIENT_SIDE_AUTH_PROVIDERS = new Set(['google', 'oidc', 'aks']);

export class KubernetesClientBasedWatcher implements KubernetesWatcher {
  private readonly logger: LoggerService;
  private readonly connection: KubernetesConnection;

  constructor({
    logger,
    connection,
  }: {
    logger: LoggerService;
    connection: KubernetesConnection;
  }) {
    this.logger = logger;
    this.connection = connection;
  }

  async *watchResource(
    params: KubernetesWatchParams,
    options?: KubernetesWatchOptions,
  ): AsyncGenerator<KubernetesWatchEvent, void, undefined> {
    const { clusterDetails, credential, group, apiVersion, plural } = params;
    const {
      namespace,
      labelSelector,
      resourceVersion,
      timeoutSeconds,
      allowWatchBookmarks,
      sendInitialEvents,
      resourceVersionMatch,
      signal,
    } = options || {};

    if (signal?.aborted) return;

    const resourcePath = this.connection.buildResourcePath(
      group,
      apiVersion,
      plural,
      namespace,
    );

    const authProvider =
      clusterDetails.authMetadata[ANNOTATION_KUBERNETES_AUTH_PROVIDER];

    if (CLIENT_SIDE_AUTH_PROVIDERS.has(authProvider)) {
      this.logger.warn(
        `Watch is not supported for client-side auth provider "${authProvider}" on cluster "${clusterDetails.name}"`,
      );
      yield {
        type: 'ERROR',
        error: {
          errorType: 'BAD_REQUEST',
          statusCode: 400,
          resourcePath,
        },
      };
      return;
    }

    const connResult = await this.connection.resolveConnection(
      clusterDetails,
      credential,
    );

    if (!connResult.ok) {
      yield {
        type: 'ERROR',
        error: {
          errorType: 'UNAUTHORIZED_ERROR',
          statusCode: 401,
          resourcePath,
        },
      };
      return;
    }

    const { url, requestInit } = connResult;

    if (url.pathname === '/') {
      url.pathname = resourcePath;
    } else {
      url.pathname += resourcePath;
    }

    const queryParams: Record<string, string> = { watch: 'true' };
    if (labelSelector) queryParams.labelSelector = labelSelector;
    if (resourceVersion) queryParams.resourceVersion = resourceVersion;
    if (timeoutSeconds) queryParams.timeoutSeconds = timeoutSeconds.toString();
    if (allowWatchBookmarks) queryParams.allowWatchBookmarks = 'true';
    if (sendInitialEvents) queryParams.sendInitialEvents = 'true';
    if (resourceVersionMatch)
      queryParams.resourceVersionMatch = resourceVersionMatch;

    url.search = new URLSearchParams(queryParams).toString();

    if (signal) {
      (requestInit as any).signal = signal;
    }
    let response;
    try {
      response = await fetch(url, requestInit);
    } catch (err) {
      if (signal?.aborted) return;
      this.logger.warn(
        `Network error watching "${resourcePath}" from cluster "${clusterDetails.name}": ${err}`,
      );
      yield {
        type: 'ERROR',
        error: {
          errorType: 'SYSTEM_ERROR',
          statusCode: 0,
          resourcePath,
        },
      };
      return;
    }

    if (!response.ok) {
      yield {
        type: 'ERROR',
        error: await this.connection.handleUnsuccessfulResponse(
          clusterDetails.name,
          response,
        ),
      };
      return;
    }

    if (!response.body) {
      yield {
        type: 'ERROR',
        error: {
          errorType: 'SYSTEM_ERROR',
          statusCode: response.status,
          resourcePath,
        },
      };
      return;
    }

    // split the body into a stream of lines
    const stream = response.body.pipe(split2());

    try {
      for await (const line of stream) {
        if (signal?.aborted) return;
        const trimmed = String(line).trim();
        if (!trimmed) continue;

        let data;
        try {
          data = JSON.parse(trimmed);
        } catch (err) {
          this.logger.warn(`Failed to parse watch event: ${err}`);
          continue;
        }

        yield this.transformWatchEvent(data, resourcePath);
      }
    } catch (err) {
      if (signal?.aborted) return;
      this.logger.warn(
        `Stream error watching "${resourcePath}" from cluster "${clusterDetails.name}": ${err}`,
      );
      yield {
        type: 'ERROR',
        error: {
          errorType: 'SYSTEM_ERROR',
          statusCode: 0,
          resourcePath,
        },
      };
    } finally {
      stream.destroy();
      if (response.body && 'destroy' in response.body) {
        (response.body as any).destroy();
      }
    }
  }

  private transformWatchEvent(
    data: any,
    resourcePath: string,
  ): KubernetesWatchEvent {
    if (data.type === 'ERROR') {
      return {
        type: 'ERROR',
        error: {
          errorType: statusCodeToErrorType(data.object?.code || 500),
          statusCode: data.object?.code || 500,
          resourcePath,
        },
      };
    }

    return {
      type: data.type,
      object: data.object,
      resourceVersion: data.object?.metadata?.resourceVersion,
    };
  }
}
