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
import { RepoUrlPickerRepoName } from './RepoUrlPickerRepoName';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderInTestApp } from '@backstage/test-utils';

describe('RepoUrlPickerRepoName', () => {
  it('should call onChange with the first allowed repo if there is none set already', async () => {
    const onChange = jest.fn();

    await renderInTestApp(
      <RepoUrlPickerRepoName
        onChange={onChange}
        allowedRepos={['foo', 'bar']}
        rawErrors={[]}
      />,
    );

    expect(onChange).toHaveBeenCalledWith('foo');
  });

  it('should render a dropdown of all the options', async () => {
    const allowedRepos = ['foo', 'bar'];

    const onChange = jest.fn();

    const { getByRole } = await renderInTestApp(
      <RepoUrlPickerRepoName
        onChange={onChange}
        allowedRepos={allowedRepos}
        rawErrors={[]}
      />,
    );

    const select = getByRole('combobox');
    await fireEvent.click(select);

    for (const option of allowedRepos) {
      const element = getByRole('option', { name: option });
      expect(element).toBeVisible();
    }
  });

  it('should render a normal text area when no options are passed', async () => {
    const onChange = jest.fn();

    const { getByRole } = await renderInTestApp(
      <RepoUrlPickerRepoName
        onChange={onChange}
        allowedRepos={[]}
        rawErrors={[]}
      />,
    );

    const textArea = getByRole('textbox');

    expect(textArea).toBeVisible();

    act(() => {
      textArea.focus();
      fireEvent.change(textArea, { target: { value: 'foo' } });
      textArea.blur();
    });

    expect(onChange).toHaveBeenCalledWith('foo');
  });

  it('should autocomplete with provided availableRepos', async () => {
    const availableRepos = ['foo', 'bar'];

    const onChange = jest.fn();

    const { getByRole, getByText } = await renderInTestApp(
      <RepoUrlPickerRepoName
        onChange={onChange}
        availableRepos={availableRepos}
        rawErrors={[]}
      />,
    );

    // Open the Autocomplete dropdown
    const input = getByRole('textbox');
    await userEvent.click(input);

    // Verify that available repos are shown
    for (const repo of availableRepos) {
      expect(getByText(repo)).toBeInTheDocument();
    }

    // Verify that selecting an option calls onChange
    await userEvent.click(getByText(availableRepos[0]));
    expect(onChange).toHaveBeenCalledWith(availableRepos[0]);
  });
});
