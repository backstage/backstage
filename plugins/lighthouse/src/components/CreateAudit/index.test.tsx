/*
 * Copyright 2020 Spotify AB
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

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  const mocks = {
    replace: jest.fn(),
    push: jest.fn(),
  };
  return {
    ...actual,
    useHistory: jest.fn(() => mocks),
  };
});

import React from 'react';
import mockFetch from 'jest-fetch-mock';
import { wait, render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  ApiRegistry,
  ApiProvider,
  ErrorApi,
  errorApiRef,
} from '@backstage/core';
import { wrapInThemedTestApp, wrapInTheme } from '@backstage/test-utils';

import { lighthouseApiRef, LighthouseRestApi, Audit } from '../../api';
import CreateAudit from '.';
import * as data from '../../__fixtures__/create-audit-response.json';

const { useHistory }: { useHistory: jest.Mock } = jest.requireMock(
  'react-router-dom',
);
const createAuditResponse = data as Audit;

// TODO add act() to these tests without breaking them!
describe('CreateAudit', () => {
  let apis: ApiRegistry;
  let errorApi: ErrorApi;

  beforeEach(() => {
    errorApi = { post: jest.fn() };
    apis = ApiRegistry.from([
      [lighthouseApiRef, new LighthouseRestApi('http://lighthouse')],
      [errorApiRef, errorApi],
    ]);
  });

  it('renders the form', () => {
    const rendered = render(
      wrapInThemedTestApp(
        <ApiProvider apis={apis}>
          <CreateAudit />
        </ApiProvider>,
      ),
    );
    expect(rendered.getByLabelText(/URL/)).toBeEnabled();
    expect(rendered.getByLabelText(/URL/)).toHaveAttribute('value', '');
    expect(rendered.getByText(/Create Audit/)).toBeEnabled();
  });

  describe('when the location contains a url', () => {
    it('prefills the url into the form', () => {
      const url = 'https://spotify.com';
      const rendered = render(
        wrapInTheme(
          <MemoryRouter
            initialEntries={[
              `/lighthouse/create-audit?url=${encodeURIComponent(url)}`,
            ]}
          >
            <ApiProvider apis={apis}>
              <CreateAudit />
            </ApiProvider>
          </MemoryRouter>,
        ),
      );
      expect(rendered.getByLabelText(/URL/)).toHaveAttribute('value', url);
    });
  });

  describe('when waiting on the request', () => {
    it('disables the form fields', () => {
      mockFetch.mockResponseOnce(() => new Promise(() => {}));

      const rendered = render(
        wrapInThemedTestApp(
          <ApiProvider apis={apis}>
            <CreateAudit />
          </ApiProvider>,
        ),
      );

      fireEvent.change(rendered.getByLabelText(/URL/), {
        target: { value: 'https://spotify.com' },
      });
      fireEvent.click(rendered.getByText(/Create Audit/));

      expect(rendered.getByLabelText(/URL/)).toBeDisabled();
      expect(rendered.getByText(/Create Audit/)).toBeDisabled();
    });
  });

  describe('when the audit is successfully created', () => {
    it('triggers a location change to the table', async () => {
      useHistory().push.mockClear();
      mockFetch.mockResponseOnce(JSON.stringify(createAuditResponse));

      const rendered = render(
        wrapInThemedTestApp(
          <ApiProvider apis={apis}>
            <CreateAudit />
          </ApiProvider>,
        ),
      );

      fireEvent.change(rendered.getByLabelText(/URL/), {
        target: { value: 'https://spotify.com' },
      });
      fireEvent.click(rendered.getByText(/Create Audit/));

      expect(mockFetch).toHaveBeenCalledWith(
        'http://lighthouse/v1/audits',
        expect.objectContaining({
          method: 'POST',
        }),
      );

      await wait(() => expect(rendered.getByLabelText(/URL/)).toBeEnabled());

      expect(useHistory().push).toHaveBeenCalledWith('/lighthouse');
    });
  });

  describe('when the audits fail', () => {
    it('should render an error', async () => {
      (errorApi.post as jest.Mock).mockClear();
      mockFetch.mockRejectOnce(new Error('failed to post'));

      const rendered = render(
        wrapInThemedTestApp(
          <ApiProvider apis={apis}>
            <CreateAudit />
          </ApiProvider>,
        ),
      );

      fireEvent.change(rendered.getByLabelText(/URL/), {
        target: { value: 'https://spotify.com' },
      });
      fireEvent.click(rendered.getByText(/Create Audit/));

      await wait(() => expect(rendered.getByLabelText(/URL/)).toBeEnabled());
      await new Promise((r) => setTimeout(r, 0));

      expect(errorApi.post).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
