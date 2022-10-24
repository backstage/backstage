/*
 * Copyright 2021 The Backstage Authors
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
import { AwsS3IntegrationConfig } from './awsS3';
import { AwsS3Integration } from './awsS3/AwsS3Integration';
import { AzureIntegrationConfig } from './azure';
import { AzureIntegration } from './azure/AzureIntegration';
import {
  BitbucketCloudIntegration,
  BitbucketCloudIntegrationConfig,
} from './bitbucketCloud';
import { BitbucketIntegrationConfig } from './bitbucket';
import { BitbucketIntegration } from './bitbucket/BitbucketIntegration';
import {
  BitbucketServerIntegration,
  BitbucketServerIntegrationConfig,
} from './bitbucketServer';
import { GerritIntegrationConfig } from './gerrit';
import { GerritIntegration } from './gerrit/GerritIntegration';
import { GithubIntegrationConfig } from './github';
import { GithubIntegration } from './github/GithubIntegration';
import { GitLabIntegrationConfig } from './gitlab';
import { GitLabIntegration } from './gitlab/GitLabIntegration';
import { basicIntegrations } from './helpers';
import { ScmIntegrations } from './ScmIntegrations';
import { GiteaIntegration, GiteaIntegrationConfig } from './gitea';

describe('ScmIntegrations', () => {
  const awsS3 = new AwsS3Integration({
    host: 'awss3.local',
  } as AwsS3IntegrationConfig);

  const azure = new AzureIntegration({
    host: 'azure.local',
  } as AzureIntegrationConfig);

  const bitbucket = new BitbucketIntegration({
    host: 'bitbucket.local',
  } as BitbucketIntegrationConfig);

  const bitbucketCloud = new BitbucketCloudIntegration({
    host: 'bitbucket.org',
  } as BitbucketCloudIntegrationConfig);

  const bitbucketServer = new BitbucketServerIntegration({
    host: 'bitbucket-server.local',
  } as BitbucketServerIntegrationConfig);

  const gerrit = new GerritIntegration({
    host: 'gerrit.local',
  } as GerritIntegrationConfig);

  const github = new GithubIntegration({
    host: 'github.local',
  } as GithubIntegrationConfig);

  const gitlab = new GitLabIntegration({
    host: 'gitlab.local',
  } as GitLabIntegrationConfig);

  const gitea = new GiteaIntegration({
    host: 'gitea.local',
  } as GiteaIntegrationConfig);

  const i = new ScmIntegrations({
    awsS3: basicIntegrations([awsS3], item => item.config.host),
    azure: basicIntegrations([azure], item => item.config.host),
    bitbucket: basicIntegrations([bitbucket], item => item.config.host),
    bitbucketCloud: basicIntegrations([bitbucketCloud], item => item.title),
    bitbucketServer: basicIntegrations(
      [bitbucketServer],
      item => item.config.host,
    ),
    gerrit: basicIntegrations([gerrit], item => item.config.host),
    github: basicIntegrations([github], item => item.config.host),
    gitlab: basicIntegrations([gitlab], item => item.config.host),
    gitea: basicIntegrations([gitea], item => item.config.host),
  });

  it('can get the specifics', () => {
    expect(i.awsS3.byUrl('https://awss3.local')).toBe(awsS3);
    expect(i.azure.byUrl('https://azure.local')).toBe(azure);
    expect(i.bitbucket.byUrl('https://bitbucket.local')).toBe(bitbucket);
    expect(i.bitbucketCloud.byUrl('https://bitbucket.org')).toBe(
      bitbucketCloud,
    );
    expect(i.bitbucketServer.byUrl('https://bitbucket-server.local')).toBe(
      bitbucketServer,
    );
    expect(i.gerrit.byUrl('https://gerrit.local')).toBe(gerrit);
    expect(i.github.byUrl('https://github.local')).toBe(github);
    expect(i.gitlab.byUrl('https://gitlab.local')).toBe(gitlab);
    expect(i.gitea.byUrl('https://gitea.local')).toBe(gitea);
  });

  it('can list', () => {
    expect(i.list()).toEqual(
      expect.arrayContaining([
        awsS3,
        azure,
        bitbucket,
        bitbucketCloud,
        bitbucketServer,
        gerrit,
        github,
        gitlab,
        gitea,
      ]),
    );
  });

  it('can select by url and host', () => {
    expect(i.byUrl('https://awss3.local')).toBe(awsS3);
    expect(i.byUrl('https://azure.local')).toBe(azure);
    expect(i.byUrl('https://bitbucket.local')).toBe(bitbucket);
    expect(i.byUrl('https://bitbucket.org')).toBe(bitbucketCloud);
    expect(i.byUrl('https://bitbucket-server.local')).toBe(bitbucketServer);
    expect(i.byUrl('https://gerrit.local')).toBe(gerrit);
    expect(i.byUrl('https://github.local')).toBe(github);
    expect(i.byUrl('https://gitlab.local')).toBe(gitlab);
    expect(i.byUrl('https://gitea.local')).toBe(gitea);

    expect(i.byHost('awss3.local')).toBe(awsS3);
    expect(i.byHost('azure.local')).toBe(azure);
    expect(i.byHost('bitbucket.local')).toBe(bitbucket);
    expect(i.byHost('bitbucket.org')).toBe(bitbucketCloud);
    expect(i.byHost('bitbucket-server.local')).toBe(bitbucketServer);
    expect(i.byHost('gerrit.local')).toBe(gerrit);
    expect(i.byHost('github.local')).toBe(github);
    expect(i.byHost('gitlab.local')).toBe(gitlab);
    expect(i.byHost('gitea.local')).toBe(gitea);
  });

  it('can resolveUrl using fallback', () => {
    expect(
      i.resolveUrl({
        url: '../b.yaml',
        base: 'https://no-matching-integration.com/x/a.yaml',
      }),
    ).toBe('https://no-matching-integration.com/b.yaml');
    expect(
      i.resolveUrl({
        url: 'https://absolute.com/path',
        base: 'https://no-matching-integration.com/x/a.yaml',
      }),
    ).toBe('https://absolute.com/path');
  });

  it('can resolveEditUrl using fallback', () => {
    expect(i.resolveEditUrl('http://example.com/x/a.yaml')).toBe(
      'http://example.com/x/a.yaml',
    );
  });
});
