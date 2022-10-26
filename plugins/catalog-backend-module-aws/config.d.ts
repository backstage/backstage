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

import { TaskScheduleDefinitionConfig } from '@backstage/backend-tasks';

export interface Config {
  catalog?: {
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
    providers?: {
      /**
       * AwsS3EntityProvider configuration
       *
       * Uses "default" as default id for the single config variant.
       */
      awsS3?:
        | {
            /**
             * (Required) AWS S3 Bucket Name
             */
            bucketName: string;
            /**
             * (Optional) AWS S3 Object key prefix
             * If not set, all keys will be accepted, no filtering will be applied.
             */
            prefix?: string;
            /**
             * (Optional) AWS Region.
             * If not set, AWS_REGION environment variable or aws config file will be used.
             * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-region.html
             */
            region?: string;
            /**
             * (Optional) TaskScheduleDefinition for the refresh.
             */
            schedule?: TaskScheduleDefinitionConfig;
          }
        | Record<
            string,
            {
              /**
               * (Required) AWS S3 Bucket Name
               */
              bucketName: string;
              /**
               * (Optional) AWS S3 Object key prefix
               * If not set, all keys will be accepted, no filtering will be applied.
               */
              prefix?: string;
              /**
               * (Optional) AWS Region.
               * If not set, AWS_REGION environment variable or aws config file will be used.
               * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-region.html
               */
              region?: string;
              /**
               * (Optional) TaskScheduleDefinition for the refresh.
               */
              schedule?: TaskScheduleDefinitionConfig;
            }
          >;
    };
  };
}
