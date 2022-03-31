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
import { convertConfig } from './convertConfig';
import { ConfigReader } from '@backstage/config';
import { configLoader } from '@cloud-carbon-footprint/common';
import { Config as ConfigSchema } from '../../config';

type JsonObject = { [k: string]: any };
const ccfDefaults = configLoader();

describe('ConvertConfig', () => {
  it('returns defaults when no CCF config is given', () => {
    // in these cases, the server will start but requests to CCF backend plugin will return no data

    expect(convertConfig(new ConfigReader({}))).toEqual(ccfDefaults);

    expect(
      convertConfig(
        new ConfigReader({
          cloudCarbonFootprint: {},
        }),
      ),
    ).toEqual(ccfDefaults);

    expect(
      convertConfig(
        new ConfigReader({
          cloudCarbonFootprint: { gcp: {}, aws: {}, azure: {} },
        }),
      ),
    ).toEqual(ccfDefaults);
  });

  it('sets config for Billing Data (Holistic) approach with GCP', () => {
    const config: ConfigSchema = {
      cloudCarbonFootprint: {
        gcp: {
          useBillingData: true,
          billingProjectId: 'project-id',
          billingProjectName: 'cool, low-emission project',
          bigQueryTable: 'big_dataset.big_table',
        },
      },
    };
    expect(
      convertConfig(new ConfigReader(config as unknown as JsonObject)),
    ).toEqual({
      ...ccfDefaults,
      GCP: {
        ...ccfDefaults.GCP,
        USE_BILLING_DATA: true,
        BILLING_PROJECT_ID: 'project-id',
        BILLING_PROJECT_NAME: 'cool, low-emission project',
        BIG_QUERY_TABLE: 'big_dataset.big_table',
      },
    });
  });

  it('sets config for Billing Data (Holistic) approach with AWS', () => {
    const config: ConfigSchema = {
      cloudCarbonFootprint: {
        aws: {
          useBillingData: true,
          athenaDbName: 'athena-db',
          athenaDbTable: 'billing export table',
          athenaRegion: 'us-east-1',
          athenaQueryResultLocation: 's3://bucket',
          billingAccountId: 'cool-account',
          billingAccountName: 'Cool account, low emissions',
        },
      },
    };
    expect(
      convertConfig(new ConfigReader(config as unknown as JsonObject)),
    ).toEqual({
      ...ccfDefaults,
      AWS: {
        ...ccfDefaults.AWS,
        USE_BILLING_DATA: true,
        ATHENA_DB_NAME: 'athena-db',
        ATHENA_DB_TABLE: 'billing export table',
        ATHENA_QUERY_RESULT_LOCATION: 's3://bucket',
        ATHENA_REGION: 'us-east-1',
        BILLING_ACCOUNT_ID: 'cool-account',
        BILLING_ACCOUNT_NAME: 'Cool account, low emissions',
      },
    });
  });

  it('sets config for AWS with auth mode', () => {
    const config: ConfigSchema = {
      cloudCarbonFootprint: {
        aws: {
          targetAccountRoleName: 'target role',
          authMode: 'GCP',
          proxyAccountId: 'proxy account',
          proxyRoleName: 'proxy role',
        },
      },
    };
    expect(
      convertConfig(new ConfigReader(config as unknown as JsonObject)),
    ).toEqual({
      ...ccfDefaults,
      AWS: {
        ...ccfDefaults.AWS,
        authentication: {
          mode: 'GCP',
          options: {
            targetRoleName: 'target role',
            proxyAccountId: 'proxy account',
            proxyRoleName: 'proxy role',
          },
        },
      },
    });
  });

  it('sets config for Billing Data (Holistic) approach with Azure', () => {
    const config: ConfigSchema = {
      cloudCarbonFootprint: {
        azure: {
          useBillingData: true,
          clientId: 'client id',
          clientSecret: 'shhh',
          tenantId: 'tenant id',
          authMode: 'GCP',
        },
      },
    };
    expect(
      convertConfig(new ConfigReader(config as unknown as JsonObject)),
    ).toEqual({
      ...ccfDefaults,
      AZURE: {
        ...ccfDefaults.AZURE,
        USE_BILLING_DATA: true,
        authentication: {
          mode: 'GCP',
          clientId: 'client id',
          clientSecret: 'shhh',
          tenantId: 'tenant id',
        },
      },
    });
  });
});
