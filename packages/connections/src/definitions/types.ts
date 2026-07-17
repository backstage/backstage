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
import { AwsCodeCommitConnectionType } from '../schema/awsCodeCommit';
import { AwsS3ConnectionType } from '../schema/awsS3';
import { AzureBlobStorageConnectionType } from '../schema/azureBlobStorage';
import { AzureConnectionType } from '../schema/azure';
import { BitbucketCloudConnectionType } from '../schema/bitbucketCloud';
import { BitbucketServerConnectionType } from '../schema/bitbucketServer';
import { GerritConnectionType } from '../schema/gerrit';
import { GiteaConnectionType } from '../schema/gitea';
import { GithubConnectionType } from '../schema/github';
import { GitlabConnectionType } from '../schema/gitlab';
import { GoogleGcsConnectionType } from '../schema/googleGcs';
import { HarnessConnectionType } from '../schema/harness';
import type { ConnectionType } from '../api/ConnectionType';

function createConnectionTypes<
  const T extends {
    [K in keyof T]: ConnectionType & { type: K };
  },
>(types: T): T {
  return types;
}

/** @public */
export const connectionTypes = createConnectionTypes({
  'aws-codecommit': AwsCodeCommitConnectionType,
  'aws-s3': AwsS3ConnectionType,
  'azure-blob-storage': AzureBlobStorageConnectionType,
  azure: AzureConnectionType,
  'bitbucket-cloud': BitbucketCloudConnectionType,
  'bitbucket-server': BitbucketServerConnectionType,
  gerrit: GerritConnectionType,
  gitea: GiteaConnectionType,
  github: GithubConnectionType,
  gitlab: GitlabConnectionType,
  'google-gcs': GoogleGcsConnectionType,
  harness: HarnessConnectionType,
});

/** @public */
export type ConnectionTypeKey = keyof typeof connectionTypes;

/** @public */
export type LookupConnectionType<T extends ConnectionTypeKey | ConnectionType> =
  T extends ConnectionTypeKey ? (typeof connectionTypes)[T] : T;
