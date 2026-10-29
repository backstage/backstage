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

import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import { BitbucketRepoBranchPicker } from './BitbucketRepoBranchPicker';
import {
  act,
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';

jest.mock('@backstage/plugin-scaffolder-react/alpha', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-react/alpha'),
  useScaffolderTheme: jest.fn(),
}));

const mockUseScaffolderTheme = useScaffolderTheme as jest.Mock;

describe('BitbucketRepoBranchPicker', () => {
  beforeEach(() => {
    mockUseScaffolderTheme.mockReturnValue('mui');
  });

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

  it('input field disabled', () => {
    render(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <BitbucketRepoBranchPicker
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

    // Open the Autocomplete dropdown
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

  describe('with bui theme', () => {
    beforeEach(() => {
      mockUseScaffolderTheme.mockReturnValue('bui');
    });

    it('renders a combobox and calls onChange when selecting an option', async () => {
      const onChange = jest.fn();

      const { getByRole, getByText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <BitbucketRepoBranchPicker
            onChange={onChange}
            state={{
              host: 'bitbucket.org',
              branch: '',
              workspace: 'foo',
              repository: 'bar',
            }}
            rawErrors={[]}
            accessToken="token"
          />
        </TestApiProvider>,
      );

      const combobox = getByRole('combobox');
      expect(combobox).toBeInTheDocument();

      await userEvent.click(combobox);
      await waitFor(() => expect(getByText('branch1')).toBeInTheDocument());

      await userEvent.click(getByText('branch1'));
      expect(onChange).toHaveBeenCalledWith({ branch: 'branch1' });
    });

    const ControlledBranchPicker = ({
      onStateChange,
    }: {
      onStateChange?: (state: { branch: string }) => void;
    }) => {
      const [state, setState] = useState({
        host: 'bitbucket.org',
        workspace: 'foo',
        repository: 'bar',
        branch: '',
      });

      return (
        <BitbucketRepoBranchPicker
          onChange={changes => {
            setState(prev => {
              const next = { ...prev, ...changes };
              onStateChange?.(next);
              return next;
            });
          }}
          state={state}
          rawErrors={[]}
          accessToken="token"
        />
      );
    };

    it('preserves custom text when selecting an option, typing a suffix, and tabbing out', async () => {
      const onStateChange = jest.fn();

      const { getByRole, getByText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <ControlledBranchPicker onStateChange={onStateChange} />
        </TestApiProvider>,
      );

      const combobox = getByRole('combobox');
      await userEvent.click(combobox);
      await waitFor(() => expect(getByText('branch1')).toBeInTheDocument());

      await userEvent.click(getByText('branch1'));
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({ branch: 'branch1' }),
      );

      await userEvent.type(combobox, '-custom');
      await userEvent.tab();

      expect(combobox).toHaveValue('branch1-custom');
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ branch: 'branch1-custom' }),
      );
    });

    it('clears selection when user clears input and tabs out', async () => {
      const onStateChange = jest.fn();

      const { getByRole, getByText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <ControlledBranchPicker onStateChange={onStateChange} />
        </TestApiProvider>,
      );

      const combobox = getByRole('combobox');
      await userEvent.click(combobox);
      await waitFor(() => expect(getByText('branch1')).toBeInTheDocument());

      await userEvent.click(getByText('branch1'));
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({ branch: 'branch1' }),
      );

      await userEvent.clear(combobox);
      await userEvent.tab();

      expect(combobox).toHaveValue('');
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ branch: '' }),
      );
    });
  });
});
