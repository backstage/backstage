/*
 * Copyright 2020 Spotify AB
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
import { LocationSpec, ResourceEntityV1alpha1 } from '@backstage/catalog-model';
import {
  Account,
  Organizations,
  ListAccountsCommandOutput,
} from '@aws-sdk/client-organizations';

import * as results from './results';
import { CatalogProcessor, CatalogProcessorEmit } from './types';

const AWS_ORGANIZATION_REGION = 'us-east-1';
const LOCATION_TYPE = 'aws-cloud-accounts';

const ACCOUNTID_ANNOTATION: string = 'amazonaws.com/account-id';
const ARN_ANNOTATION: string = 'amazonaws.com/arn';
const ORGANIZATION_ANNOTATION: string = 'amazonaws.com/organization-id';

/**
 * A processor for ingesting AWS Accounts from AWS Organizations.
 *
 * If custom authentication is needed, it can be achieved by configuring the global AWS.credentials object.
 */
export class AwsOrganizationCloudAccountProcessor implements CatalogProcessor {
  organizations: Organizations;
  constructor() {
    this.organizations = new Organizations({
      region: AWS_ORGANIZATION_REGION,
    }); // Only available in us-east-1
  }

  normalizeName(name: string): string {
    return name
      .trim()
      .toLocaleLowerCase()
      .replace(/[^a-zA-Z0-9\-]/g, '-');
  }

  extractInformationFromArn(
    arn: string,
  ): { accountId: string; organizationId: string } {
    const parts = arn.split('/');

    return {
      accountId: parts[parts.length - 1],
      organizationId: parts[parts.length - 2],
    };
  }

  async getAwsAccounts(): Promise<Account[]> {
    let awsAccounts: Account[] = [];
    let isInitialAttempt = true;
    let nextToken = undefined;
    while (isInitialAttempt || nextToken) {
      isInitialAttempt = false;
      const orgAccounts: ListAccountsCommandOutput = await this.organizations.listAccounts(
        { NextToken: nextToken },
      );
      if (orgAccounts.Accounts) {
        awsAccounts = awsAccounts.concat(orgAccounts.Accounts);
      }
      nextToken = orgAccounts.NextToken;
    }

    return awsAccounts;
  }

  mapAccountToComponent(account: Account): ResourceEntityV1alpha1 {
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
      .forEach((entity: ResourceEntityV1alpha1) => {
        emit(results.entity(location, entity));
      });

    return true;
  }
}
