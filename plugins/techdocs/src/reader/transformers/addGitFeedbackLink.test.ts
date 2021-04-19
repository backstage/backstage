/*
 * Copyright 2021 Spotify AB
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

import { createTestShadowDom } from '../../test-utils';
import { addGitFeedbackLink } from './addGitFeedbackLink';

const configApi = {
  getOptionalString: function getOptionalString(key: string) {
    return key === 'gitlab' ? 'gitlab.com' : 'github.com';
  },
};

describe('addGitFeedbackLink', () => {
  it('adds a feedback link when a Gitlab source edit link is available', () => {
    const shadowDom = createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <article class="md-content__inner">
          <h1>HeaderText</h1>
          <a title="Edit this page" href="https://gitlab.com/reponame/username/docs/TestDoc.md"></>
        </article>
      </html>
    `,
      {
        preTransformers: [addGitFeedbackLink(configApi)],
        postTransformers: [],
      },
    );

    expect(shadowDom.querySelector('#git-feedback-link')).toBeTruthy();
    expect(
      (shadowDom.querySelector('#git-feedback-link') as HTMLLinkElement)!.href,
    ).toEqual(
      'https://gitlab.com/reponame/username/issues/new?issue[title]=Documentation%20Feedback%3A%20HeaderText&issue[description]=Page%20source%3A%0Ahttps%3A%2F%2Fgitlab.com%2Freponame%2Fusername%2Fdocs%2FTestDoc.md%0A%0AFeedback%3A',
    );
  });

  it('adds a feedback link when a Github source edit link is available', () => {
    const shadowDom = createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <article class="md-content__inner">
          <h1>HeaderText</h1>
          <a title="Edit this page" href="https://github.com/reponame/username/docs/TestDoc.md"></>
        </article>
      </html>
    `,
      {
        preTransformers: [addGitFeedbackLink(configApi)],
        postTransformers: [],
      },
    );

    expect(shadowDom.querySelector('#git-feedback-link')).toBeTruthy();
    expect(
      (shadowDom.querySelector('#git-feedback-link') as HTMLLinkElement)!.href,
    ).toEqual(
      'https://github.com/reponame/username/issues/new?title=Documentation%20Feedback%3A%20HeaderText&body=Page%20source%3A%0Ahttps%3A%2F%2Fgithub.com%2Freponame%2Fusername%2Fdocs%2FTestDoc.md%0A%0AFeedback%3A',
    );
  });

  it('does not add a feedback link when no source edit link is available', () => {
    const shadowDom = createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <article class="md-content__inner">
          <h1 id="conveyor-pipelines">Conveyor Pipelines<a class="headerlink" href="http://headerlink.com">¶</a></h1>
        </article>
      </html>
    `,
      {
        preTransformers: [addGitFeedbackLink(configApi)],
        postTransformers: [],
      },
    );

    expect(shadowDom.querySelector('#git-feedback-link')).toBeFalsy();
  });

  it('does not add a feedback link when a Gitlab or Github source edit link is not available', () => {
    const shadowDom = createTestShadowDom(
      `
      <!DOCTYPE html>
      <html>
        <article class="md-content__inner">
          <h1 id="conveyor-pipelines">Conveyor Pipelines<a class="headerlink" href="http://headerlink.com">¶</a></h1>
          <a href="https://not-a-git-provider.com/reponame/username/docs/TestDoc.md"/>
        </article>
      </html>
    `,
      {
        preTransformers: [addGitFeedbackLink(configApi)],
        postTransformers: [],
      },
    );

    expect(shadowDom.querySelector('#git-feedback-link')).toBeFalsy();
  });
});
