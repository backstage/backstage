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

export interface Config {
  /** Configuration options for the techdocs plugin */
  techdocs: {
    /**
     * documentation building process depends on the builder attr
     * attr: 'builder' - accepts a string value
     * e.g. builder: 'local'
     * alternative: 'external' etc.
     * @see http://backstage.io/docs/features/techdocs/configuration
     * @visibility frontend
     */
    builder: 'local' | 'external';

    /**
     * techdocs publisher information
     */
    generators?: {
      /**
       * attr: 'techdocs' - accepts a string value
       * e.g. type: 'docker'
       * alternatives: 'local' etc.
       * @see http://backstage.io/docs/features/techdocs/configuration
       */
      techdocs: 'local' | 'docker';
    };

    /**
     * techdocs publisher information
     */
    publisher?:
      | {
          /**
           * attr: 'type' - accepts a string value
           * e.g. type: 'local'
           * alternatives: 'googleGcs' etc.
           * @see http://backstage.io/docs/features/techdocs/configuration
           */
          type: 'local';
        }
      | {
          /**
           * attr: 'type' - accepts a string value
           * e.g. type: 'awsS3'
           * alternatives: 'googleGcs' etc.
           * @see http://backstage.io/docs/features/techdocs/configuration
           */
          type: 'awsS3';

          /**
           * awsS3 required when 'type' is set to awsS3
           */
          awsS3?: {
            /**
             * (Optional) Credentials used to access a storage bucket.
             * If not set, environment variables or aws config file will be used to authenticate.
             * https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-environment.html
             * https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-shared.html
             * @visibility secret
             */
            credentials?: {
              /**
               * User access key id
               * attr: 'accessKeyId' - accepts a string value
               * @visibility secret
               */
              accessKeyId: string;
              /**
               * User secret access key
               * attr: 'secretAccessKey' - accepts a string value
               * @visibility secret
               */
              secretAccessKey: string;
            };
            /**
             * (Required) Cloud Storage Bucket Name
             * attr: 'bucketName' - accepts a string value
             * @visibility backend
             */
            bucketName: string;
            /**
             * (Optional) AWS Region.
             * If not set, AWS_REGION environment variable or aws config file will be used.
             * https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-region.html
             * attr: 'region' - accepts a string value
             * @visibility secret
             */
            region?: string;
          };
        }
      | {
          /**
           * attr: 'type' - accepts a string value
           * e.g. type: 'azureBlobStorage'
           * alternatives: 'azureBlobStorage' etc.
           * @see http://backstage.io/docs/features/techdocs/configuration
           */
          type: 'azureBlobStorage';

          /**
           * azureBlobStorage required when 'type' is set to azureBlobStorage
           */
          azureBlobStorage?: {
            /**
             * (Required) Credentials used to access a storage container.
             * @visibility secret
             */
            credentials: {
              /**
               * Account access name
               * attr: 'account' - accepts a string value
               * @visibility secret
               */
              accountName: string;
              /**
               * (Optional) Account secret primary key
               * If not set, environment variables will be used to authenticate.
               * https://docs.microsoft.com/en-us/azure/storage/common/storage-auth?toc=/azure/storage/blobs/toc.json
               * attr: 'accountKey' - accepts a string value
               * @visibility secret
               */
              accountKey?: string;
            };
            /**
             * (Required) Cloud Storage Container Name
             * attr: 'containerName' - accepts a string value
             * @visibility backend
             */
            containerName: string;
          };
        }
      | {
          /**
           * attr: 'type' - accepts a string value
           * e.g. type: 'googleGcs'
           * alternatives: 'googleGcs' etc.
           * @see http://backstage.io/docs/features/techdocs/configuration
           */
          type: 'googleGcs';

          /**
           * googleGcs required when 'type' is set to googleGcs
           */
          googleGcs?: {
            /**
             * (Required) Cloud Storage Bucket Name
             * attr: 'bucketName' - accepts a string value
             * @visibility backend
             */
            bucketName: string;
            /**
             * (Optional) API key used to write to a storage bucket.
             * If not set, environment variables will be used to authenticate.
             * Read more: https://cloud.google.com/docs/authentication/production
             * attr: 'credentials' - accepts a string value
             * @visibility secret
             */
            credentials?: string;
          };
        };
    /**
     * attr: 'requestUrl' - accepts a string value
     * e.g. requestUrl: http://localhost:7000/api/techdocs
     * @visibility frontend
     * @deprecated
     */
    requestUrl?: string;
    /**
     * attr: 'storageUrl' - accepts a string value
     * e.g. storageUrl: http://localhost:7000/api/techdocs/static/docs
     * @deprecated
     */
    storageUrl?: string;
  };
}
