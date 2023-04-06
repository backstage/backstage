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
import { render, fireEvent } from '@testing-library/react';

describe('RepoUrlPickerRepoName', () => {
  it('should call onChange with the first allowed repo if there is none set already', async () => {
    const onChange = jest.fn();

    render(
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

    const { getByRole } = render(
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

    const { getByRole } = render(
      <RepoUrlPickerRepoName
        onChange={onChange}
        allowedRepos={[]}
        rawErrors={[]}
      />,
    );

    const textArea = getByRole('textbox');

    expect(textArea).toBeVisible();

    fireEvent.change(textArea, { target: { value: 'foo' } });

    expect(onChange).toHaveBeenCalledWith('foo');
  });
});
