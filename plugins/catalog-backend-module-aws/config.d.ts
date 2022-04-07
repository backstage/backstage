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

interface AwsS3Config {
  /**
   * (Required) AWS S3 Bucket Name
   * @visibility backend
   */
  bucketName: string;
  /**
   * (Optional) AWS S3 Object key prefix
   * If not set, all keys will be accepted, no filtering will be applied.
   * @visibility backend
   */
  prefix?: string;
  /**
   * (Optional) AWS Region.
   * If not set, AWS_REGION environment variable or aws config file will be used.
   * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-region.html
   * @visibility backend
   */
  region?: string;
}

export interface Config {
  catalog?: {
    /**
     * List of processor-specific options and attributes
     */
    processors?: {
      /**
       * AwsOrganizationCloudAccountProcessor configuration
       */
      awsOrganization?: {
        provider: {
          /**
           * The role to be assumed by this processor
           */
          roleArn?: string;
        };
      };
    };
    /**
     * List of provider-specific options and attributes
     */
    providers?: {
      /**
       * AwsS3EntityProvider configuration
       *
       * Uses "default" as default id for the single config variant.
       */
      awsS3?: AwsS3Config | Record<string, AwsS3Config>;
    };
  };
}
