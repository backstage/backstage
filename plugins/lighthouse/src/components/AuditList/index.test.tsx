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
  const mocks = {
    replace: jest.fn(),
    push: jest.fn(),
  };
  return {
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => mocks),
  };
});

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import fs from 'fs';
import path from 'path';
import mockFetch from 'jest-fetch-mock';
import { render, fireEvent } from '@testing-library/react';
import { ApiRegistry, ApiProvider } from '@backstage/core';
import { wrapInThemedTestApp, wrapInTheme } from '@backstage/test-utils';

import { lighthouseApiRef, LighthouseRestApi } from '../../api';
import AuditList from '.';

const { useHistory } = require.requireMock('react-router-dom');

const websiteListJson = fs
  .readFileSync(
    path.join(__dirname, '../../__fixtures__/website-list-response.json'),
  )
  .toString();

describe('AuditList', () => {
  let apis: ApiRegistry;

  beforeEach(() => {
    apis = ApiRegistry.from([
      [lighthouseApiRef, new LighthouseRestApi('http://lighthouse')],
    ]);
    mockFetch.mockResponse(websiteListJson);
  });

  it('should render the table', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <ApiProvider apis={apis}>
          <AuditList />
        </ApiProvider>,
      ),
    );
    const element = await rendered.findByText('https://anchor.fm');
    expect(element).toBeInTheDocument();
  });

  it('renders a link to create a new audit', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <ApiProvider apis={apis}>
          <AuditList />
        </ApiProvider>,
      ),
    );
    const element = await rendered.findByText('Create Audit');
    expect(element).toBeInTheDocument();
    expect(element.parentElement).toHaveAttribute(
      'href',
      '/lighthouse/create-audit',
    );
  });

  describe('pagination', () => {
    it('requests the correct limit and offset from the api based on the query', () => {
      mockFetch.mockClear();
      render(
        wrapInTheme(
          <MemoryRouter initialEntries={['/lighthouse?page=2']}>
            <ApiProvider apis={apis}>
              <AuditList />
            </ApiProvider>
          </MemoryRouter>,
        ),
      );
      expect(mockFetch).toHaveBeenLastCalledWith(
        'http://lighthouse/v1/websites?limit=10&offset=10',
        undefined,
      );
    });

    describe('when only one page is needed', () => {
      it('hides pagination elements', () => {
        const rendered = render(
          wrapInThemedTestApp(
            <ApiProvider apis={apis}>
              <AuditList />
            </ApiProvider>,
          ),
        );
        expect(rendered.queryByLabelText(/Go to page/)).not.toBeInTheDocument();
      });
    });

    describe('when multiple pages are needed', () => {
      beforeEach(() => {
        const response = JSON.parse(websiteListJson);
        response.limit = 5;
        response.offset = 5;
        response.total = 7;
        mockFetch.mockResponseOnce(JSON.stringify(response));
      });

      it('shows pagination elements', async () => {
        const rendered = render(
          wrapInThemedTestApp(
            <ApiProvider apis={apis}>
              <AuditList />
            </ApiProvider>,
          ),
        );
        expect(
          await rendered.findByLabelText(/Go to page/),
        ).toBeInTheDocument();
      });

      it('changes the page on click', async () => {
        const rendered = render(
          wrapInTheme(
            <MemoryRouter initialEntries={['/lighthouse?page=2']}>
              <ApiProvider apis={apis}>
                <AuditList />
              </ApiProvider>
            </MemoryRouter>,
          ),
        );
        const element = await rendered.findByLabelText(/Go to page 1/);
        fireEvent.click(element);
        expect(useHistory().replace).toHaveBeenCalledWith(`/lighthouse?page=1`);
      });
    });
  });

  describe('when waiting on the request', () => {
    it('should render the loader', async () => {
      mockFetch.mockResponseOnce(() => new Promise(() => {}));
      const rendered = render(
        wrapInThemedTestApp(
          <ApiProvider apis={apis}>
            <AuditList />
          </ApiProvider>,
        ),
      );
      const element = await rendered.findByTestId('progress');
      expect(element).toBeInTheDocument();
    });
  });

  describe('when the audits fail', () => {
    it('should render an error', async () => {
      mockFetch.mockRejectOnce(new Error('failed to fetch'));
      const rendered = render(
        wrapInThemedTestApp(
          <ApiProvider apis={apis}>
            <AuditList />
          </ApiProvider>,
        ),
      );
      const element = await rendered.findByTestId('error-message');
      expect(element).toBeInTheDocument();
    });
  });
});
