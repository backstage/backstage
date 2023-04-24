/*
 * Copyright 2023 The Backstage Authors
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
import { EntityTeamPullRequestsCard } from '../EntityTeamPullRequestsCard';
import { PullRequestsColumn } from '../../utils/types';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';

jest.mock('../../hooks/useUserRepositoriesAndTeam', () => {
  return {
    useUserRepositoriesAndTeam: () => {
      return {
        loading: false,
        repositories: ['team-login/team-repo'],
        teamMembers: ['team-member'],
        teamMembersOrganization: 'test-org',
      };
    },
  };
});

jest.mock('../../hooks/usePullRequestsByTeam', () => {
  const buildPullRequest = (
    prTitle: string,
    authorLogin: string,
    repoName: string,
    isDraft: boolean,
    isArchived: boolean,
  ) => {
    return {
      id: 'id',
      title: prTitle,
      url: 'url',
      lastEditedAt: 'last-edited-at',
      latestReviews: {
        nodes: [],
      },
      mergeable: true,
      state: 'state',
      reviewDecision: null,
      createdAt: 'created-at',
      repository: {
        name: repoName,
        owner: {
          login: 'team-login',
        },
        isArchived: isArchived,
      },
      isDraft: isDraft,
      author: {
        login: authorLogin,
        avatarUrl: 'avatar-url',
        id: 'id',
        email: 'email',
        name: 'name',
      },
    };
  };

  const pullRequests: PullRequestsColumn[] = [
    {
      title: 'column',
      content: [
        buildPullRequest(
          'non-team-non-draft-non-archive',
          'non-team-member',
          'team-repo',
          false,
          false,
        ),
        buildPullRequest(
          'non-team-non-draft-is-archive',
          'non-team-member',
          'team-repo',
          false,
          true,
        ),
        buildPullRequest(
          'non-team-is-draft-non-archive',
          'non-team-member',
          'team-repo',
          true,
          false,
        ),
        buildPullRequest(
          'non-team-is-draft-is-archive',
          'non-team-member',
          'team-repo',
          true,
          true,
        ),
        buildPullRequest(
          'is-team-non-draft-non-archive',
          'team-member',
          'non-team-repo',
          false,
          false,
        ),
        buildPullRequest(
          'is-team-non-draft-is-archive',
          'team-member',
          'non-team-repo',
          false,
          true,
        ),
        buildPullRequest(
          'is-team-is-draft-non-archive',
          'team-member',
          'non-team-repo',
          true,
          false,
        ),
        buildPullRequest(
          'is-team-is-draft-is-archive',
          'team-member',
          'non-team-repo',
          true,
          true,
        ),
      ],
    },
  ];

  return {
    usePullRequestsByTeam: () => {
      return {
        loading: false,
        pullRequests: pullRequests,
        refreshPullRequest: () => {},
      };
    },
  };
});

describe('EntityTeamPullRequestsCard', () => {
  describe('non-team PRs', () => {
    describe('non-draft PRs', () => {
      it('should show non-team PRs for un-archived repos when archived option is not checked', async () => {
        const { getByText, getAllByText, queryAllByTitle } = await render(
          <EntityTeamPullRequestsCard />,
        );
        expect(getByText('non-team-non-draft-non-archive')).toBeInTheDocument();
        expect(getAllByText('team-repo')).toHaveLength(1);
        expect(queryAllByTitle('Repository is archived')).toHaveLength(0);
        expect(queryAllByTitle('Draft PR')).toHaveLength(0);
      });

      it('should show non-team PRs for archived repos when archived option is checked', async () => {
        const { getByText, getAllByText, getByTitle, queryAllByTitle } =
          await render(<EntityTeamPullRequestsCard />);
        const archiveToggle = getByTitle('Show archived repos');
        fireEvent.click(archiveToggle);
        expect(getByText('non-team-non-draft-is-archive')).toBeInTheDocument();
        expect(getAllByText('team-repo')).toHaveLength(1);
        expect(queryAllByTitle('Repository is archived')).toHaveLength(1);
        expect(queryAllByTitle('Draft PR')).toHaveLength(0);
      });
    });

    describe('draft PRs', () => {
      it('should show draft non-team PRs for un-archived repos when archived option is not checked', async () => {
        const { getByText, getAllByText, getByTitle, queryAllByTitle } =
          await render(<EntityTeamPullRequestsCard />);
        const draftToggle = getByTitle('Show draft PRs');
        fireEvent.click(draftToggle);
        expect(getByText('non-team-is-draft-non-archive')).toBeInTheDocument();
        expect(getAllByText('team-repo')).toHaveLength(1);
        expect(queryAllByTitle('Repository is archived')).toHaveLength(0);
        expect(queryAllByTitle('Draft PR')).toHaveLength(1);
      });

      it('should show draft non-team PRs for archived repos when archived option is checked', async () => {
        const { getByText, getAllByText, getByTitle, queryAllByTitle } =
          await render(<EntityTeamPullRequestsCard />);
        const draftToggle = getByTitle('Show draft PRs');
        fireEvent.click(draftToggle);
        const archiveToggle = getByTitle('Show archived repos');
        fireEvent.click(archiveToggle);
        expect(getByText('non-team-is-draft-is-archive')).toBeInTheDocument();
        expect(getAllByText('team-repo')).toHaveLength(1);
        expect(queryAllByTitle('Repository is archived')).toHaveLength(1);
        expect(queryAllByTitle('Draft PR')).toHaveLength(1);
      });
    });
  });

  describe('team PRs', () => {
    describe('non-draft PRs', () => {
      it('should show team PRs for un-archived repos when archived option is not checked', async () => {
        const { getByText, getAllByText, getByTitle, queryAllByTitle } =
          await render(<EntityTeamPullRequestsCard />);
        const teamToggle = getByTitle('Show PRs from your team');
        fireEvent.click(teamToggle);
        expect(getByText('is-team-non-draft-non-archive')).toBeInTheDocument();
        expect(getAllByText('non-team-repo')).toHaveLength(1);
        expect(queryAllByTitle('Repository is archived')).toHaveLength(0);
        expect(queryAllByTitle('Draft PR')).toHaveLength(0);
      });

      it('should show team PRs for archived repos when archived option is checked', async () => {
        const { getByText, getAllByText, getByTitle, queryAllByTitle } =
          await render(<EntityTeamPullRequestsCard />);
        const teamToggle = getByTitle('Show PRs from your team');
        fireEvent.click(teamToggle);
        const archiveToggle = getByTitle('Show archived repos');
        fireEvent.click(archiveToggle);
        expect(getByText('is-team-non-draft-is-archive')).toBeInTheDocument();
        expect(getAllByText('non-team-repo')).toHaveLength(1);
        expect(queryAllByTitle('Repository is archived')).toHaveLength(1);
        expect(queryAllByTitle('Draft PR')).toHaveLength(0);
      });
    });

    describe('draft PRs', () => {
      it('should show draft team PRs for un-archived repos when archived option is not checked', async () => {
        const { getByText, getAllByText, getByTitle, queryAllByTitle } =
          await render(<EntityTeamPullRequestsCard />);
        const teamToggle = getByTitle('Show PRs from your team');
        fireEvent.click(teamToggle);
        const draftToggle = getByTitle('Show draft PRs');
        fireEvent.click(draftToggle);
        expect(getByText('is-team-is-draft-non-archive')).toBeInTheDocument();
        expect(getAllByText('non-team-repo')).toHaveLength(1);
        expect(queryAllByTitle('Repository is archived')).toHaveLength(0);
        expect(queryAllByTitle('Draft PR')).toHaveLength(1);
      });

      it('should show draft team PRs for archived repos when archived option is checked', async () => {
        const { getByText, getAllByText, getByTitle, queryAllByTitle } =
          await render(<EntityTeamPullRequestsCard />);
        const teamToggle = getByTitle('Show PRs from your team');
        fireEvent.click(teamToggle);
        const draftToggle = getByTitle('Show draft PRs');
        fireEvent.click(draftToggle);
        const archiveToggle = getByTitle('Show archived repos');
        fireEvent.click(archiveToggle);
        expect(getByText('is-team-is-draft-is-archive')).toBeInTheDocument();
        expect(getAllByText('non-team-repo')).toHaveLength(1);
        expect(queryAllByTitle('Repository is archived')).toHaveLength(1);
        expect(queryAllByTitle('Draft PR')).toHaveLength(1);
      });
    });
  });
});
