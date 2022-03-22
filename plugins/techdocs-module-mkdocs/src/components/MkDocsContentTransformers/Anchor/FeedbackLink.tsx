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

import React from 'react';
import parseGitUrl from 'git-url-parse';
import { Portal } from '@material-ui/core';
import FeedbackOutlinedIcon from '@material-ui/icons/FeedbackOutlined';
import { useTechDocsShadowDom } from '@backstage/plugin-techdocs';
import { useApi } from '@backstage/core-plugin-api';
import { replaceGitHubUrlType } from '@backstage/integration';
import { scmIntegrationsApiRef } from '@backstage/integration-react';

const H1_SELECTOR = 'article > h1';
const EDIT_LINK_SELECTOR = '[title="Edit this page"]';

export const FeedbackLink = () => {
  const dom = useTechDocsShadowDom();
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);

  const editLink = dom.querySelector<HTMLAnchorElement>(EDIT_LINK_SELECTOR);

  // don't show if edit link not available in raw page
  if (!dom || !editLink) return null;

  const url = new URL(editLink.href);
  const integration = scmIntegrationsApi.byUrl(url);
  const type = integration?.type;

  // don't show if can't identify edit link hostname as a gitlab/github hosting
  if (type !== 'github' && type !== 'gitlab') {
    return null;
  }

  // topmost h1 only contains title for whole page
  const h1 = dom.querySelector<HTMLElement>(H1_SELECTOR);
  const title = encodeURIComponent(
    `Documentation Feedback: ${h1?.childNodes[0].textContent}`,
  );
  const body = encodeURIComponent(
    `Page source:\n${editLink.href}\n\nFeedback:`,
  );

  const gitInfo = parseGitUrl(
    // Convert GitHub edit url to blob type so it can be parsed by git-url-parse correctly
    type === 'github' ? replaceGitHubUrlType(url.href, 'blob') : url.href,
  );
  const repoPath = `/${gitInfo.organization}/${gitInfo.name}`;

  const params =
    type === 'github'
      ? `title=${title}&body=${body}`
      : `issue[title]=${title}&issue[description]=${body}`;

  const href = `${url.origin}${repoPath}/issues/new?${params}`;

  let container = dom.querySelector('#git-feedback-link');

  if (!container) {
    container = document.createElement('div');
    container?.setAttribute('id', 'git-feedback-link');
    editLink.insertAdjacentElement('beforebegin', container);
  }

  return (
    <Portal container={container}>
      <a
        className="md-content__button md-icon"
        title="Leave feedback for this page"
        target="_blank"
        href={href}
        style={{ paddingLeft: '5px' }}
      >
        <FeedbackOutlinedIcon />
      </a>
    </Portal>
  );
};
