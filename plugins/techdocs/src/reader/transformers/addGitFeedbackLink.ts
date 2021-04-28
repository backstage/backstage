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

import type { Transformer } from './index';
import FeedbackOutlinedIcon from '@material-ui/icons/FeedbackOutlined';
import React from 'react';
import ReactDOM from 'react-dom';

// requires repo
export const addGitFeedbackLink = (configApi: any): Transformer => {
  return dom => {
    // attempting to use selectors that are more likely to be static as MkDocs updates over time
    const sourceAnchor = dom.querySelector(
      '[title="Edit this page"]',
    ) as HTMLAnchorElement;

    // don't show if edit link not available in raw page
    if (!sourceAnchor || !sourceAnchor.href) {
      return dom;
    }
    let gitHost = '';

    const sourceURL = new URL(sourceAnchor.href);
    const githubHosts = configApi
      .getConfigArray('integrations.github')
      .map((integration: any) => integration.data.host);
    const gitlabHosts = configApi
      .getConfigArray('integrations.gitlab')
      .map((integration: any) => integration.data.host);

    // don't show if can't identify edit link hostname as a gitlab/github hosting
    if (
      githubHosts.includes(sourceURL.hostname) ||
      sourceURL.origin.includes('github')
    ) {
      gitHost = 'github';
    } else if (
      gitlabHosts.includes(sourceURL.hostname) ||
      sourceURL.origin.includes('gitlab')
    ) {
      gitHost = 'gitlab';
    } else {
      return dom;
    }

    // topmost h1 only contains title for whole page
    const title = (dom.querySelector('article>h1') as HTMLElement).childNodes[0]
      .textContent;
    const issueTitle = encodeURIComponent(`Documentation Feedback: ${title}`);
    const issueDesc = encodeURIComponent(
      `Page source:\n${sourceAnchor.href}\n\nFeedback:`,
    );
    const repoPath = sourceURL.pathname.split('/').slice(0, 3).join('/');

    const feedbackLink = sourceAnchor.cloneNode() as HTMLAnchorElement;
    switch (gitHost) {
      case 'gitlab':
        feedbackLink.href = `${sourceURL.origin}${repoPath}/issues/new?issue[title]=${issueTitle}&issue[description]=${issueDesc}`;
        break;
      case 'github':
        feedbackLink.href = `${sourceURL.origin}${repoPath}/issues/new?title=${issueTitle}&body=${issueDesc}`;
        break;
      default:
        return dom;
    }
    ReactDOM.render(React.createElement(FeedbackOutlinedIcon), feedbackLink);
    feedbackLink.style.paddingLeft = '5px';
    feedbackLink.title = 'Leave feedback for this page';
    feedbackLink.id = 'git-feedback-link';
    sourceAnchor?.insertAdjacentElement('beforebegin', feedbackLink);
    return dom;
  };
};
