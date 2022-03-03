/*
 * Copyright 2020 The Backstage Authors
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

import { ResourceEntityV1alpha1 } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-backend';
import AWS, { Credentials, Organizations } from 'aws-sdk';
import { Account, ListAccountsResponse } from 'aws-sdk/clients/organizations';
import { Logger } from 'winston';
import {
  AwsOrganizationProviderConfig,
  readAwsOrganizationConfig,
} from '../awsOrganization/config';

const AWS_ORGANIZATION_REGION = 'us-east-1';
const LOCATION_TYPE = 'aws-cloud-accounts';

const ACCOUNTID_ANNOTATION = 'amazonaws.com/account-id';
const ARN_ANNOTATION = 'amazonaws.com/arn';
const ORGANIZATION_ANNOTATION = 'amazonaws.com/organization-id';

/**
 * A processor for ingesting AWS Accounts from AWS Organizations.
 *
 * If custom authentication is needed, it can be achieved by configuring the
 * global AWS.credentials object.
 *
 * @public
 */
export class AwsOrganizationCloudAccountProcessor implements CatalogProcessor {
  private readonly organizations: Organizations;
  private readonly provider: AwsOrganizationProviderConfig;

  static fromConfig(config: Config, options: { logger: Logger }) {
    const c = config.getOptionalConfig('catalog.processors.awsOrganization');
    return new AwsOrganizationCloudAccountProcessor({
      ...options,
      provider: c ? readAwsOrganizationConfig(c) : {},
    });
  }

  private static buildCredentials(
    config: AwsOrganizationProviderConfig,
  ): Credentials | undefined {
    const roleArn = config.roleArn;
    if (!roleArn) {
      return undefined;
    }

    return new AWS.ChainableTemporaryCredentials({
      params: {
        RoleSessionName: 'backstage-aws-organization-processor',
        RoleArn: roleArn,
      },
    });
  }

  private constructor(options: { provider: AwsOrganizationProviderConfig }) {
    this.provider = options.provider;
    const credentials = AwsOrganizationCloudAccountProcessor.buildCredentials(
      this.provider,
    );
    this.organizations = new AWS.Organizations({
      credentials,
      region: AWS_ORGANIZATION_REGION,
    }); // Only available in us-east-1
  }

  getProcessorName(): string {
    return 'AwsOrganizationCloudAccountProcessor';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== LOCATION_TYPE) {
      return false;
    }

    (await this.getAwsAccounts())
      .map(account => this.mapAccountToComponent(account))
      .filter(entity => {
        if (location.target !== '') {
          if (entity.metadata.annotations) {
            return (
              entity.metadata.annotations[ORGANIZATION_ANNOTATION] ===
              location.target
            );
          }
          return false;
        }
        return true;
      })
      .forEach(entity => {
        emit(processingResult.entity(location, entity));
      });

    return true;
  }

  private normalizeName(name: string): string {
    return name
      .trim()
      .toLocaleLowerCase('en-US')
      .replace(/[^a-zA-Z0-9\-]/g, '-');
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

  private async getAwsAccounts(): Promise<Account[]> {
    let awsAccounts: Account[] = [];
    let isInitialAttempt = true;
    let nextToken = undefined;
    while (isInitialAttempt || nextToken) {
      isInitialAttempt = false;
      const orgAccounts: ListAccountsResponse = await this.organizations
        .listAccounts({ NextToken: nextToken })
        .promise();
      if (orgAccounts.Accounts) {
        awsAccounts = awsAccounts.concat(orgAccounts.Accounts);
      }
      nextToken = orgAccounts.NextToken;
    }

    return awsAccounts;
  }

  private mapAccountToComponent(account: Account): ResourceEntityV1alpha1 {
    const { accountId, organizationId } = this.extractInformationFromArn(
      account.Arn as string,
    );
    return {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Resource',
      metadata: {
        annotations: {
          [ACCOUNTID_ANNOTATION]: accountId,
          [ARN_ANNOTATION]: account.Arn || '',
          [ORGANIZATION_ANNOTATION]: organizationId,
        },
        name: this.normalizeName(account.Name || ''),
        namespace: 'default',
      },
      spec: {
        type: 'cloud-account',
        owner: 'unknown',
      },
    };
  }
}
