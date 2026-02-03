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

export interface Config {
  /** Configuration for access to AWS accounts */
  aws?: {
    /**
     * Defaults for retrieving AWS account credentials
     */
    accountDefaults?: {
      /**
       * The IAM role to assume to retrieve temporary AWS credentials
       */
      roleName?: string;

      /**
       * The AWS partition of the IAM role, e.g. "aws", "aws-cn"
       */
      partition?: string;

      /**
       * The STS regional endpoint to use when retrieving temporary AWS credentials, e.g. "ap-northeast-1"
       */
      region?: string;

      /**
       * The unique identifier needed to assume the role to retrieve temporary AWS credentials
       * @visibility secret
       */
      externalId?: string;
    };

    /**
     * Main account to use for retrieving AWS account credentials
     */
    mainAccount?: {
      /**
       * The access key ID for a set of static AWS credentials
       * @visibility secret
       */
      accessKeyId?: string;

      /**
       * The secret access key for a set of static AWS credentials
       * @visibility secret
       */
      secretAccessKey?: string;

      /**
       * The configuration profile from a credentials file at ~/.aws/credentials and
       * a configuration file at ~/.aws/config.
       */
      profile?: string;

      /**
       * The STS regional endpoint to use for the main account, e.g. "ap-northeast-1"
       */
      region?: string;
    };

    /**
     * Configuration for retrieving AWS accounts credentials
     */
    accounts?: Array<{
      /**
       * The account ID of the target account that this matches on, e.g. "123456789012"
       */
      accountId: string;

      /**
       * The access key ID for a set of static AWS credentials
       * @visibility secret
       */
      accessKeyId?: string;

      /**
       * The secret access key for a set of static AWS credentials
       * @visibility secret
       */
      secretAccessKey?: string;

      /**
       * The configuration profile from a credentials file at ~/.aws/credentials and
       * a configuration file at ~/.aws/config.
       */
      profile?: string;

      /**
       * The IAM role to assume to retrieve temporary AWS credentials
       */
      roleName?: string;

      /**
       * The AWS partition of the IAM role, e.g. "aws", "aws-cn"
       */
      partition?: string;

      /**
       * The STS regional endpoint to use when retrieving temporary AWS credentials, e.g. "ap-northeast-1"
       */
      region?: string;

      /**
       * The unique identifier needed to assume the role to retrieve temporary AWS credentials
       * @visibility secret
       */
      externalId?: string;
    }>;
  };
}
