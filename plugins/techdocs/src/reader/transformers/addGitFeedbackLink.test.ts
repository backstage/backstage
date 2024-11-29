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

import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createTestShadowDom } from '../../test-utils';
import { addGitFeedbackLink } from './addGitFeedbackLink';

const integrations = ScmIntegrations.fromConfig(
  new ConfigReader({
    integrations: {
      github: [{ host: 'self-hosted-git-hub-provider.com' }],
    },
  }),
);

describe('addGitFeedbackLink', () => {
  it('adds a feedback link when a Gitlab source edit link is available', async () => {
    const shadowDom = await createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <article class="md-content__inner">
          <h1>HeaderText</h1>
          <a title="Edit this page" href="https://gitlab.com/groupname/reponame/-/blob/master/docs/docname.md"></>
        </article>
      </html>
    `,
      {
        preTransformers: [addGitFeedbackLink(integrations)],
        postTransformers: [],
      },
    );

    expect(shadowDom.querySelector('#git-feedback-link')).toBeTruthy();
    expect(
      (shadowDom.querySelector('#git-feedback-link') as HTMLLinkElement)!.href,
    ).toEqual(
      'https://gitlab.com/groupname/reponame/issues/new?issue[title]=Documentation%20Feedback%3A%20HeaderText&issue[description]=Page%20source%3A%0Ahttps%3A%2F%2Fgitlab.com%2Fgroupname%2Freponame%2F-%2Fblob%2Fmaster%2Fdocs%2Fdocname.md%0A%0AFeedback%3A',
    );
  });

  it('adds a feedback link correctly when a Gitlab source edit link is available and contains a subgroup', async () => {
    const shadowDom = await createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <article class="md-content__inner">
          <h1>HeaderText</h1>
          <a title="Edit this page" href="https://gitlab.com/groupname/subgroupname/reponame/-/blob/master/docs/docname.md"></>
        </article>
      </html>
    `,
      {
        preTransformers: [addGitFeedbackLink(integrations)],
        postTransformers: [],
      },
    );

    expect(shadowDom.querySelector('#git-feedback-link')).toBeTruthy();
    expect(
      (shadowDom.querySelector('#git-feedback-link') as HTMLLinkElement)!.href,
    ).toEqual(
      'https://gitlab.com/groupname/subgroupname/reponame/issues/new?issue[title]=Documentation%20Feedback%3A%20HeaderText&issue[description]=Page%20source%3A%0Ahttps%3A%2F%2Fgitlab.com%2Fgroupname%2Fsubgroupname%2Freponame%2F-%2Fblob%2Fmaster%2Fdocs%2Fdocname.md%0A%0AFeedback%3A',
    );
  });

  it('adds a feedback link when a Github source edit link is available', async () => {
    const shadowDom = await createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <article class="md-content__inner">
          <h1>HeaderText</h1>
          <a title="Edit this page" href="https://github.com/groupname/reponame/edit/master/docs/docname.md"></>
        </article>
      </html>
    `,
      {
        preTransformers: [addGitFeedbackLink(integrations)],
        postTransformers: [],
      },
    );

    expect(shadowDom.querySelector('#git-feedback-link')).toBeTruthy();
    expect(
      (shadowDom.querySelector('#git-feedback-link') as HTMLLinkElement)!.href,
    ).toEqual(
      'https://github.com/groupname/reponame/issues/new?title=Documentation%20Feedback%3A%20HeaderText&body=Page%20source%3A%0Ahttps%3A%2F%2Fgithub.com%2Fgroupname%2Freponame%2Fedit%2Fmaster%2Fdocs%2Fdocname.md%0A%0AFeedback%3A',
    );
  });

  it('does not add a feedback link when no source edit link is available', async () => {
    const shadowDom = await createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <article class="md-content__inner">
          <h1>HeaderText<a class="headerlink" href="http://headerlink.com">¶</a></h1>
        </article>
      </html>
    `,
      {
        preTransformers: [addGitFeedbackLink(integrations)],
        postTransformers: [],
      },
    );

    expect(shadowDom.querySelector('#git-feedback-link')).toBeFalsy();
  });

  it('does not add a feedback link when a Gitlab or Github source edit link is not available', async () => {
    const shadowDom = await createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <article class="md-content__inner">
          <h1>HeaderText<a class="headerlink" href="http://headerlink.com">¶</a></h1>
          <a title="Edit this page" href="https://not-a-git-provider.com/reponame/username/docs/TestDoc.md"/>
        </article>
      </html>
    `,
      {
        preTransformers: [addGitFeedbackLink(integrations)],
        postTransformers: [],
      },
    );

    expect(shadowDom.querySelector('#git-feedback-link')).toBeFalsy();
  });

  it('adds a feedback link when a Gitlab or Github source edit link is not available but hostname matches an integrations host', async () => {
    const shadowDom = await createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <article class="md-content__inner">
          <h1>HeaderText<a class="headerlink" href="http://headerlink.com">¶</a></h1>
          <a title="Edit this page" href="https://self-hosted-git-hub-provider.com/groupname/reponame/blob/master/docs/docname.md"/>
        </article>
      </html>
    `,
      {
        preTransformers: [addGitFeedbackLink(integrations)],
        postTransformers: [],
      },
    );

    expect(shadowDom.querySelector('#git-feedback-link')).toBeTruthy();
    expect(
      (shadowDom.querySelector('#git-feedback-link') as HTMLLinkElement)!.href,
    ).toEqual(
      'https://self-hosted-git-hub-provider.com/groupname/reponame/issues/new?title=Documentation%20Feedback%3A%20HeaderText&body=Page%20source%3A%0Ahttps%3A%2F%2Fself-hosted-git-hub-provider.com%2Fgroupname%2Freponame%2Fblob%2Fmaster%2Fdocs%2Fdocname.md%0A%0AFeedback%3A',
    );
  });
});
