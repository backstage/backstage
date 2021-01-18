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
import { Publishers } from './publishers';
import { GithubPublisher } from './github';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { AzurePublisher } from './azure';
import { GitlabPublisher } from './gitlab';
import { BitbucketPublisher } from './bitbucket';

jest.mock('@octokit/rest');

describe('Publishers', () => {
  it('should throw an error when the publisher for the source location is not registered', () => {
    const publishers = new Publishers();

    expect(() =>
      publishers.get('https://github.com/org/repo', {
        logger: getVoidLogger(),
      }),
    ).toThrow(
      expect.objectContaining({
        message:
          'No matching publisher detected for "https://github.com/org/repo". Please make sure this host is registered in the integration config',
      }),
    );
  });

  it('should return the correct preparer when the source matches for github', async () => {
    const publishers = await Publishers.fromConfig(new ConfigReader({}), {
      logger: getVoidLogger(),
    });

    expect(
      publishers.get('https://github.com/org/repo', {
        logger: getVoidLogger(),
      }),
    ).toBeInstanceOf(GithubPublisher);
  });

  it('should return the correct preparer when the source matches for azure', async () => {
    const publishers = await Publishers.fromConfig(new ConfigReader({}), {
      logger: getVoidLogger(),
    });

    expect(
      publishers.get('https://dev.azure.com/org/project/_git/repo', {
        logger: getVoidLogger(),
      }),
    ).toBeInstanceOf(AzurePublisher);
  });

  it('should return the correct preparer when the source matches for bitbucket', async () => {
    const publishers = await Publishers.fromConfig(new ConfigReader({}), {
      logger: getVoidLogger(),
    });

    expect(
      publishers.get('https://bitbucket.org/owner/repo', {
        logger: getVoidLogger(),
      }),
    ).toBeInstanceOf(BitbucketPublisher);
  });

  it('should return the correct preparer when the source matches for gitlab', async () => {
    const publishers = await Publishers.fromConfig(new ConfigReader({}), {
      logger: getVoidLogger(),
    });

    expect(
      publishers.get('https://gitlab.com/owner/repo', {
        logger: getVoidLogger(),
      }),
    ).toBeInstanceOf(GitlabPublisher);
  });

  it('should respect registrations for custom URLs for providers using the integrations config', async () => {
    const publishers = await Publishers.fromConfig(
      new ConfigReader({
        integrations: {
          github: [
            { host: 'my.special.github.enterprise.thing', token: 'lolghe' },
          ],
        },
      }),
      {
        logger: getVoidLogger(),
      },
    );

    expect(
      publishers.get('https://my.special.github.enterprise.thing/org/repo', {
        logger: getVoidLogger(),
      }),
    ).toBeInstanceOf(GithubPublisher);
  });
});
