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
  /**
   * Configuration settings for the cloud-carbon-footprint-backend plugin
   * Each key should correspond to an environment variable listed here: https://www.cloudcarbonfootprint.org/docs/configurations-glossary/
   */
  cloudCarbonFootprint?: {
    /** All client settings are optional **/
    client?: {
      /**
       * Use this to ensure the application requests usage data from the entire previous calendar year to today. Unset to make this false. Defaults to true.
       * @visibility frontend
       */
      previousYearOfUsage?: boolean;
      /**
       * Value to set how the cloud provider queries should return data (e.g. day/week/month/quarter/year). Default to 'day'
       * @visibility frontend
       */
      groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';

      /** Use the following settings if previousYearOfUsage is set to false **/

      /**
       * The type of time period to be used.
       * @visibility frontend
       */
      dateRangeType?: 'days' | 'weeks' | 'months' | 'quarters' | 'years';
      /**
       * The quantity of dateRangeType to be used.
       * @visibility frontend
       */
      dateRangeValue?: number;
    };

    aws?: {
      /**
       * This variable is needed if you are authenticating with ChainableTemporaryCredentials. E.g. from one role to the authorized role.
       * @visibility backend
       */
      targetAccountRoleName?: string;

      /** Variables needed for the Billing Data (Holistic) approach with AWS **/

      /**
       * Use this to configure the application to query Cost and Usage Reports via AWS Athena. Unset to make this false. Defaults to true.
       * @visibility backend
       */
      useBillingData?: boolean;
      /**
       * The name of your AWS Athena Database with Cost and Usage Reports data
       * @visibility backend
       */
      athenaDbName?: string;
      /**
       * The name of your AWS Athena Table with Cost and Usage Reports data
       * @visibility backend
       */
      athenaDbTable?: string;
      /**
       * The region your AWS Athena Database/Table were created in.
       * @visibility backend
       */
      athenaRegion?: string;
      /**
       * The AWS S3 Bucket that you want your Athena query results to reside in. Must be prefixed with "s3://".
       * @visibility backend
       */
      athenaQueryResultLocation?: string;
      /**
       * Your AWS Billing Account ID, where Cost and Usage Reports are configured.
       * @visibility backend
       */
      billingAccountId?: string;
      /**
       * The name of your AWS Billing Account. This can be any value.
       * @visibility backend
       */
      billingAccountName?: string;

      /** Variables needed for the Cloud Usage API (Higher Accuracy) approach with AWS **/

      /**
       * This is array of objects with keys "id" and "name" that match the AWS accounts you want to pull usage data from to run energy/carbon estimation for.
       * @visibility backend
       */
      accounts?: Array<{
        id: string;
        name: string;
      }>;

      /** Set all the following variables if using a non-default auth mode **/

      /**
       * The mode to authenticate with for AWS. Options include: 'AWS': uses ChainableTemporaryCredentials, for deploying to AWS. 'GCP': Uses temporary STS Tokens, for deploying to GCP. 'default': Uses default local AWS profile, for local development.
       * @visibility backend
       */
      authMode?: 'default' | 'AWS' | 'GCP';
      /**
       * The AWS account of the account to proxy/chain from, when app is deployed to GCP.
       * @visibility backend
       */
      proxyAccountId?: string;
      /**
       * The AWS role name in the proxy account, to proxy/chain from, when app is deployed to GCP.
       * @visibility backend
       */
      proxyRoleName?: string;

      /** Optional settings **/

      /**
       * The AWS service used to get recommendations from. Options include: "RightSizing", "ComputeOptimizer" or "All". Default is "Rightsizing".
       * @visibility backend
       */
      recommendationsService?: 'RightSizing' | 'ComputeOptimizer' | 'All';
      /**
       * The name of the AWS bucket in which Compute Optimizer recommendations exist. This is only needed id "ComputeOptimizer" or "All" is configured for the AWS_RECOMMENDATIONS_SERVICE variable.
       * @visibility backend
       */
      computeOptimizerBucket?: string;
    };

    gcp?: {
      /** Variables needed for the Billing Data (Holistic) approach with GCP **/

      /**
       * Use this to configure the application to query Billing Export Data via Google BigQuery. Unset to make this false. Defaults to true.
       * @visibility backend
       */
      useBillingData?: boolean;
      /**
       *The GCP Project ID that your service account exists in that has permission to query Billing Data using BigQuery.
       * @visibility backend
       */
      billingProjectId?: string;
      /**
       *The GCP Project ID that your service account exists in that has permission to query Billing Data using BigQuery.
       * @visibility backend
       */
      billingProjectName?: string;
      /**
       * The name of your BigQuery table configured to consume Billing Export data in the format: PROJECT_ID.DATASET_NAME.TABLE_NAME. Don't forget to replace the colon in the table id if you copy it from BigQuery.
       * @visibility backend
       */
      bigQueryTable?: string;

      /** Variables needed for the Cloud Usage API (Higher Accuracy) approach with GCP **/

      /**
       * This is array of objects with keys "id" and "name" that match the GCP Projects you want to pull usage data from to run energy/carbon estimation for.
       * @visibility backend
       */
      projects?: Array<{
        id: string;
        name: string;
      }>;

      /** Optionally set these GCP variables **/

      /**
       * Setting this to true will change the emissions factors used by the application to take into account Google's Carbon Free Energy percentage in each region. For example in us-central1, the grid emissions factor is 494 gCO2eq/kWh with CFE% of 93%. With this option set to true, the application would instead use 31.78 gCO2eq/kWh.
       * @visibility backend
       */
      useCarbonFreeEnergyPercentage?: boolean;
      /**
       * Use this to configure the average number of vCPUs the application should use to estimate energy consumption of Kubernetes Engine clusters. If unset, defaults to 3, which is the default number of vCPUs provisioned.
       * @visibility backend
       */
      vcpusPerGkeCluster?: number;
      /**
       * Use this to configure the average number of vCPUs the application should use to estimate energy consumption of Cloud Composer Environments. If unset, defaults to 14, which is the number of vCPUs provisioned for a medium sized environment.
       * @visibility backend
       */
      vcpusPerCloudComposerEnvironment?: number;
    };

    azure?: {
      /** Variables needed for the Billing Data (Holistic) approach with Azure **/

      /**
       * Use this to configure the application to query Azure Consumption API. Unset to make this false. Defaults to true.
       * @visibility backend
       */
      useBillingData?: boolean;
      /**
       * The Azure Service Principal ID with permission to read the Consumption API from your Subscriptions.
       * @visibility backend
       */
      clientId?: string;
      /**
       * The Azure Service Principal Secret with permission to read the Consumption API from your Subscriptions.
       * @visibility secret
       */
      clientSecret?: string;
      /**
       * Your Azure tenant ID.
       * @visibility backend
       */
      tenantId?: string;

      /** Optionally set this to "GCP" if your Azure credentials are stored in Google Secrets Manager **/
      /**
       * The authentication mode for Azure. Options are: 'GCP' that gets the secrets from Google Secrets Manager, 'default' which using the client id/secret and tent id from your .env file. Requires GCP_BILLING_PROJECT_NAME to be set if using 'GCP' Mode.
       * @visibility backend
       */
      authMode?: 'GCP' | 'default';
    };

    onPremise?: {
      /**
       * For on-premise servers, provides an average value for cpu utilization.
       * @visibility backend
       */
      cpuUtilizationServer?: number;
      /**
       * For on-premise laptops, provides an average value for cpu utilization.
       * @visibility backend
       */
      cpuUtilizationLaptop?: number;
      /**
       * For on-premise desktops, provides an average value for cpu utilization.
       * @visibility backend
       */
      cpuUtilizationDesktop?: number;
      /**
       * For on-premise servers, provides an average value for average watts.
       * @visibility backend
       */
      avgWattsServer?: number;
      /**
       * For on-premise servers, provides an average value for average watts.
       * @visibility backend
       */
      avgWattsLaptop?: number;
      /**
       * For on-premise desktops, provides an average value for average watts.
       * @visibility backend
       */
      avgWattsDesktop?: number;
    };

    optional?: {
      /**
       * Set with 'GCS' to store cache file in Google Cloud Storage or leave it empty to use the default.
       * @visibility backend
       */
      cacheMode?: 'GCP';
      /**
       * Is the name of you Google Cloud Storage bucket where the cache file will be stored.
       * @visibility backend
       */
      gcsCacheBucketName?: string;
      /**
       * Value to set how the cloud provider queries should return data (e.g. day/week/month/quarter/year). Default to 'day'.
       * @visibility backend
       */
      groupBy: 'day' | 'week' | 'month' | 'quarter' | 'year';
    };
  };
}
