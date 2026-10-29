/*
 * Copyright 2025 The Backstage Authors
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
import { GitLabRepoOwnerPicker } from './GitLabRepoOwnerPicker';
import { act, fireEvent, waitFor, screen } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';

jest.mock('@backstage/plugin-scaffolder-react/alpha', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-react/alpha'),
  useScaffolderTheme: jest.fn(),
}));

const mockUseScaffolderTheme = useScaffolderTheme as jest.Mock;

describe('GitLabRepoOwnerPicker', () => {
  beforeEach(() => {
    mockUseScaffolderTheme.mockReturnValue('mui');
  });

  const scaffolderApiMock: Partial<ScaffolderApi> = {
    autocomplete: jest.fn().mockResolvedValue({
      results: [{ title: 'owner1' }, { title: 'owner2' }],
    }),
  };

  it('renders an input field', async () => {
    const { getByRole } = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <GitLabRepoOwnerPicker
          onChange={jest.fn()}
          state={{ owner: 'owner1' }}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByRole('textbox')).toHaveValue('owner1');
  });

  it('input field disabled', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <GitLabRepoOwnerPicker
          onChange={jest.fn()}
          isDisabled
          state={{ owner: 'owner1' }}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    const input = screen.getByRole('textbox');

    // Expect input to be disabled
    expect(input).toBeDisabled();
    expect(input).toHaveValue('owner1');
  });

  it('calls onChange when the input field changes', async () => {
    const onChange = jest.fn();

    const { getByRole } = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <GitLabRepoOwnerPicker
          onChange={onChange}
          state={{ owner: 'owner1' }}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    const input = getByRole('textbox');

    act(() => {
      input.focus();
      fireEvent.change(input, {
        target: { value: 'owner2' },
      });
      input.blur();
    });

    expect(onChange).toHaveBeenCalledWith({ owner: 'owner2' });
  });

  it('should populate owners', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });
    const onChange = jest.fn();

    try {
      const { getByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitLabRepoOwnerPicker
            onChange={onChange}
            state={{
              host: 'gitlab.com',
              owner: 'foo',
            }}
            rawErrors={[]}
            accessToken="token"
          />
        </TestApiProvider>,
      );

      // Open the Autocomplete dropdown
      const input = getByRole('textbox');
      await user.click(input);

      // Flush the component debounce and any pending async updates
      act(() => {
        jest.advanceTimersByTime(500);
      });
      await act(async () => {
        await Promise.resolve();
      });

      // Verify that the available owners are shown
      expect(await screen.findByText('owner1')).toBeInTheDocument();

      // Verify that selecting an option calls onChange
      await user.click(screen.getByText('owner1'));
      expect(onChange).toHaveBeenCalledWith({
        owner: 'owner1',
      });
    } finally {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    }
  });

  it('should filter out excluded owners', async () => {
    const onChange = jest.fn();

    const { getByRole, getByText } = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <GitLabRepoOwnerPicker
          onChange={onChange}
          state={{
            host: 'gitlab.com',
          }}
          rawErrors={[]}
          accessToken="token"
          excludedOwners={['owner1']}
        />
      </TestApiProvider>,
    );

    // Open the Autocomplete dropdown
    const input = getByRole('textbox');
    await userEvent.click(input);

    // Verify that the excluded owners are not shown
    await waitFor(() => expect(getByText('owner2')).toBeInTheDocument());
    expect(screen.queryByText('owner1')).not.toBeInTheDocument();
  });

  describe('with bui theme', () => {
    beforeEach(() => {
      mockUseScaffolderTheme.mockReturnValue('bui');
    });

    it('renders a combobox and calls onChange when selecting an option', async () => {
      const onChange = jest.fn();

      const { getByRole, getByText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitLabRepoOwnerPicker
            onChange={onChange}
            state={{
              host: 'gitlab.com',
              owner: '',
            }}
            rawErrors={[]}
            accessToken="token"
          />
        </TestApiProvider>,
      );

      const combobox = getByRole('combobox');
      expect(combobox).toBeInTheDocument();

      await userEvent.click(combobox);
      await waitFor(() => expect(getByText('owner1')).toBeInTheDocument());

      await userEvent.click(getByText('owner1'));
      expect(onChange).toHaveBeenCalledWith({ owner: 'owner1' });
    });

    const ControlledOwnerPicker = ({
      onStateChange,
    }: {
      onStateChange?: (state: { owner: string }) => void;
    }) => {
      const [state, setState] = useState({
        host: 'gitlab.com',
        owner: '',
      });

      return (
        <GitLabRepoOwnerPicker
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
          <ControlledOwnerPicker onStateChange={onStateChange} />
        </TestApiProvider>,
      );

      const combobox = getByRole('combobox');
      await userEvent.click(combobox);
      await waitFor(() => expect(getByText('owner1')).toBeInTheDocument());

      await userEvent.click(getByText('owner1'));
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({ owner: 'owner1' }),
      );

      await userEvent.type(combobox, '-custom');
      await userEvent.tab();

      expect(combobox).toHaveValue('owner1-custom');
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ owner: 'owner1-custom' }),
      );
    });

    it('clears selection when user clears input and tabs out', async () => {
      const onStateChange = jest.fn();

      const { getByRole, getByText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <ControlledOwnerPicker onStateChange={onStateChange} />
        </TestApiProvider>,
      );

      const combobox = getByRole('combobox');
      await userEvent.click(combobox);
      await waitFor(() => expect(getByText('owner1')).toBeInTheDocument());

      await userEvent.click(getByText('owner1'));
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({ owner: 'owner1' }),
      );

      await userEvent.clear(combobox);
      await userEvent.tab();

      expect(combobox).toHaveValue('');
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ owner: '' }),
      );
    });
  });
});
