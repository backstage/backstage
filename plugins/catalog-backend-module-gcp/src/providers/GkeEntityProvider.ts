/*
 * Copyright 2023 The Backstage Authors
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
import { TaskRunner } from '@backstage/backend-tasks';
import {
  DeferredEntity,
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';

import { Logger } from 'winston';
import * as container from '@google-cloud/container';
import {
  ANNOTATION_KUBERNETES_API_SERVER,
  ANNOTATION_KUBERNETES_API_SERVER_CA,
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
} from '@backstage/plugin-kubernetes-common';

export class GkeEntityProvider implements EntityProvider {
  private readonly logger: Logger;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;

  constructor(logger: Logger, taskRunner: TaskRunner) {
    this.logger = logger;
    this.scheduleFn = this.createScheduleFn(taskRunner);
  }

  getProviderName(): string {
    return `gcp-gke`;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();
  }

  private filterOutUndefined(
    e: DeferredEntity | undefined,
  ): e is DeferredEntity {
    return e !== undefined;
  }

  private clusterToResource(
    cluster: container.protos.google.container.v1.ICluster,
  ): DeferredEntity | undefined {
    const location = (cluster.selfLink ?? '').replace(
      'https://container.googleapis.com/v1/',
      '',
    );

    if (!cluster.name || !cluster.selfLink || !location) {
      // TODO log probably

      return undefined;
    }

    return {
      locationKey: `gcp-gke:/${location}`,
      entity: {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Resource',
        metadata: {
          annotations: {
            [ANNOTATION_KUBERNETES_API_SERVER]: cluster.endpoint || '',
            [ANNOTATION_KUBERNETES_API_SERVER_CA]:
              cluster.masterAuth?.clusterCaCertificate || '',
            [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google',
            'backstage.io/managed-by-location': `gcp-gke:/${location}`,
            'backstage.io/managed-by-origin-location': `gcp-gke:/${location}`,
          },
          name: cluster.name,
          namespace: 'default',
        },
        spec: {
          type: 'kubernetes-cluster',
          owner: 'unknown',
        },
      },
    };
  }

  private createScheduleFn(taskRunner: TaskRunner): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          try {
            await this.refresh();
          } catch (error) {
            console.error(error);
          }
        },
      });
    };
  }

  async refresh() {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    this.logger.info('Discovering GKE clusters');
    const request = {
      // TODO configify this
      parent: `projects/?????/locations/-`,
    };
    const client = new container.v1.ClusterManagerClient();
    const [response] = await client.listClusters(request);

    const resources =
      response.clusters
        ?.map(this.clusterToResource)
        .filter(this.filterOutUndefined) ?? [];

    this.logger.info(
      `Ingesting GKE clusters [${resources
        .map(r => r.entity.metadata.name)
        .join(', ')}]`,
    );

    await this.connection.applyMutation({
      type: 'full',
      entities: resources,
    });
  }
}
