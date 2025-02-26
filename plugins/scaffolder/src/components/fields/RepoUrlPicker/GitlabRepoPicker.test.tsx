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

import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { GitlabRepoPicker } from './GitlabRepoPicker';

describe('GitlabRepoPicker', () => {
  const scaffolderApiMock: Partial<ScaffolderApi> = {
    autocomplete: jest.fn().mockImplementation(opts =>
      Promise.resolve({
        results: [{ title: `${opts.resource}_example` }],
      }),
    ),
  };

  describe('GitlabRepoPicker - isDisabled', () => {
    it('disables owner input when isDisabled is true', async () => {
      const { getByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            isDisabled
          />
        </TestApiProvider>,
      );

      expect(getByRole('textbox')).toBeDisabled();
    });

    it('does not disable owner input when isDisabled is false', async () => {
      const { getByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            isDisabled={false}
          />
        </TestApiProvider>,
      );

      expect(getByRole('textbox')).not.toBeDisabled();
    });

    it('disables select input when allowedOwners are provided and isDisabled is true', async () => {
      const allowedOwners = ['owner1', 'owner2'];
      const { getByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
            isDisabled
          />
        </TestApiProvider>,
      );

      expect(getByRole('combobox')).toBeDisabled();
    });

    it('does not disable select input when allowedOwners are provided and isDisabled is false', async () => {
      const allowedOwners = ['owner1', 'owner2'];
      const { getByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
            isDisabled={false}
          />
        </TestApiProvider>,
      );

      expect(getByRole('combobox')).not.toBeDisabled();
    });
  });

  describe('owner field', () => {
    it('renders a select if there is a list of allowed owners', async () => {
      const allowedOwners = ['owner1', 'owner2'];
      const { findByText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
          />
          ,
        </TestApiProvider>,
      );

      expect(await findByText('owner1')).toBeInTheDocument();
      expect(await findByText('owner2')).toBeInTheDocument();
    });

    it('calls onChange when the owner is changed to a different owner', async () => {
      const onChange = jest.fn();
      const allowedOwners = ['owner1', 'owner2'];
      const { getByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
          />
          ,
        </TestApiProvider>,
      );

      await fireEvent.change(getByRole('combobox'), {
        target: { value: 'owner2' },
      });

      expect(onChange).toHaveBeenCalledWith({ owner: 'owner2' });
    });

    it('is disabled picked when only one allowed owner', async () => {
      const onChange = jest.fn();
      const allowedOwners = ['owner1'];
      const { getByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
          />
          ,
        </TestApiProvider>,
      );

      expect(getByRole('combobox')).toBeDisabled();
    });

    it('should display free text if no allowed owners are passed', async () => {
      const onChange = jest.fn();
      const { getAllByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
          />
        </TestApiProvider>,
      );
      const ownerField = getAllByRole('textbox')[0];
      ownerField.focus();
      fireEvent.change(ownerField, {
        target: { value: 'my-mock-owner' },
      });
      ownerField.blur();

      expect(onChange).toHaveBeenCalledWith({ owner: 'my-mock-owner' });
    });
  });
});
