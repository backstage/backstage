/*
 * Copyright 2026 The Backstage Authors
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

import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import { GitLabRepoBranchPicker } from './GitLabRepoBranchPicker';
import {
  act,
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';

describe('GitLabRepoBranchPicker', () => {
  const scaffolderApiMock: Partial<ScaffolderApi> = {
    autocomplete: jest.fn().mockResolvedValue({ results: [{ id: 'branch1' }] }),
  };

  it('renders an input field', () => {
    const { getByRole } = render(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <GitLabRepoBranchPicker
          onChange={jest.fn()}
          state={{ branch: 'main' }}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByRole('textbox')).toHaveValue('main');
  });

  it('input field disabled', () => {
    render(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <GitLabRepoBranchPicker
          onChange={jest.fn()}
          isDisabled
          state={{ branch: 'main' }}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    const input = screen.getByRole('textbox');

    // Expect input to be disabled
    expect(input).toBeDisabled();
    expect(input).toHaveValue('main');
  });

  it('calls onChange when the input field changes', () => {
    const onChange = jest.fn();

    const { getByRole } = render(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <GitLabRepoBranchPicker
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
        <GitLabRepoBranchPicker
          onChange={onChange}
          state={{
            host: 'gitlab.example.com',
            branch: 'main',
            owner: 'foo',
            repository: 'bar',
          }}
          rawErrors={[]}
          accessToken="token"
        />
      </TestApiProvider>,
    );

    // Open the Autocomplete dropdown
    const input = getByRole('textbox');
    await userEvent.click(input);

    // Verify that the available workspaces are shown
    await waitFor(() => expect(getByText('branch1')).toBeInTheDocument());

    expect(scaffolderApiMock.autocomplete).toHaveBeenCalledWith({
      token: 'token',
      resource: 'branches',
      provider: 'gitlab',
      context: { host: 'gitlab.example.com', owner: 'foo', repository: 'bar' },
    });

    // Verify that selecting an option calls onChange
    await userEvent.click(getByText('branch1'));
    expect(onChange).toHaveBeenCalledWith({
      branch: 'branch1',
    });
  });
  it('shows a read failure rather than implying that the repository has no branches', async () => {
    const autocomplete = jest.fn().mockRejectedValue(new Error('Forbidden'));
    render(
      <TestApiProvider apis={[[scaffolderApiRef, { autocomplete }]]}>
        <GitLabRepoBranchPicker
          onChange={jest.fn()}
          state={{
            host: 'gitlab.example.com',
            owner: 'group/subgroup',
            repository: 'private',
            branch: '',
          }}
          rawErrors={[]}
          accessToken="user-token"
        />
      </TestApiProvider>,
    );
    expect(
      await screen.findByText('Unable to load repository branches'),
    ).toBeInTheDocument();
  });
});
