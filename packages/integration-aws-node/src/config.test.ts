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

import { Config, ConfigReader } from '@backstage/config';
import { AwsIntegrationConfig, readAwsIntegrationConfig } from './config';

describe('readAwsIntegrationConfig', () => {
  function buildConfig(data: Partial<AwsIntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  it('reads all values', () => {
    const output = readAwsIntegrationConfig(
      buildConfig({
        accounts: [
          {
            accountId: '111111111111',
            accessKeyId: 'ABC',
            secretAccessKey: 'EDF',
            roleName: 'hello',
            partition: 'aws',
            region: 'us-east-1',
            externalId: 'world',
          },
          {
            accountId: '222222222222',
            accessKeyId: 'GHI',
            secretAccessKey: 'JKL',
          },
          {
            accountId: '333333333333',
            roleName: 'hi',
            partition: 'aws-other',
            region: 'not-us-east-1',
            externalId: 'there',
          },
          {
            accountId: '444444444444',
            profile: 'my-profile',
          },
        ],
        accountDefaults: {
          roleName: 'backstage-role',
          partition: 'aws',
          region: 'us-east-1',
          externalId: 'my-id',
        },
        mainAccount: {
          accessKeyId: 'GHI',
          secretAccessKey: 'JKL',
          region: 'ap-northeast-1',
        },
      }),
    );
    expect(output).toEqual({
      accounts: [
        {
          accountId: '111111111111',
          accessKeyId: 'ABC',
          secretAccessKey: 'EDF',
          roleName: 'hello',
          partition: 'aws',
          region: 'us-east-1',
          externalId: 'world',
        },
        {
          accountId: '222222222222',
          accessKeyId: 'GHI',
          secretAccessKey: 'JKL',
        },
        {
          accountId: '333333333333',
          roleName: 'hi',
          partition: 'aws-other',
          region: 'not-us-east-1',
          externalId: 'there',
        },
        {
          accountId: '444444444444',
          profile: 'my-profile',
        },
      ],
      accountDefaults: {
        roleName: 'backstage-role',
        partition: 'aws',
        region: 'us-east-1',
        externalId: 'my-id',
      },
      mainAccount: {
        accessKeyId: 'GHI',
        secretAccessKey: 'JKL',
        region: 'ap-northeast-1',
      },
    });
  });

  it('reads profile for main account', () => {
    const output = readAwsIntegrationConfig(
      buildConfig({
        accounts: [
          {
            accountId: '111111111111',
            accessKeyId: 'ABC',
            secretAccessKey: 'EDF',
            roleName: 'hello',
            partition: 'aws',
            region: 'us-east-1',
            externalId: 'world',
          },
        ],
        accountDefaults: {
          roleName: 'backstage-role',
          partition: 'aws',
          region: 'us-east-1',
          externalId: 'my-id',
        },
        mainAccount: {
          profile: 'my-profile',
        },
      }),
    );
    expect(output).toEqual({
      accounts: [
        {
          accountId: '111111111111',
          accessKeyId: 'ABC',
          secretAccessKey: 'EDF',
          roleName: 'hello',
          partition: 'aws',
          region: 'us-east-1',
          externalId: 'world',
        },
      ],
      accountDefaults: {
        roleName: 'backstage-role',
        partition: 'aws',
        region: 'us-east-1',
        externalId: 'my-id',
      },
      mainAccount: {
        profile: 'my-profile',
      },
    });
  });

  it('does not fail when config is not set', () => {
    const output = readAwsIntegrationConfig(buildConfig({}));
    expect(output).toEqual({
      accountDefaults: {},
      accounts: [],
      mainAccount: {},
    });
  });

  it('rejects invalid combinations of account attributes', () => {
    const validAccount: any = {
      accountId: '111111111111',
      accessKeyId: 'ABC',
      secretAccessKey: 'EDF',
      roleName: 'hello',
      partition: 'aws',
      region: 'us-east-1',
      externalId: 'world',
    };
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          accounts: [
            validAccount,
            {
              accountId: '222222222222',
              accessKeyId: 'ABC',
            },
          ],
        }),
      ),
    ).toThrow(/no secret access key/);
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          accounts: [
            validAccount,
            {
              accountId: '222222222222',
              secretAccessKey: 'ABC',
            },
          ],
        }),
      ),
    ).toThrow(/no access key ID/);
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          accounts: [
            validAccount,
            {
              accountId: '222222222222',
              accessKeyId: 'ABC',
              secretAccessKey: 'DEF',
              profile: 'my-profile',
            },
          ],
        }),
      ),
    ).toThrow(/only one must be specified/);
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          accounts: [
            validAccount,
            {
              accountId: '222222222222',
              roleName: 'my-role',
              profile: 'my-profile',
            },
          ],
        }),
      ),
    ).toThrow(/only one must be specified/);
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          accounts: [
            validAccount,
            {
              accountId: '222222222222',
              partition: 'aws',
            },
          ],
        }),
      ),
    ).toThrow(/no role name/);
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          accounts: [
            validAccount,
            {
              accountId: '222222222222',
              region: 'not-us-east-1',
            },
          ],
        }),
      ),
    ).toThrow(/no role name/);
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          accounts: [
            validAccount,
            {
              accountId: '222222222222',
              externalId: 'hello',
            },
          ],
        }),
      ),
    ).toThrow(/no role name/);
  });

  it('rejects invalid combinations of main account attributes', () => {
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          mainAccount: {
            accessKeyId: 'ABC',
          },
        }),
      ),
    ).toThrow(/no secret access key/);
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          mainAccount: {
            secretAccessKey: 'ABC',
          },
        }),
      ),
    ).toThrow(/no access key ID/);
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          mainAccount: {
            accessKeyId: 'ABC',
            secretAccessKey: 'DEF',
            profile: 'my-profile',
          },
        }),
      ),
    ).toThrow(/only one must be specified/);
  });

  it('rejects invalid combinations of account default attributes', () => {
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          accountDefaults: {
            partition: 'aws',
          },
        }),
      ),
    ).toThrow(/no role name/);
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          accountDefaults: {
            region: 'not-us-east-1',
          },
        }),
      ),
    ).toThrow(/no role name/);
    expect(() =>
      readAwsIntegrationConfig(
        buildConfig({
          accountDefaults: {
            externalId: 'hello',
          },
        }),
      ),
    ).toThrow(/no role name/);
  });
});
