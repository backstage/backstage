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

import { ConfigReader } from '@backstage/config';
import { AwsCodeCommitIntegration } from './AwsCodeCommitIntegration';

const AMAZON_AWS_CODECOMMIT_HOST = 'console.aws.amazon.com';

describe('AwsCodeCommitIntegration', () => {
  it('has a working factory with correct data when entry provided', () => {
    const integrations = AwsCodeCommitIntegration.factory({
      config: new ConfigReader({
        integrations: {
          awsCodeCommit: [
            {
              accessKeyId: 'access key',
              secretAccessKey: ' secret key ',
              roleArn: `role arn`,
              externalId: `external id`,
              region: `region`,
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(1); // including default
    expect(integrations.list()[0].config.host).toBe(
      `region.${AMAZON_AWS_CODECOMMIT_HOST}`,
    );
    expect(integrations.list()[0].config.accessKeyId).toBe('access key');
    expect(integrations.list()[0].config.secretAccessKey).toBe('secret key');
    expect(integrations.list()[0].config.roleArn).toBe(`role arn`);
    expect(integrations.list()[0].config.externalId).toBe(`external id`);
    expect(integrations.list()[0].config.region).toBe(`region`);
  });
  it('does not have a working factory with default values when no data provided', () => {
    const integrations = AwsCodeCommitIntegration.factory({
      config: new ConfigReader({
        integrations: {},
      }),
    });
    expect(integrations.list().length).toBe(0); // including default
  });

  it('returns the basics', () => {
    const integration = new AwsCodeCommitIntegration({ host: 'a.com' } as any);
    expect(integration.type).toBe('awsCodeCommit');
    expect(integration.title).toBe('a.com');
  });

  describe('resolveUrl', () => {
    it('works for valid urls', () => {
      const integration = new AwsCodeCommitIntegration({
        host: 'amazonaws.com',
      } as any);

      expect(
        integration.resolveUrl({
          url: 'https://eu-west-1.console.aws.amazon.com/codesuite/codecommit/repositories/my-repo/browse/refs/heads/main/--/catalog-info.yaml',
          base: 'https://eu-west-1.console.aws.amazon.com/codesuite/codecommit/repositories/my-repo/browse/refs/heads/main/--/catalog-info.yaml',
        }),
      ).toBe(
        'https://eu-west-1.console.aws.amazon.com/codesuite/codecommit/repositories/my-repo/browse/refs/heads/main/--/catalog-info.yaml',
      );
    });
  });

  it('resolve edit URL - with refs', () => {
    const integration = new AwsCodeCommitIntegration({
      host: 'console.aws.amazon.com',
    } as any);

    expect(
      integration.resolveEditUrl(
        'https://eu-west-1.console.aws.amazon.com/codesuite/codecommit/repositories/my-repo/browse/refs/heads/main/--/catalog-info.yaml?region=eu-west-1',
      ),
    ).toBe(
      'https://eu-west-1.console.aws.amazon.com/codesuite/codecommit/repositories/my-repo/files/edit/refs/heads/main/--/catalog-info.yaml?region=eu-west-1',
    );
  });

  it('resolve edit URL - without refs', () => {
    const integration = new AwsCodeCommitIntegration({
      host: 'console.aws.amazon.com',
    } as any);

    expect(
      integration.resolveEditUrl(
        'https://eu-west-1.console.aws.amazon.com/codesuite/codecommit/repositories/my-repo/browse/--/catalog-info.yaml?region=eu-west-1',
      ),
    ).toBe(
      'https://eu-west-1.console.aws.amazon.com/codesuite/codecommit/repositories/my-repo/files/edit/--/catalog-info.yaml?region=eu-west-1',
    );
  });
});
