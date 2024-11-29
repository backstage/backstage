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

import parseGitUrl from 'git-url-parse';

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import {
  replaceGithubUrlType,
  replaceGitLabUrlType,
} from '@backstage/integration';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import {
  useShadowRootElements,
  useShadowRootSelection,
} from '@backstage/plugin-techdocs-react';

import { PAGE_EDIT_LINK_SELECTOR } from './constants';

const resolveBlobUrl = (url: string, type: string) => {
  if (type === 'github') {
    return replaceGithubUrlType(url, 'blob');
  } else if (type === 'gitlab') {
    return replaceGitLabUrlType(url, 'blob');
  }
  // eslint-disable-next-line no-console
  console.error(
    `Invalid SCM type ${type} found in ReportIssue addon for URL ${url}!`,
  );
  return url;
};

export const getTitle = (selection: Selection) => {
  const text = selection.toString().substring(0, 70);
  const ellipsis = text.length === 70 ? '...' : '';
  return `Documentation feedback: ${text}${ellipsis}`;
};

export const getBody = (
  selection: Selection,
  markdownUrl: string,
  appTitle: string,
) => {
  const title = '## Documentation Feedback 📝';
  const subheading = '#### The highlighted text:';
  const commentHeading = '#### The comment on the text:';
  const commentPlaceholder = '_>replace this line with your comment<_';
  const highlightedTextAsQuote = selection
    .toString()
    .trim()
    .split('\n')
    .map(line => `> ${line.trim()}`)
    .join('\n');

  const facts = [
    `${appTitle} URL: <${window.location.href}> \nMarkdown URL: <${markdownUrl}>`,
  ];

  return `${title}\n\n ${subheading} \n\n ${highlightedTextAsQuote}\n\n ${commentHeading} \n ${commentPlaceholder}\n\n ___\n${facts}`;
};

export const useGitTemplate = (debounceTime?: number) => {
  const initialTemplate = { title: '', body: '' };
  const selection = useShadowRootSelection(debounceTime);
  const [editLink] = useShadowRootElements([PAGE_EDIT_LINK_SELECTOR]);
  const url = (editLink as HTMLAnchorElement)?.href ?? '';
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptionalString('app.title') || 'Backstage';
  if (!selection || !url) return initialTemplate;

  const type = scmIntegrationsApi.byUrl(url)?.type;

  if (!type) return initialTemplate;

  return {
    title: getTitle(selection),
    body: getBody(selection, resolveBlobUrl(url, type), appTitle),
  };
};

export const useGitRepository = () => {
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);

  const [editLink] = useShadowRootElements([PAGE_EDIT_LINK_SELECTOR]);
  const url = (editLink as HTMLAnchorElement)?.href ?? '';

  if (!url) return null;

  const type = scmIntegrationsApi.byUrl(url)?.type;

  if (!type) return null;

  return { ...parseGitUrl(resolveBlobUrl(url, type)), type };
};
