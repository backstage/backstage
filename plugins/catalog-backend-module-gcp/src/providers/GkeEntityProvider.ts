import { TaskRunner } from '@backstage/backend-tasks';
import {
    EntityProvider, EntityProviderConnection,
    LocationSpec,
    locationSpecToLocationEntity
  } from '@backstage/plugin-catalog-backend';
  import { Logger } from 'winston';
  import * as container from '@google-cloud/container';

export class GkeEntityProvider implements EntityProvider {

  private readonly logger: Logger;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;

  constructor(logger: Logger, taskRunner: TaskRunner) {
    this.logger = logger;
    this.scheduleFn = this.createScheduleFn(taskRunner);
  }
  
  getProviderName(): string {
    return `gcp-gke`
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();
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
            console.error(error)
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
      parent: `projects/some-project/locations/-`,
    };
    const client = new container.v1.ClusterManagerClient();
    const [response] = await client.listClusters(request);

    const locations = response.clusters?.map(c => {
      return this.createLocationSpec(c)
    }) ?? [];

    await this.connection.applyMutation({
      type: 'full',
      entities: locations.map(location => {
        return {
          locationKey: this.getProviderName(),
          entity: locationSpecToLocationEntity({ location }),
        };
      }),
    });

  }

  private createLocationSpec(cluster: container.protos.google.container.v1.ICluster): LocationSpec {

    //format: "https://container.googleapis.com/v1/projects/some-proj/locations/region/clusters/cluster"
    return {
      type: 'gcp-gke',
      target: (cluster.selfLink ?? "").replace("https://container.googleapis.com/v1/", ""),
      presence: 'required',
    };
  }

}