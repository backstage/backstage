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
  EntityProvider,
  EntityProviderConnection,
  DeferredEntity,
} from '@backstage/plugin-catalog-node';
import * as uuid from 'uuid';
import {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';
import {
  AwsCredentialProvider,
  AwsCredentialsManager,
  DefaultAwsCredentialsManager,
} from '@backstage/integration-aws-node';
import {
  Account,
  Organizations,
  paginateListAccounts,
} from '@aws-sdk/client-organizations';
import { ResourceEntityV1alpha1 } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  readProviderConfigs,
  AwsOrganizationEntityProviderConfig,
} from '../config';

const AWS_ORGANIZATION_REGION = 'us-east-1';
const ACCOUNT_STATUS_LABEL = 'amazonaws.com/account-status';
const ACCOUNTID_ANNOTATION = 'amazonaws.com/account-id';
const ACCOUNT_EMAIL_ANNOTATION = 'amazonaws.com/account-email';
const ARN_ANNOTATION = 'amazonaws.com/arn';
const ORGANIZATION_ANNOTATION = 'amazonaws.com/organization-id';

/**
 * Catalog provider to ingest AWS Organization accounts.
 *
 * @public
 */
export class AwsOrganizationEntityProvider implements EntityProvider {
  private readonly providerConfig: AwsOrganizationEntityProviderConfig;
  private readonly logger: LoggerService;
  private readonly scheduleFn: () => Promise<void>;
  private readonly organizations: Organizations;
  private connection?: EntityProviderConnection;

  private constructor(
    providerConfig: AwsOrganizationEntityProviderConfig,
    logger: LoggerService,
    taskRunner: SchedulerServiceTaskRunner,
    private readonly credProvider: AwsCredentialProvider,
  ) {
    this.providerConfig = providerConfig;
    this.logger = logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(taskRunner);
    this.organizations = new Organizations({
      credentialDefaultProvider: () => this.credProvider.sdkCredentialProvider,
      region: AWS_ORGANIZATION_REGION,
    }); // Only available in us-east-1
  }

  getProviderName(): string {
    return `aws-org-provider:${this.providerConfig.id}`;
  }

  public static async fromConfig(
    config: Config,
    options: {
      logger: LoggerService;
      scheduler: SchedulerService;
      awsCredentialsManager?: AwsCredentialsManager;
    },
  ): Promise<AwsOrganizationEntityProvider[]> {
    return await Promise.all(
      readProviderConfigs(config).map(async providerConfig => {
        if (!providerConfig.schedule) {
          throw new Error('Schedule is required');
        }
        const taskRunner = options.scheduler.createScheduledTaskRunner(
          providerConfig.schedule,
        );

        const awsCredentialsManager: AwsCredentialsManager =
          options.awsCredentialsManager ||
          DefaultAwsCredentialsManager.fromConfig(config);

        const credProvider = await awsCredentialsManager.getCredentialProvider({
          accountId: providerConfig.accountId,
        });

        return new AwsOrganizationEntityProvider(
          providerConfig,
          options.logger,
          taskRunner,
          credProvider,
        );
      }),
    );
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    return await this.scheduleFn();
  }

  async refresh(logger: LoggerService) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    logger.info('Discovering AWS Organization AWS accounts');

    let accounts: Account[];

    try {
      accounts = await this.getAwsAccounts();
    } catch (e: any) {
      this.logger.error('error fetching AWS Organization accounts', e);
      return;
    }

    const resources = accounts.map(c => this.accountToResource(c));

    logger.info(`Discovered ${resources.length} AWS Organization accounts`);

    await this.connection.applyMutation({
      type: 'full',
      entities: resources,
    });

    logger.info('Finished syncing AWS Organization accounts');
  }

  private async getAwsAccounts(): Promise<Account[]> {
    const awsAccounts: Account[] = [];

    for await (const page of paginateListAccounts(
      { client: this.organizations },
      {},
    )) {
      awsAccounts.push(...(page.Accounts || []));
    }

    return awsAccounts;
  }

  private normalizeName(name: string): string {
    return name
      .trim()
      .toLocaleLowerCase('en-US')
      .replace(/[^a-zA-Z0-9\-]/g, '-');
  }

  private normalizeAccountStatus(name: string): string {
    return name.toLocaleLowerCase('en-US');
  }

  private extractInformationFromArn(arn: string): {
    accountId: string;
    organizationId: string;
  } {
    const parts = arn.split('/');

    return {
      accountId: parts[parts.length - 1],
      organizationId: parts[parts.length - 2],
    };
  }

  private accountToResource(account: Account): DeferredEntity {
    if (!account.Arn) {
      throw new Error('Account ARN is missing');
    }

    const { accountId, organizationId } = this.extractInformationFromArn(
      account.Arn,
    );

    const entity: ResourceEntityV1alpha1 = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Resource',
      metadata: {
        annotations: {
          [ACCOUNTID_ANNOTATION]: accountId,
          [ARN_ANNOTATION]: account.Arn || '',
          [ORGANIZATION_ANNOTATION]: organizationId,
          [ACCOUNT_EMAIL_ANNOTATION]: account.Email || '',
          'backstage.io/managed-by-location': 'aws:org',
          'backstage.io/managed-by-origin-location': 'aws:org',
        },
        labels: {
          [ACCOUNT_STATUS_LABEL]: this.normalizeAccountStatus(
            account.Status || '',
          ),
        },
        name: this.normalizeName(account.Name || ''),
        title: account.Name || '',
        namespace: 'default',
      },
      spec: {
        type: 'cloud-account',
        // TODO: use tags to manage ownership
        owner: 'unknown',
      },
    };

    return {
      locationKey: this.getProviderName(),
      entity,
    };
  }

  private createScheduleFn(
    taskRunner: SchedulerServiceTaskRunner,
  ): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: AwsOrganizationEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid.v4(),
          });
          try {
            await this.refresh(logger);
          } catch (error: any) {
            logger.error(`${this.getProviderName()} refresh failed`, error);
          }
        },
      });
    };
  }
}
