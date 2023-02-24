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
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { analyticsApiRef } from '@backstage/core-plugin-api';
import {
  MockAnalyticsApi,
  TestApiProvider,
  wrapInTestApp,
} from '@backstage/test-utils';

import { IssueLink } from './IssueLink';

const defaultGithubProps = {
  repository: {
    type: 'github',
    name: 'backstage',
    owner: 'backstage',
    protocol: 'https',
    resource: 'github.com',
  },
  template: {
    title: 'Documentation feedback',
    body: '## Documentation Feedback 📝',
  },
};

const defaultGitlabProps = {
  repository: {
    type: 'gitlab',
    name: 'backstageSubgroup/backstage',
    owner: 'backstage',
    protocol: 'https',
    resource: 'gitlab.com',
  },
  template: {
    title: 'Documentation feedback',
    body: '## Documentation Feedback 📝',
  },
};

describe('FeedbackLink', () => {
  const apiSpy = new MockAnalyticsApi();

  it('Should open new Github issue tab', () => {
    render(
      wrapInTestApp(
        <TestApiProvider apis={[[analyticsApiRef, apiSpy]]}>
          <IssueLink {...defaultGithubProps} />
        </TestApiProvider>,
      ),
    );

    const link = screen.getByText(/Open new Github issue/);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_blank');
    const encodedTitle = encodeURIComponent(defaultGithubProps.template.title);
    const encodedBody = encodeURIComponent(defaultGithubProps.template.body);
    expect(link).toHaveAttribute(
      'href',
      `https://github.com/backstage/backstage/issues/new?title=${encodedTitle}&body=${encodedBody}`,
    );
  });

  it('Should open new Gitlab issue tab', () => {
    render(
      wrapInTestApp(
        <TestApiProvider apis={[[analyticsApiRef, apiSpy]]}>
          <IssueLink {...defaultGitlabProps} />
        </TestApiProvider>,
      ),
    );

    const link = screen.getByText(/Open new Gitlab issue/);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_blank');
    const encodedTitle = encodeURIComponent(defaultGithubProps.template.title);
    const encodedBody = encodeURIComponent(defaultGithubProps.template.body);
    expect(link).toHaveAttribute(
      'href',
      `https://gitlab.com/backstage/backstageSubgroup/backstage/issues/new?issue[title]=${encodedTitle}&issue[description]=${encodedBody}`,
    );
  });

  it('Should track click events', async () => {
    render(
      wrapInTestApp(
        <TestApiProvider apis={[[analyticsApiRef, apiSpy]]}>
          <IssueLink {...defaultGithubProps} />
        </TestApiProvider>,
      ),
    );

    fireEvent.click(screen.getByText(/Open new Github issue/));

    await waitFor(() => {
      expect(apiSpy.getEvents()[0]).toMatchObject({
        action: 'click',
        subject: 'Open new  Github  issue',
      });
    });
  });
});
