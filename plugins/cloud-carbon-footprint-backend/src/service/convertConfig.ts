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
import { Config as BackstageConfig } from '@backstage/config';
import {
  AWS_RECOMMENDATIONS_SERVICES,
  CCFConfig,
  configLoader,
} from '@cloud-carbon-footprint/common';

export const convertConfig = (appConfig?: BackstageConfig): CCFConfig => {
  const ccfDefaults = configLoader();
  const backstageConfig = appConfig?.getOptionalConfig('cloudCarbonFootprint');
  if (!backstageConfig) {
    return ccfDefaults;
  }
  const gcpConfig = backstageConfig.getOptionalConfig('gcp');
  const awsConfig = backstageConfig.getOptionalConfig('aws');
  const azureConfig = backstageConfig.getOptionalConfig('azure');
  const onPremiseConfig = backstageConfig.getOptionalConfig('onPremise');
  const optionalConfig = backstageConfig.getOptionalConfig('optional');

  return {
    ...ccfDefaults,
    GCP: !gcpConfig
      ? ccfDefaults.GCP
      : {
          ...ccfDefaults.GCP,
          USE_BILLING_DATA:
            gcpConfig.getOptionalBoolean('useBillingData') ??
            ccfDefaults.GCP!.USE_BILLING_DATA,
          BILLING_PROJECT_ID:
            gcpConfig.getOptionalString('billingProjectId') ??
            ccfDefaults.GCP!.BILLING_PROJECT_ID,
          BILLING_PROJECT_NAME:
            gcpConfig.getOptionalString('billingProjectName') ??
            ccfDefaults.GCP!.BILLING_PROJECT_NAME,
          BIG_QUERY_TABLE:
            gcpConfig.getOptionalString('bigQueryTable') ??
            ccfDefaults.GCP!.BIG_QUERY_TABLE,
          projects:
            gcpConfig.getOptional<{ id: string; name: string }[]>('projects') ??
            ccfDefaults.GCP!.projects,
          USE_CARBON_FREE_ENERGY_PERCENTAGE:
            gcpConfig.getOptionalBoolean('useCarbonFreeEnergyPercentage') ??
            ccfDefaults.GCP!.USE_CARBON_FREE_ENERGY_PERCENTAGE,
          VCPUS_PER_GKE_CLUSTER:
            gcpConfig.getOptionalNumber('vcpusPerGkeCluster') ??
            ccfDefaults.GCP!.VCPUS_PER_GKE_CLUSTER,
          VCPUS_PER_CLOUD_COMPOSER_ENVIRONMENT:
            gcpConfig.getOptionalNumber('vcpusPerCloudComposerEnvironment') ??
            ccfDefaults.GCP!.VCPUS_PER_CLOUD_COMPOSER_ENVIRONMENT,
          CACHE_BUCKET_NAME:
            optionalConfig?.getOptionalString('gcsCacheBucketName') ??
            ccfDefaults.GCP!.CACHE_BUCKET_NAME,
        },
    AWS:
      awsConfig === undefined
        ? ccfDefaults.AWS
        : {
            ...ccfDefaults.AWS,
            USE_BILLING_DATA:
              awsConfig.getOptionalBoolean('useBillingData') ??
              ccfDefaults.AWS!.USE_BILLING_DATA,
            BILLING_ACCOUNT_ID:
              awsConfig.getOptionalString('billingAccountId') ??
              ccfDefaults.AWS!.BILLING_ACCOUNT_ID,
            BILLING_ACCOUNT_NAME:
              awsConfig.getOptionalString('billingAccountName') ??
              ccfDefaults.AWS!.BILLING_ACCOUNT_NAME,
            ATHENA_DB_NAME:
              awsConfig.getOptionalString('athenaDbName') ??
              ccfDefaults.AWS!.ATHENA_DB_NAME,
            ATHENA_DB_TABLE:
              awsConfig.getOptionalString('athenaDbTable') ??
              ccfDefaults.AWS!.ATHENA_DB_TABLE,
            ATHENA_REGION:
              awsConfig.getOptionalString('athenaRegion') ??
              ccfDefaults.AWS!.ATHENA_REGION,
            ATHENA_QUERY_RESULT_LOCATION:
              awsConfig.getOptionalString('athenaQueryResultLocation') ??
              ccfDefaults.AWS!.ATHENA_QUERY_RESULT_LOCATION,
            accounts:
              awsConfig.getOptional<{ id: string; name: string }[]>(
                'accounts',
              ) ?? ccfDefaults.AWS!.accounts,
            authentication: {
              mode:
                awsConfig.getOptionalString('authMode') ??
                ccfDefaults.AWS!.authentication!.mode,
              options: {
                targetRoleName:
                  awsConfig.getOptionalString('targetAccountRoleName') ??
                  ccfDefaults.AWS!.authentication!.options!.targetRoleName,
                proxyAccountId:
                  awsConfig.getOptionalString('proxyAccountId') ??
                  ccfDefaults.AWS!.authentication!.options!.proxyAccountId,
                proxyRoleName:
                  awsConfig.getOptionalString('proxyRoleName') ??
                  ccfDefaults.AWS!.authentication!.options!.proxyRoleName,
              },
            },
            RECOMMENDATIONS_SERVICE:
              (awsConfig.getOptionalString(
                'recommendationsService',
              ) as AWS_RECOMMENDATIONS_SERVICES) ??
              ccfDefaults.AWS!.RECOMMENDATIONS_SERVICE,
            COMPUTE_OPTIMIZER_BUCKET:
              awsConfig.getOptionalString('computeOptimizerBucket') ??
              ccfDefaults.AWS!.COMPUTE_OPTIMIZER_BUCKET,
          },
    AZURE:
      azureConfig === undefined
        ? ccfDefaults.AZURE
        : {
            ...ccfDefaults.AZURE,
            USE_BILLING_DATA:
              azureConfig.getOptionalBoolean('useBillingData') ??
              ccfDefaults.AZURE!.USE_BILLING_DATA,
            authentication: {
              mode:
                azureConfig.getOptionalString('authMode') ??
                ccfDefaults.AZURE!.authentication!.mode,
              clientId:
                azureConfig.getOptionalString('clientId') ??
                ccfDefaults.AZURE!.authentication!.clientId,
              clientSecret:
                azureConfig.getOptionalString('clientSecret') ??
                ccfDefaults.AZURE!.authentication!.clientSecret,
              tenantId:
                azureConfig.getOptionalString('tenantId') ??
                ccfDefaults.AZURE!.authentication!.tenantId,
            },
          },
    ON_PREMISE:
      onPremiseConfig === undefined
        ? ccfDefaults.ON_PREMISE
        : {
            ...ccfDefaults.ON_PREMISE,
            SERVER: {
              CPU_UTILIZATION:
                onPremiseConfig.getOptionalNumber('cpuUtilizationServer') ??
                ccfDefaults.ON_PREMISE!.SERVER!.CPU_UTILIZATION,
              AVERAGE_WATTS:
                onPremiseConfig.getOptionalNumber('avgWattsServer') ??
                ccfDefaults.ON_PREMISE!.SERVER!.AVERAGE_WATTS,
            },
            LAPTOP: {
              CPU_UTILIZATION:
                onPremiseConfig.getOptionalNumber('cpuUtilizationLaptop') ??
                ccfDefaults.ON_PREMISE!.LAPTOP!.CPU_UTILIZATION,
              AVERAGE_WATTS:
                onPremiseConfig.getOptionalNumber('avgWattsLaptop') ??
                ccfDefaults.ON_PREMISE!.LAPTOP!.AVERAGE_WATTS,
            },
            DESKTOP: {
              CPU_UTILIZATION:
                onPremiseConfig.getOptionalNumber('cpuUtilizationDesktop') ??
                ccfDefaults.ON_PREMISE!.DESKTOP!.CPU_UTILIZATION,
              AVERAGE_WATTS:
                onPremiseConfig.getOptionalNumber('avgWattsDesktop') ??
                ccfDefaults.ON_PREMISE!.DESKTOP!.AVERAGE_WATTS,
            },
          },
    CACHE_MODE:
      optionalConfig?.getOptionalString('cacheMode') ?? ccfDefaults.CACHE_MODE,
  };
};
