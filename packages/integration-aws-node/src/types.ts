/*
 * Copyright 2022 The Backstage Authors
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
import { AwsCredentialIdentityProvider } from '@aws-sdk/types';

/**
 * A set of credentials information for an AWS account.
 *
 * @public
 */
export type AwsCredentialProvider = {
  /**
   * The AWS account ID of these credentials
   */
  accountId?: string;
  /**
   * The STS region used with these credentials
   */
  stsRegion?: string;
  /**
   * The credential identity provider to use when creating AWS SDK for Javascript V3 clients
   */
  sdkCredentialProvider: AwsCredentialIdentityProvider;
};

/**
 * The options for specifying the AWS credentials to retrieve.
 *
 * @public
 */
export type AwsCredentialProviderOptions = {
  /**
   * The AWS account ID, e.g. '0123456789012'
   */
  accountId?: string;

  /**
   * The resource ARN that will be accessed with the returned credentials.
   * If account ID or region are not specified, they will be inferred from the ARN.
   */
  arn?: string;
};

/**
 * This allows implementations to be provided to retrieve AWS credentials.
 *
 * @public
 */
export interface AwsCredentialsManager {
  /**
   * Get credentials for an AWS account.
   */
  getCredentialProvider(
    opts?: AwsCredentialProviderOptions,
  ): Promise<AwsCredentialProvider>;
}
