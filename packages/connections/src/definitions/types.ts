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
import { ArgoCdConnectionType } from '../schema/argocd';
import { AwsCodeCommitConnectionType } from '../schema/awsCodeCommit';
import { AwsConnectionType } from '../schema/aws';
import { AwsS3ConnectionType } from '../schema/awsS3';
import { AzureBlobStorageConnectionType } from '../schema/azureBlobStorage';
import { AzureConnectionType } from '../schema/azure';
import { BitbucketCloudConnectionType } from '../schema/bitbucketCloud';
import { BitbucketServerConnectionType } from '../schema/bitbucketServer';
import { DatadogConnectionType } from '../schema/datadog';
import { GerritConnectionType } from '../schema/gerrit';
import { GiteaConnectionType } from '../schema/gitea';
import { GithubConnectionType } from '../schema/github';
import { GitlabConnectionType } from '../schema/gitlab';
import { GoogleGcsConnectionType } from '../schema/googleGcs';
import { GrafanaConnectionType } from '../schema/grafana';
import { HarnessConnectionType } from '../schema/harness';
import { JenkinsConnectionType } from '../schema/jenkins';
import { JiraConnectionType } from '../schema/jira';
import { PagerDutyConnectionType } from '../schema/pagerduty';
import { SnykConnectionType } from '../schema/snyk';
import { SonarqubeConnectionType } from '../schema/sonarqube';
import type { ConnectionTypeDefinition } from '../api/ConnectionType';

function createConnectionTypes<
  const T extends {
    [K in keyof T]: ConnectionTypeDefinition & { type: K };
  },
>(types: T): T {
  return types;
}

/** @public */
export const connectionTypes = createConnectionTypes({
  argocd: ArgoCdConnectionType,
  aws: AwsConnectionType,
  'aws-codecommit': AwsCodeCommitConnectionType,
  'aws-s3': AwsS3ConnectionType,
  azure: AzureConnectionType,
  'azure-blob-storage': AzureBlobStorageConnectionType,
  'bitbucket-cloud': BitbucketCloudConnectionType,
  'bitbucket-server': BitbucketServerConnectionType,
  datadog: DatadogConnectionType,
  gerrit: GerritConnectionType,
  gitea: GiteaConnectionType,
  github: GithubConnectionType,
  gitlab: GitlabConnectionType,
  'google-gcs': GoogleGcsConnectionType,
  grafana: GrafanaConnectionType,
  harness: HarnessConnectionType,
  jenkins: JenkinsConnectionType,
  jira: JiraConnectionType,
  pagerduty: PagerDutyConnectionType,
  snyk: SnykConnectionType,
  sonarqube: SonarqubeConnectionType,
});

/** @public */
export type ConnectionType = keyof typeof connectionTypes;

/** @public */
export type LookupConnectionType<
  T extends ConnectionType | ConnectionTypeDefinition,
> = T extends ConnectionType ? (typeof connectionTypes)[T] : T;
