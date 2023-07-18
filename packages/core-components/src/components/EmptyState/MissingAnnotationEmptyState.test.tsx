/*
 * Copyright 2023 The Backstage Authors
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
import { render } from '@testing-library/react';
import {
  MissingAnnotationEmptyState,
  LinkContext,
} from './MissingAnnotationEmptyState';

describe('MissingAnnotationEmptyState', () => {
  const contextLinks = { test: 'http://test.link' };
  it('renders the component with special readMoreUrl', () => {
    const annotation = 'backstage.io/test';
    const readMoreUrl = 'https://example.com';
    const { getByText } = render(
      <LinkContext.Provider value={contextLinks}>
        <MissingAnnotationEmptyState
          annotation={annotation}
          readMoreUrl={readMoreUrl}
        />
      </LinkContext.Provider>,
    );
    expect(getByText('Missing Annotation')).toBeInTheDocument();
    expect(getByText('Read more').parentElement).toHaveAttribute(
      'href',
      readMoreUrl,
    );
  });

  it('renders the component with special readMoreUrlKey which not existed in context', () => {
    const annotation = 'backstage.io/test';
    const readMoreUrl = 'https://example.com';
    const { getByText } = render(
      <LinkContext.Provider value={contextLinks}>
        <MissingAnnotationEmptyState
          annotation={annotation}
          readMoreUrl={readMoreUrl}
          readMoreUrlKey="not-exist"
        />
      </LinkContext.Provider>,
    );

    expect(getByText('Missing Annotation')).toBeInTheDocument();
    expect(getByText('Read more').parentElement).toHaveAttribute(
      'href',
      readMoreUrl,
    );
  });

  it('renders the component with special readMoreUrlKey which existed in context', () => {
    const annotation = 'backstage.io/test';
    const readMoreUrl = 'https://example.com';
    const { getByText } = render(
      <LinkContext.Provider value={contextLinks}>
        <MissingAnnotationEmptyState
          annotation={annotation}
          readMoreUrl={readMoreUrl}
          readMoreUrlKey="test"
        />
      </LinkContext.Provider>,
    );

    expect(getByText('Missing Annotation')).toBeInTheDocument();
    expect(getByText('Read more').parentElement).toHaveAttribute(
      'href',
      contextLinks.test,
    );
  });
});
