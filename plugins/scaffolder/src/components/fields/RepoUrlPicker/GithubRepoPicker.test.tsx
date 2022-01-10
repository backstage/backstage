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
import { GithubRepoPicker } from './GithubRepoPicker';
import { render } from '@testing-library/react';

describe('GitubRepoPicker', () => {
  it('renders a select if there is a list of allowed owners', () => {
    const allowedOwners = ['owner1', 'owner2'];
    const { findByText } = render(
      <GithubRepoPicker
        onOwnerChange={jest.fn()}
        onRepoNameChange={jest.fn()}
        rawErrors={[]}
        repoName="repo"
        allowedOwners={allowedOwners}
      />,
    );

    expect(findByText('owner1')).toBeInTheDocument();
  });
});
