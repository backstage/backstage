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

import { Link, GitHubIcon } from '@backstage/core-components';

import { ReportIssueTemplate, Repository } from './types';

type IssueLinkProps = {
  template: ReportIssueTemplate;
  repository: Repository;
};

const BugIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2l1.88 1.88" />
    <path d="M14.12 3.88L16 2" />
    <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
    <path d="M12 20v-9" />
    <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
    <path d="M6 13H2" />
    <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
    <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
    <path d="M22 13h-4" />
    <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
  </svg>
);

const getIcon = ({ type }: Repository) => {
  if (type === 'github') {
    return GitHubIcon;
  }
  return BugIcon;
};

const getName = ({ type }: Repository) => {
  return type.charAt(0).toLocaleUpperCase('en-US') + type.slice(1);
};

const getUrl = (repository: Repository, template: ReportIssueTemplate) => {
  const { title, body } = template;
  const encodedTitle = encodeURIComponent(title);
  const encodedBody = encodeURIComponent(body);
  const { protocol, resource, owner, name, type } = repository;

  const url = `${protocol}://${resource}/${owner}/${name}`;
  const encodedUrl = encodeURI(url);
  if (type === 'github') {
    return `${encodedUrl}/issues/new?title=${encodedTitle}&body=${encodedBody}`;
  }
  return `${encodedUrl}/issues/new?issue[title]=${encodedTitle}&issue[description]=${encodedBody}`;
};

export const IssueLink = ({ template, repository }: IssueLinkProps) => {
  const Icon = getIcon(repository);
  const url = getUrl(repository, template);

  return (
    <Link
      to={url}
      target="_blank"
      style={{
        display: 'inline-grid',
        gridAutoFlow: 'column',
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--foreground, #000)',
        fontSize: '0.8125rem',
        fontWeight: 500,
        textDecoration: 'none',
      }}
    >
      <Icon /> Open new {getName(repository)} issue
    </Link>
  );
};
