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
/*
 * Copyright 2020 RoadieHQ
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
import { render } from '@testing-library/react';
import mockFetch from 'jest-fetch-mock';
import { PullRequestsTableView } from './PullRequestsTable';

describe('PullRequestTable', () => {
  it('should render', async () => {
    mockFetch.mockResponse(() => new Promise(() => {}));
    const testProjectName = 'test-project-name';
    const rendered = render(
      <PullRequestsTableView
        projectName={testProjectName}
        loading={false}
        pageSize={10}
        page={0}
        StateFilterComponent={() => <></>}
        prData={[]}
        retry={() => {}}
        onChangePage={() => {}}
        onChangePageSize={() => {}}
        total={0}
      />,
    );
    expect(await rendered.findByText(testProjectName)).toBeInTheDocument();
  });
  it('should render table list item', async () => {
    mockFetch.mockResponse(() => new Promise(() => {}));
    const testTitle = 'Add migration for entity_search column fix';
    const rendered = render(
      <>
        <PullRequestsTableView
          projectName="test"
          loading={false}
          pageSize={10}
          page={0}
          StateFilterComponent={() => <></>}
          prData={[
            {
              id: 464572082,
              number: 1862,
              title: testTitle,
              url: 'https://api.github.com/repos/spotify/backstage/pulls/1862',
              createdTime: '2 hours ago',
              creatorNickname: 'dependabot-preview[bot]',
              creatorProfileLink: 'https://github.com/apps/dependabot-preview',
              updatedTime: '2 hours ago',
            },
          ]}
          retry={() => {}}
          onChangePage={() => {}}
          onChangePageSize={() => {}}
          total={0}
        />
        ,
      </>,
    );
    expect(await rendered.findByText(testTitle)).toBeInTheDocument();
  });
});
