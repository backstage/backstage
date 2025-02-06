/*
 * Copyright 2024 The Backstage Authors
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
import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import { BitbucketRepoBranchPicker } from './BitbucketRepoBranchPicker';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';

describe('BitbucketRepoBranchPicker', () => {
  const scaffolderApiMock: Partial<ScaffolderApi> = {
    autocomplete: jest.fn().mockResolvedValue({ results: [{ id: 'branch1' }] }),
  };

  it('renders an input field', () => {
    const { getByRole } = render(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <BitbucketRepoBranchPicker
          onChange={jest.fn()}
          state={{ branch: 'main' }}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByRole('textbox')).toHaveValue('main');
  });

  it('calls onChange when the input field changes', () => {
    const onChange = jest.fn();

    const { getByRole } = render(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <BitbucketRepoBranchPicker
          onChange={onChange}
          state={{ branch: 'main' }}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    const input = getByRole('textbox');

    act(() => {
      input.focus();
      fireEvent.change(input, {
        target: { value: 'develop' },
      });
      input.blur();
    });

    expect(onChange).toHaveBeenCalledWith({ branch: 'develop' });
  });

  it('should populate branches', async () => {
    const onChange = jest.fn();

    const { getByRole, getByText } = render(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <BitbucketRepoBranchPicker
          onChange={onChange}
          state={{
            branch: 'main',
            host: 'bitbucket.org',
            workspace: 'foo',
            repository: 'bar',
          }}
          rawErrors={[]}
          accessToken="token"
        />
      </TestApiProvider>,
    );

    // Open the Autcomplete dropdown
    const input = getByRole('textbox');
    await userEvent.click(input);

    // Verify that the available workspaces are shown
    await waitFor(() => expect(getByText('branch1')).toBeInTheDocument());

    // Verify that selecting an option calls onChange
    await userEvent.click(getByText('branch1'));
    expect(onChange).toHaveBeenCalledWith({
      branch: 'branch1',
    });
  });
});
