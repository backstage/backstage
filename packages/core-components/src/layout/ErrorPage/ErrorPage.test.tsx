/*
 * Copyright 2020 The Backstage Authors
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

import { fireEvent } from '@testing-library/react';
import { navigationControllerApiRef } from '@backstage/frontend-plugin-api';
import { createMockNavigationController } from '@backstage/frontend-test-utils';
import { ErrorPage } from './ErrorPage';
import { Link } from '../../components/Link';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('<ErrorPage/>', () => {
  it('should render with status code, status message and go back link', async () => {
    const { getByText, getByTestId } = await renderInTestApp(
      <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />,
    );
    expect(getByText(/page not found/i)).toBeInTheDocument();
    expect(getByText(/404/i)).toBeInTheDocument();
    expect(
      getByText(/looks like someone dropped the mic!/i),
    ).toBeInTheDocument();
    expect(getByTestId('go-back-link')).toBeInTheDocument();
  });

  it('should render with additional information of type string', async () => {
    const { getByText } = await renderInTestApp(
      <ErrorPage
        status="404"
        statusMessage="PAGE NOT FOUND"
        additionalInfo="This is a string based additional information"
      />,
    );
    expect(
      getByText(/looks like someone dropped the mic!/i),
    ).toBeInTheDocument();
    expect(
      getByText(/This is a string based additional information/i),
    ).toBeInTheDocument();
  });

  it('should render with additional information including link', async () => {
    const { getByText } = await renderInTestApp(
      <ErrorPage
        status="404"
        statusMessage="PAGE NOT FOUND"
        additionalInfo={
          <>
            This is some additional information including{' '}
            <Link to="/test">a link</Link>
          </>
        }
      />,
    );
    expect(
      getByText(/looks like someone dropped the mic!/i),
    ).toBeInTheDocument();
    expect(getByText(/a link/i)).toBeInTheDocument();
    expect(getByText(/a link/i)).toHaveAttribute('href', '/test');
  });

  it('should render with default support url if supportUrl is not provided', async () => {
    const { getByText } = await renderInTestApp(
      <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />,
    );
    expect(
      getByText(/looks like someone dropped the mic!/i),
    ).toBeInTheDocument();
    expect(getByText(/contact support/i)).toBeInTheDocument();
    expect(getByText(/contact support/i)).toHaveAttribute(
      'href',
      'https://github.com/backstage/backstage/issues',
    );
  });

  it('should override support url if supportUrl property is provided', async () => {
    const { getByText } = await renderInTestApp(
      <ErrorPage
        status="404"
        statusMessage="PAGE NOT FOUND"
        supportUrl="https://error-page-test-support-url.com"
      />,
    );
    expect(
      getByText(/looks like someone dropped the mic!/i),
    ).toBeInTheDocument();
    expect(getByText(/contact support/i)).toBeInTheDocument();
    expect(getByText(/contact support/i)).toHaveAttribute(
      'href',
      'https://error-page-test-support-url.com',
    );
  });

  it('should render show details if stack is provided', async () => {
    const { getByText } = await renderInTestApp(
      <ErrorPage
        status="500"
        statusMessage="INTERNAL ERROR"
        stack="this is my stack trace!"
      />,
    );
    expect(getByText(/Show more details/i)).toBeInTheDocument();
  });

  describe('go back link', () => {
    beforeEach(() => {
      mockNavigate.mockClear();
    });

    it('calls react-router navigate(-1) when no navigation controller is registered (OFS)', async () => {
      const { getByTestId } = await renderInTestApp(
        <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />,
      );

      fireEvent.click(getByTestId('go-back-link'));

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('calls the navigation controller go(-1) instead of react-router when one is registered (NFS)', async () => {
      const go = jest.fn();
      const navigationController = createMockNavigationController({ go });

      const { getByTestId } = await renderInTestApp(
        <TestApiProvider
          apis={[[navigationControllerApiRef, navigationController]]}
        >
          <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />
        </TestApiProvider>,
      );

      fireEvent.click(getByTestId('go-back-link'));

      expect(go).toHaveBeenCalledWith(-1);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
