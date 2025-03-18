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
import { renderInTestApp } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { RepoUrlPickerRepoName } from './RepoUrlPickerRepoName';

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

    expect(onChange).toHaveBeenCalledWith({ name: 'foo' });
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

    expect(onChange).toHaveBeenCalledWith({ name: 'foo' });
  });

  it('should autocomplete with provided availableRepos', async () => {
    const availableRepos = [{ name: 'foo' }, { name: 'bar' }];

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
      expect(getByText(repo.name)).toBeInTheDocument();
    }

    // Verify that selecting an option calls onChange
    await userEvent.click(getByText(availableRepos[0].name));
    expect(onChange).toHaveBeenCalledWith(availableRepos[0]);
  });

  it('should disable the repo selection when isDisabled is true', async () => {
    const allowedRepos = ['foo', 'bar'];
    const onChange = jest.fn();

    const { getByRole } = await renderInTestApp(
      <RepoUrlPickerRepoName
        onChange={onChange}
        allowedRepos={allowedRepos}
        rawErrors={[]}
        isDisabled
      />,
    );

    // Find the select element
    const selectElement = getByRole('combobox');

    // Ensure it's disabled
    expect(selectElement).toBeDisabled();
  });

  it('should disable the text input when no options are passed and isDisabled is true', async () => {
    const onChange = jest.fn();

    const { getByRole } = await renderInTestApp(
      <RepoUrlPickerRepoName
        onChange={onChange}
        allowedRepos={[]}
        rawErrors={[]}
        isDisabled
      />,
    );

    // Find the text input (autocomplete)
    const textInput = getByRole('textbox');

    // Ensure it's disabled
    expect(textInput).toBeDisabled();
  });
});
