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

import { TestRouter, useTestRouter } from '../../testUtils/TestRouter';
import { fireEvent, render, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { BUIProvider } from '../../provider/BUIProvider';
import { ButtonLink } from './ButtonLink';

function LocationStatus() {
  return <span role="status">{useLocation().pathname}</span>;
}

describe('ButtonLink', () => {
  it('renders a disabled destination as a non-link element', () => {
    render(
      <TestRouter
        initialEntries={['/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <ButtonLink href="/catalog/overview" isDisabled>
            Overview
          </ButtonLink>
        </BUIProvider>
      </TestRouter>,
    );

    expect(screen.getByText('Overview').closest('a')).toBeNull();
  });

  it('renders the host href and navigates without a document reload', () => {
    render(
      <TestRouter
        basename="/app"
        initialEntries={['/app/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <ButtonLink href="/catalog/overview">Overview</ButtonLink>
          <LocationStatus />
        </BUIProvider>
      </TestRouter>,
    );

    const link = screen.getByRole('link', { name: 'Overview' });
    expect(link).toHaveAttribute('href', '/app/catalog/overview');
    fireEvent.click(link);
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/overview');
  });

  it('passes router-neutral options to the host through React Aria', () => {
    const navigate = jest.fn();
    render(
      <TestRouter
        basename="/app"
        initialEntries={['/app/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <TrackingProvider navigate={navigate}>
          <ButtonLink
            href="/catalog/overview"
            routerOptions={{ replace: true }}
          >
            Overview
          </ButtonLink>
        </TrackingProvider>
      </TestRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Overview' }));
    expect(navigate).toHaveBeenCalledWith('/catalog/overview', {
      replace: true,
    });
  });
});

function TrackingProvider({
  children,
  navigate,
}: PropsWithChildren<{ navigate: jest.Mock }>) {
  function useRouter() {
    return { ...useTestRouter(), navigate };
  }
  return <BUIProvider useRouter={useRouter}>{children}</BUIProvider>;
}
