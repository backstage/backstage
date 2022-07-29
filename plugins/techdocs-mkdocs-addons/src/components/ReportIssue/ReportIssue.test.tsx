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

import { TechDocsAddonTester } from '@backstage/plugin-techdocs-addons-test-utils';

import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';

import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { ReportIssue } from '../../plugin';

const byUrl = jest.fn();

const fireSelectionChangeEvent = (window: Window) => {
  const selectionChangeEvent = window.document.createEvent('Event');
  selectionChangeEvent.initEvent('selectionchange', true, true);
  window.document.addEventListener('selectionchange', () => {}, false);
  fireEvent(window.document, selectionChangeEvent);
};

describe('ReportIssue', () => {
  const selection = {
    type: 'Range',
    rangeCount: 1,
    isCollapsed: true,
    getRangeAt: () => ({
      startContainer: 'this is a sentence',
      endContainer: 'this is a sentence',
      startOffset: 1,
      endOffset: 3,
      getBoundingClientRect: () => ({
        right: 100,
        top: 100,
        width: 100,
        height: 100,
      }),
    }),
    toString: () => 'his ',
    containsNode: () => true,
  } as unknown as Selection;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders github link without exploding', async () => {
    byUrl.mockReturnValue({ type: 'github' });
    const { shadowRoot, getByText } =
      await TechDocsAddonTester.buildAddonsInTechDocs([
        <ReportIssue debounceTime={0} />,
      ])
        .withDom(
          <html lang="en">
            <head />
            <body>
              <div data-md-component="content">
                <div data-md-component="navigation" />
                <div data-md-component="toc" />
                <div data-md-component="sidebar" />

                <div data-md-component="main">
                  <div className="md-content">
                    <article>
                      <a
                        title="Leave feedback for this page"
                        href="https://github.com/backstage/backstage/issues/new"
                      >
                        Leave feedback
                      </a>
                      <a
                        title="Edit this page"
                        href="https://github.com/backstage/backstage/edit/master/docs/README.md"
                      >
                        Edit page
                      </a>
                    </article>
                  </div>
                </div>
              </div>
            </body>
          </html>,
        )
        .withApis([[scmIntegrationsApiRef, { byUrl }]])
        .renderWithEffects();

    (shadowRoot as ShadowRoot & Pick<Document, 'getSelection'>).getSelection =
      () => selection;

    await waitFor(() => {
      expect(getByText('Edit page')).toBeInTheDocument();
    });

    fireSelectionChangeEvent(window);

    await waitFor(() => {
      const link = getByText('Open new Github issue');
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/backstage/backstage/issues/new?title=Documentation%20feedback%3A%20his%20&body=%23%23%20Documentation%20Feedback%20%F0%9F%93%9D%0A%0A%20%23%23%23%23%20The%20highlighted%20text%3A%20%0A%0A%20%3E%20his%0A%0A%20%23%23%23%23%20The%20comment%20on%20the%20text%3A%20%0A%20_%3Ereplace%20this%20line%20with%20your%20comment%3C_%0A%0A%20___%0ABackstage%20URL%3A%20%3Chttp%3A%2F%2Flocalhost%2F%3E%20%0AMarkdown%20URL%3A%20%3Chttps%3A%2F%2Fgithub.com%2Fbackstage%2Fbackstage%2Fblob%2Fmaster%2Fdocs%2FREADME.md%3E',
      );
    });
  });

  it('renders gitlab link without exploding', async () => {
    byUrl.mockReturnValue({ type: 'gitlab' });
    const { shadowRoot, getByText } =
      await TechDocsAddonTester.buildAddonsInTechDocs([
        <ReportIssue debounceTime={0} />,
      ])
        .withDom(
          <html lang="en">
            <head />
            <body>
              <div data-md-component="content">
                <div data-md-component="navigation" />
                <div data-md-component="toc" />
                <div data-md-component="sidebar" />

                <div data-md-component="main">
                  <div className="md-content">
                    <article>
                      <a
                        title="Leave feedback for this page"
                        href="https://gitlab.com/backstage/backstage/issues/new"
                      >
                        Leave feedback
                      </a>
                      <a
                        title="Edit this page"
                        href="https://gitlab.com/backstage/backstage/-/edit/master/docs/README.md"
                      >
                        Edit page
                      </a>
                    </article>
                  </div>
                </div>
              </div>
            </body>
          </html>,
        )
        .withApis([[scmIntegrationsApiRef, { byUrl }]])
        .renderWithEffects();

    (shadowRoot as ShadowRoot & Pick<Document, 'getSelection'>).getSelection =
      () => selection;

    await waitFor(() => {
      expect(getByText('Edit page')).toBeInTheDocument();
    });

    fireSelectionChangeEvent(window);

    await waitFor(() => {
      const link = getByText('Open new Gitlab issue');
      expect(link).toHaveAttribute(
        'href',
        'https://gitlab.com/backstage/backstage/issues/new?issue[title]=Documentation%20feedback%3A%20his%20&issue[description]=%23%23%20Documentation%20Feedback%20%F0%9F%93%9D%0A%0A%20%23%23%23%23%20The%20highlighted%20text%3A%20%0A%0A%20%3E%20his%0A%0A%20%23%23%23%23%20The%20comment%20on%20the%20text%3A%20%0A%20_%3Ereplace%20this%20line%20with%20your%20comment%3C_%0A%0A%20___%0ABackstage%20URL%3A%20%3Chttp%3A%2F%2Flocalhost%2F%3E%20%0AMarkdown%20URL%3A%20%3Chttps%3A%2F%2Fgitlab.com%2Fbackstage%2Fbackstage%2F-%2Fblob%2Fmaster%2Fdocs%2FREADME.md%3E',
      );
    });
  });

  it('renders using a custom template builder', async () => {
    byUrl.mockReturnValue({ type: 'gitlab' });

    const templateBuilder = (options: { selection: Selection }) => ({
      title: 'Custom',
      body: options.selection.toString().trim(),
    });

    const { shadowRoot, getByText } =
      await TechDocsAddonTester.buildAddonsInTechDocs([
        <ReportIssue debounceTime={0} templateBuilder={templateBuilder} />,
      ])
        .withDom(
          <html lang="en">
            <head />
            <body>
              <div data-md-component="content">
                <div data-md-component="navigation" />
                <div data-md-component="toc" />
                <div data-md-component="sidebar" />

                <div data-md-component="main">
                  <div className="md-content">
                    <article>
                      <a
                        title="Leave feedback for this page"
                        href="https://gitlab.com/backstage/backstage/issues/new"
                      >
                        Leave feedback
                      </a>
                      <a
                        title="Edit this page"
                        href="https://gitlab.com/backstage/backstage/-/edit/master/docs/README.md"
                      >
                        Edit page
                      </a>
                    </article>
                  </div>
                </div>
              </div>
            </body>
          </html>,
        )
        .withApis([[scmIntegrationsApiRef, { byUrl }]])
        .renderWithEffects();

    (shadowRoot as ShadowRoot & Pick<Document, 'getSelection'>).getSelection =
      () => selection;

    await waitFor(() => {
      expect(getByText('Edit page')).toBeInTheDocument();
    });

    fireSelectionChangeEvent(window);

    await waitFor(() => {
      const link = getByText('Open new Gitlab issue');
      expect(link).toHaveAttribute(
        'href',
        'https://gitlab.com/backstage/backstage/issues/new?issue[title]=Custom&issue[description]=his',
      );
    });
  });
});
