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
import { BitbucketRepoPicker } from './BitbucketRepoPicker';
import { render, fireEvent } from '@testing-library/react';

describe('BitbucketRepoPicker', () => {
  it('renders workspace input when host is bitbucket.org', () => {
    const state = { host: 'bitbucket.org', workspace: 'lolsWorkspace' };

    const { getAllByRole } = render(
      <BitbucketRepoPicker onChange={jest.fn()} rawErrors={[]} state={state} />,
    );

    expect(getAllByRole('textbox')).toHaveLength(3);
    expect(getAllByRole('textbox')[0]).toHaveValue('lolsWorkspace');
  });

  it('hides the workspace input when the host is not bitbucket.org', () => {
    const state = {
      host: 'mycustom.domain.bitbucket.org',
    };

    const { getAllByRole } = render(
      <BitbucketRepoPicker onChange={jest.fn()} rawErrors={[]} state={state} />,
    );

    expect(getAllByRole('textbox')).toHaveLength(2);
  });
  describe('workspace field', () => {
    it('calls onChange when the workspace changes', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <BitbucketRepoPicker
          onChange={onChange}
          rawErrors={[]}
          state={{ host: 'bitbucket.org' }}
        />,
      );

      const workspaceInput = getAllByRole('textbox')[0];

      fireEvent.change(workspaceInput, { target: { value: 'test-workspace' } });

      expect(onChange).toHaveBeenCalledWith({ workspace: 'test-workspace' });
    });
  });

  describe('project field', () => {
    it('calls onChange when the project changes', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <BitbucketRepoPicker
          onChange={onChange}
          rawErrors={[]}
          state={{ host: 'bitbucket.org' }}
        />,
      );

      const projectInput = getAllByRole('textbox')[1];

      fireEvent.change(projectInput, { target: { value: 'test-project' } });

      expect(onChange).toHaveBeenCalledWith({ project: 'test-project' });
    });
  });

  describe('repoName field', () => {
    it('calls onChange when the repoName changes', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <BitbucketRepoPicker
          onChange={onChange}
          rawErrors={[]}
          state={{ host: 'bitbucket.org' }}
        />,
      );

      const repoNameInput = getAllByRole('textbox')[2];

      fireEvent.change(repoNameInput, { target: { value: 'test-repo' } });

      expect(onChange).toHaveBeenCalledWith({ repoName: 'test-repo' });
    });
  });
});
