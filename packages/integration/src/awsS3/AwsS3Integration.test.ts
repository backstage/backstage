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
import { AwsS3Integration } from './AwsS3Integration';

describe('AwsS3Integration', () => {
  it('has a working factory', () => {
    const integrations = AwsS3Integration.factory({
      config: new ConfigReader({
        integrations: {
          awsS3: [
            {
              host: 'a.com',
              accessKeyId: 'access key',
              secretAccessKey: 'secret key',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(2); // including default
    expect(integrations.list()[0].config.host).toBe('a.com');
    expect(integrations.list()[1].config.host).toBe('.amazonaws.com');
  });

  it('returns the basics', () => {
    const integration = new AwsS3Integration({ host: 'a.com' } as any);
    expect(integration.type).toBe('awsS3');
    expect(integration.title).toBe('a.com');
  });

  describe('resolveUrl', () => {
    it('works for valid urls', () => {
      const integration = new AwsS3Integration({
        host: 'amazonaws.com',
      } as any);

      expect(
        integration.resolveUrl({
          url: 'https://mytest.s3.us-east-2.amazonaws.com/catalog-info.yaml',
          base: 'https://mytest.s3.us-east-2.amazonaws.com/catalog-info.yaml',
        }),
      ).toBe('https://mytest.s3.us-east-2.amazonaws.com/catalog-info.yaml');
    });
  });

  it('resolve edit URL', () => {
    const integration = new AwsS3Integration({ host: 'a.com' } as any);

    // TODO: The Aws S3 integration doesn't support resolving an edit URL,
    // instead we keep the input URL.
    expect(
      integration.resolveEditUrl(
        'https://mytest.s3.us-east-2.amazonaws.com/catalog-info.yaml',
      ),
    ).toBe('https://mytest.s3.us-east-2.amazonaws.com/catalog-info.yaml');
  });
});
