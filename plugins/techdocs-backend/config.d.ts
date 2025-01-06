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

export interface Config {
  /**
   * Configuration options for the techdocs-backend plugin
   * @see http://backstage.io/docs/features/techdocs/configuration
   */
  techdocs: {
    /**
     * Documentation building process depends on the builder attr
     * @visibility frontend
     */
    builder?: 'local' | 'external';

    /**
     * Techdocs generator information
     */
    generator?: {
      /**
       * Where to run the techdocs (mkdocs) generator
       */
      runIn: 'local' | 'docker';

      /**
       * Override the default techdocs docker image
       */
      dockerImage?: string;

      /**
       * Pull the latest docker image
       */
      pullImage?: boolean;

      /**
       * Override behavior specific to mkdocs.
       */
      mkdocs?: {
        /**
         * (Optional and not recommended) Configures the techdocs generator to
         * attempt to ensure an index.md exists falling back to using <docs-dir>/README.md
         * or README.md in case a default <docs-dir>/index.md is not provided.
         * Note that https://www.mkdocs.org/user-guide/configuration/#edit_uri behavior
         * will be broken in these scenarios.
         */
        legacyCopyReadmeMdToIndexMd?: boolean;

        /**
         * List of mkdocs plugins which should be added as default to all mkdocs.yml files.
         */
        defaultPlugins?: string[];
      };
    };

    /**
     * Techdocs publisher information
     */
    publisher?:
      | {
          type: 'local';

          /**
           *  Optional when 'type' is set to local
           */
          local?: {
            /**
             * (Optional) Directory to store generated static files.
             */
            publishDirectory?: string;
          };
        }
      | {
          type: 'awsS3';

          /**
           * Required when 'type' is set to awsS3
           */
          awsS3?: {
            /**
             * (Optional) The AWS account ID where the storage bucket is located.
             * Credentials for the account ID will be sourced from the 'aws' app config section.
             * See the
             * [integration-aws-node package](https://github.com/backstage/backstage/blob/master/packages/integration-aws-node/README.md)
             * for details on how to configure the credentials in the app config.
             * If account ID is not set and no credentials are set, environment variables or aws config file will be used to authenticate.
             * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-environment.html
             * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-shared.html
             * @visibility secret
             */
            accountId?: string;
            /**
             * (Optional) Credentials used to access a storage bucket.
             * This section is now deprecated. Configuring the account ID is now preferred, with credentials in the 'aws'
             * app config section.
             * If not set and no account ID is set, environment variables or aws config file will be used to authenticate.
             * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-environment.html
             * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-shared.html
             * @visibility secret
             */
            credentials?: {
              /**
               * User access key id
               * @visibility secret
               */
              accessKeyId?: string;
              /**
               * User secret access key
               * @visibility secret
               */
              secretAccessKey?: string;
              /**
               * ARN of role to be assumed
               */
              roleArn?: string;
            };
            /**
             * (Required) Cloud Storage Bucket Name
             */
            bucketName: string;
            /**
             * (Optional) Location in storage bucket to save files
             * If not set, the default location will be the root of the storage bucket
             */
            bucketRootPath?: string;
            /**
             * (Optional) AWS Region.
             * If not set, AWS_REGION environment variable or aws config file will be used.
             * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-region.html
             * @visibility secret
             */
            region?: string;
            /**
             * (Optional) AWS Endpoint.
             * The endpoint URI to send requests to. The default endpoint is built from the configured region.
             * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
             * @visibility secret
             */
            endpoint?: string;
            /**
             * (Optional) Whether to use path style URLs when communicating with S3.
             * Defaults to false.
             * This allows providers like LocalStack, Minio and Wasabi (and possibly others) to be used to host tech docs.
             */
            s3ForcePathStyle?: boolean;

            /**
             * (Optional) AWS Server Side Encryption
             * Defaults to undefined.
             * If not set, encrypted buckets will fail to publish.
             * https://docs.aws.amazon.com/AmazonS3/latest/userguide/specifying-s3-encryption.html
             */
            sse?: 'aws:kms' | 'AES256';
          };
        }
      | {
          type: 'openStackSwift';

          /**
           * Required when 'type' is set to openStackSwift
           */
          openStackSwift?: {
            /**
             * (Required) Credentials used to access a storage bucket.
             * @see https://docs.openstack.org/api-ref/identity/v3/?expanded=password-authentication-with-unscoped-authorization-detail#password-authentication-with-unscoped-authorization
             * @visibility secret
             */
            credentials: {
              /**
               * (Required) Application Credential ID
               * @visibility secret
               */
              id: string;
              /**
               * (Required) Application Credential Secret
               * @visibility secret
               */
              secret: string; // required
            };
            /**
             * (Required) Cloud Storage Container Name
             */
            containerName: string;
            /**
             * (Required) Auth url sometimes OpenStack uses different port check your OpenStack apis.
             */
            authUrl: string;
            /**
             * (Required) Swift URL
             */
            swiftUrl: string;
          };
        }
      | {
          type: 'azureBlobStorage';

          /**
           * Required when 'type' is set to azureBlobStorage
           */
          azureBlobStorage?: {
            /**
             * (Optional) Connection string of the storage container.
             * @visibility secret
             */
            connectionString?: string;
            /**
             * (Optional) Credentials used to access a storage container.
             * @visibility secret
             */
            credentials?: {
              /**
               * Account access name
               * @visibility secret
               */
              accountName: string;
              /**
               * (Optional) Account secret primary key
               * If not set, environment variables will be used to authenticate.
               * @see https://docs.microsoft.com/en-us/azure/storage/common/storage-auth?toc=/azure/storage/blobs/toc.json
               * @visibility secret
               */
              accountKey?: string;
            };
            /**
             * (Required) Cloud Storage Container Name
             */
            containerName: string;
          };
        }
      | {
          type: 'googleGcs';

          /**
           * Required when 'type' is set to googleGcs
           */
          googleGcs?: {
            /**
             * (Required) Cloud Storage Bucket Name
             */
            bucketName: string;
            /**
             * (Optional) API key used to write to a storage bucket.
             * If not set, environment variables will be used to authenticate.
             * @see  https://cloud.google.com/docs/authentication/production
             * @visibility secret
             */
            credentials?: string;
            /**
             * (Optional) GCP project ID that contains the bucket. Should be
             * set if credentials is not set, or if the service account in
             * the credentials belongs to a different project to the bucket.
             */
            projectId?: string;
            /**
             * (Optional) Location in storage bucket to save files
             * If not set, the default location will be the root of the storage bucket
             */
            bucketRootPath?: string;
          };
        };

    /**
     * @example http://localhost:7007/api/techdocs
     * Techdocs cache information
     */
    cache?: {
      /**
       * The cache time-to-live for TechDocs sites (in milliseconds). Set this
       * to a non-zero value to cache TechDocs sites and assets as they are
       * read from storage.
       *
       * Note: you must also configure `backend.cache` appropriately as well,
       * and to pass a PluginCacheManager instance to TechDocs Backend's
       * createRouter method in your backend.
       */
      ttl: number;

      /**
       * The time (in milliseconds) that the TechDocs backend will wait for
       * a cache service to respond before continuing on as though the cached
       * object was not found (e.g. when the cache sercice is unavailable).
       *
       * Defaults to 1000 milliseconds.
       */
      readTimeout?: number;
    };

    /**
     * (Optional and not recommended) Prior to version [0.x.y] of TechDocs, docs
     * sites could only be accessed over paths with case-sensitive entity triplets
     * e.g. (namespace/Kind/name). If you are upgrading from an older version of
     * TechDocs and are unable to perform the necessary migration of files in your
     * external storage, you can set this value to `true` to temporarily revert to
     * the old, case-sensitive entity triplet behavior.
     */
    legacyUseCaseSensitiveTripletPaths?: boolean;
  };
}
