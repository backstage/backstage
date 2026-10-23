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

import { screen } from '@testing-library/react';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import {
  techdocsApiRef,
  techdocsStorageApiRef,
  TechDocsReaderPageProvider,
} from '@backstage/plugin-techdocs-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { ConfigReader } from '@backstage/config';

import { TechDocsReaderProvider } from '../TechDocsReaderProvider';
import { useTechDocsReaderDom } from './dom';

const useReaderState = jest.fn();
jest.mock('../useReaderState', () => ({
  ...jest.requireActual('../useReaderState'),
  useReaderState: (...args: any[]) => useReaderState(...args),
}));

// The redirect fires from a timer; keep it from navigating after the test. The
// function must be referentially stable, like the real hook's, or the reader's
// effects re-run on every render.
const navigate = jest.fn();
jest.mock('./useNavigateUrl', () => ({
  useNavigateUrl: () => navigate,
}));

const entityRef = { kind: 'component', namespace: 'default', name: 'docs' };

const TechDocsDom = () => {
  const dom = useTechDocsReaderDom(entityRef);
  return <div data-testid="dom">{dom ? 'ready' : 'pending'}</div>;
};

/**
 * Regression test for a crash, "No implementation available for
 * apiRef{core.error}", on any TechDocs page with a meta refresh redirect.
 *
 * The redirect notification is rendered into its own React root, outside of
 * the app's API context, so anything it resolves with `useApi` throws. This
 * renders the real reader hook rather than the transformer in isolation, so it
 * also covers the label being resolved inside the app and passed down.
 */
describe('useTechDocsReaderDom meta redirects', () => {
  beforeEach(() => {
    window.scroll = jest.fn();
    useReaderState.mockReturnValue({
      state: 'cached',
      path: '',
      content:
        '<html><head><meta http-equiv="refresh" content="0; url=../moved"></head><body><h1>Moved</h1></body></html>',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('shows the redirect notification instead of crashing', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            techdocsApiRef,
            {
              getEntityMetadata: jest.fn().mockResolvedValue({
                apiVersion: 'v1',
                kind: 'Component',
                metadata: { name: 'docs', namespace: 'default' },
              }),
              getTechDocsMetadata: jest.fn().mockResolvedValue({}),
            },
          ],
          [
            techdocsStorageApiRef,
            {
              getBaseUrl: jest.fn().mockResolvedValue('http://localhost/'),
              getApiOrigin: jest.fn().mockResolvedValue('http://localhost'),
            },
          ],
          [
            scmIntegrationsApiRef,
            ScmIntegrationsApi.fromConfig(new ConfigReader({})),
          ],
        ]}
      >
        <TechDocsReaderPageProvider entityRef={entityRef}>
          <TechDocsReaderProvider>
            <TechDocsDom />
          </TechDocsReaderProvider>
        </TechDocsReaderPageProvider>
      </TestApiProvider>,
    );

    expect(
      await screen.findByText(
        'This TechDocs page is no longer maintained. Will automatically redirect to the designated replacement.',
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText('Redirect now')).toBeInTheDocument();
  });
});
