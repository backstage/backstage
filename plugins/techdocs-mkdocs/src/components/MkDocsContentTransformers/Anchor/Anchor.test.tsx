/*
 * Copyright 2021 The Backstage Authors
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

// the import order matters, should be the first
import { createDom } from '../../../test-utils';

import React from 'react';
import { render, waitFor } from '@testing-library/react';

import {
  techdocsStorageApiRef,
  TechDocsShadowDomProvider,
} from '@backstage/plugin-techdocs';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';

import { AnchorTransformer } from './Anchor';

const navigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const byUrl = jest.fn().mockReturnValue({ type: 'github' });
const scmIntegrationsApiMock = { byUrl };

const baseUrl = 'http://localhost:7000/docs/backstage';
const getBaseUrl = jest.fn().mockResolvedValue(baseUrl);
const techdocsStorageApiMock = { getBaseUrl };

describe('Link', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should add target blank for external links', async () => {
    const dom = createDom(
      <body>
        <a href="https://example.com/docs">Docs</a>
      </body>,
    );

    render(
      wrapInTestApp(
        <TestApiProvider
          apis={[
            [techdocsStorageApiRef, techdocsStorageApiMock],
            [scmIntegrationsApiRef, scmIntegrationsApiMock],
          ]}
        >
          <TechDocsShadowDomProvider dom={dom}>
            <AnchorTransformer />
          </TechDocsShadowDomProvider>
        </TestApiProvider>,
      ),
    );

    await waitFor(() => {
      expect(dom.querySelector('a')?.getAttribute('target')).toBe('_blank');
    });
  });

  describe('href', () => {
    it('Should replace relative path with the location origin', async () => {
      const dom = createDom(
        <body>
          <a href="/docs/backstage">Backstage</a>
        </body>,
      );

      render(
        wrapInTestApp(
          <TestApiProvider
            apis={[
              [techdocsStorageApiRef, techdocsStorageApiMock],
              [scmIntegrationsApiRef, scmIntegrationsApiMock],
            ]}
          >
            <TechDocsShadowDomProvider dom={dom}>
              <AnchorTransformer />
            </TechDocsShadowDomProvider>
          </TestApiProvider>,
        ),
      );

      await waitFor(() => {
        expect(dom.querySelector('a')?.getAttribute('href')).toBe(
          'http://localhost/docs/backstage',
        );
      });
    });

    it('Should replace relative path with the base URL', async () => {
      const dom = createDom(
        <body>
          <a href="/docs/backstage" download>
            Backstage
          </a>
        </body>,
      );

      render(
        wrapInTestApp(
          <TestApiProvider
            apis={[
              [techdocsStorageApiRef, techdocsStorageApiMock],
              [scmIntegrationsApiRef, scmIntegrationsApiMock],
            ]}
          >
            <TechDocsShadowDomProvider dom={dom}>
              <AnchorTransformer />
            </TechDocsShadowDomProvider>
          </TestApiProvider>,
        ),
      );

      await waitFor(() => {
        expect(dom.querySelector('a')?.getAttribute('href')).toBe(baseUrl);
      });
    });
  });

  describe('addEventListener', () => {
    it('Should call handler when a link has been clicked', async () => {
      const href = 'http://localhost:3000/docs/backstage#overview';
      const dom = await createDom(
        <body>
          <a href={href}>Link</a>
        </body>,
      );

      render(
        wrapInTestApp(
          <TestApiProvider
            apis={[
              [techdocsStorageApiRef, techdocsStorageApiMock],
              [scmIntegrationsApiRef, scmIntegrationsApiMock],
            ]}
          >
            <TechDocsShadowDomProvider dom={dom}>
              <AnchorTransformer />
            </TechDocsShadowDomProvider>
          </TestApiProvider>,
        ),
      );

      await waitFor(() => {
        expect(dom.querySelector('a')?.getAttribute('href')).toBe(href);
      });

      dom.querySelector('a')?.click();

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('/docs/backstage#overview');
      });
    });

    it('Should not call handler when a link has a download attribute', async () => {
      const href = 'http://localhost:3000/file.pdf';
      const dom = await createDom(
        <body>
          <a href={href} download>
            Link
          </a>
        </body>,
      );

      render(
        wrapInTestApp(
          <TestApiProvider
            apis={[
              [techdocsStorageApiRef, techdocsStorageApiMock],
              [scmIntegrationsApiRef, scmIntegrationsApiMock],
            ]}
          >
            <TechDocsShadowDomProvider dom={dom}>
              <AnchorTransformer />
            </TechDocsShadowDomProvider>
          </TestApiProvider>,
        ),
      );

      await waitFor(() => {
        expect(dom.querySelector('a')?.getAttribute('href')).toBe(href);
      });

      dom.querySelector('a')?.click();

      await waitFor(() => {
        expect(navigate).not.toHaveBeenCalled();
      });
    });

    it('Should not call handler when a link links to another baseUrl', async () => {
      const href = 'http://example:3000/file.pdf';
      const dom = await createDom(
        <body>
          <a href={href} download>
            File
          </a>
        </body>,
      );

      render(
        wrapInTestApp(
          <TestApiProvider
            apis={[
              [techdocsStorageApiRef, techdocsStorageApiMock],
              [scmIntegrationsApiRef, scmIntegrationsApiMock],
            ]}
          >
            <TechDocsShadowDomProvider dom={dom}>
              <AnchorTransformer />
            </TechDocsShadowDomProvider>
          </TestApiProvider>,
        ),
      );

      await waitFor(() => {
        expect(dom.querySelector('a')?.getAttribute('href')).toBe(href);
      });

      dom.querySelector('a')?.click();

      await waitFor(() => {
        expect(navigate).not.toHaveBeenCalled();
      });
    });
  });

  describe('FeedbackLink', () => {
    it('adds a feedback link correctly when a Gitlab source edit link is available', async () => {
      byUrl.mockReturnValue({ type: 'gitlab' });
      const dom = createDom(
        <article>
          <h1>Title</h1>
          <a
            title="Edit this page"
            href="https://gitlab.com/backstage/backstage/-/blob/master/docs/index.md"
          >
            Edit
          </a>
        </article>,
      );

      render(
        wrapInTestApp(
          <TestApiProvider
            apis={[
              [techdocsStorageApiRef, techdocsStorageApiMock],
              [scmIntegrationsApiRef, scmIntegrationsApiMock],
            ]}
          >
            <TechDocsShadowDomProvider dom={dom}>
              <AnchorTransformer />
            </TechDocsShadowDomProvider>
          </TestApiProvider>,
        ),
      );

      await waitFor(() => {
        expect(dom.querySelector('#git-feedback-link a')).toHaveAttribute(
          'href',
          'https://gitlab.com/backstage/backstage/issues/new?issue[title]=Documentation%20Feedback%3A%20Title&issue[description]=Page%20source%3A%0Ahttps%3A%2F%2Fgitlab.com%2Fbackstage%2Fbackstage%2F-%2Fblob%2Fmaster%2Fdocs%2Findex.md%0A%0AFeedback%3A',
        );
      });
    });

    it('adds a feedback link when a Github source edit link is available', async () => {
      byUrl.mockReturnValue({ type: 'github' });
      const dom = createDom(
        <article>
          <h1>Title</h1>
          <a
            title="Edit this page"
            href="https://github.com/backstage/backstage/edit/master/docs/index.md"
          >
            Edit
          </a>
        </article>,
      );

      render(
        wrapInTestApp(
          <TestApiProvider
            apis={[
              [techdocsStorageApiRef, techdocsStorageApiMock],
              [scmIntegrationsApiRef, scmIntegrationsApiMock],
            ]}
          >
            <TechDocsShadowDomProvider dom={dom}>
              <AnchorTransformer />
            </TechDocsShadowDomProvider>
          </TestApiProvider>,
        ),
      );

      await waitFor(() => {
        expect(dom.querySelector('#git-feedback-link a')).toHaveAttribute(
          'href',
          'https://github.com/backstage/backstage/issues/new?title=Documentation%20Feedback%3A%20Title&body=Page%20source%3A%0Ahttps%3A%2F%2Fgithub.com%2Fbackstage%2Fbackstage%2Fedit%2Fmaster%2Fdocs%2Findex.md%0A%0AFeedback%3A',
        );
      });
    });

    it('does not add a feedback link when no source edit link is available', async () => {
      const dom = createDom(
        <article>
          <h1>Title</h1>
        </article>,
      );

      render(
        wrapInTestApp(
          <TestApiProvider
            apis={[
              [techdocsStorageApiRef, techdocsStorageApiMock],
              [scmIntegrationsApiRef, scmIntegrationsApiMock],
            ]}
          >
            <TechDocsShadowDomProvider dom={dom}>
              <AnchorTransformer />
            </TechDocsShadowDomProvider>
          </TestApiProvider>,
        ),
      );

      await waitFor(() => {
        expect(dom.querySelector('#git-feedback-link a')).toBeNull();
      });
    });

    it('does not add a feedback link when a Gitlab or Github source edit link is not available', async () => {
      byUrl.mockReturnValue({ type: 'bitbucket' });
      const dom = createDom(
        <article>
          <h1>Title</h1>
          <a
            title="Edit this page"
            href="https://bitbucket.com/backstage/backstage/edit/master/docs/index.md"
          >
            Edit
          </a>
        </article>,
      );

      render(
        wrapInTestApp(
          <TestApiProvider
            apis={[
              [techdocsStorageApiRef, techdocsStorageApiMock],
              [scmIntegrationsApiRef, scmIntegrationsApiMock],
            ]}
          >
            <TechDocsShadowDomProvider dom={dom}>
              <AnchorTransformer />
            </TechDocsShadowDomProvider>
          </TestApiProvider>,
        ),
      );

      await waitFor(() => {
        expect(dom.querySelector('#git-feedback-link a')).toBeNull();
      });
    });
  });
});
