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

import { TechDocsRenamedNotice } from './TechDocsRenamedNotice';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';

let mockLocationState: unknown;

jest.mock('react-router-dom', () => {
  const actualModule = jest.requireActual('react-router-dom');
  return {
    ...actualModule,
    useLocation: () => ({
      pathname: '/docs/default/component/new-name/guides',
      search: '',
      hash: '#install',
      state: mockLocationState,
    }),
  };
});

describe('<TechDocsRenamedNotice />', () => {
  afterEach(() => {
    mockLocationState = undefined;
  });

  describe('with a former entity ref in the location state', () => {
    it('shows the rename notice and hides it when dismissed', async () => {
      mockLocationState = { formerEntityRef: 'component:default/old-name' };

      await renderInTestApp(<TechDocsRenamedNotice />);

      expect(
        await screen.findByText(
          'This entity was renamed from component:default/old-name',
        ),
      ).toBeInTheDocument();

      const dismiss = await screen.findByText('Dismiss');
      expect(dismiss).toBeInTheDocument();

      fireEvent.click(dismiss);

      await waitFor(() => {
        expect(
          screen.queryByText(
            'This entity was renamed from component:default/old-name',
          ),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('without a usable former entity ref', () => {
    it('renders nothing without a former entity ref in the location state', async () => {
      for (const state of [undefined, { formerEntityRef: 42 }]) {
        mockLocationState = state;

        const { unmount } = await renderInTestApp(<TechDocsRenamedNotice />);

        expect(
          screen.queryByText(/This entity was renamed from/),
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();

        unmount();
      }
    });
  });
});
