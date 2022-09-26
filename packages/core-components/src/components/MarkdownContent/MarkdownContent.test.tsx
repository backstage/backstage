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

import React from 'react';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import { MarkdownContent } from './MarkdownContent';

describe('<MarkdownContent />', () => {
  it('render MarkdownContent component', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <MarkdownContent content={'# H1\n' + '## H2\n' + '### H3'} />,
      ),
    );
    expect(rendered.getByText('H1', { selector: 'h1' })).toBeInTheDocument();
    expect(rendered.getByText('H2', { selector: 'h2' })).toBeInTheDocument();
    expect(rendered.getByText('H3', { selector: 'h3' })).toBeInTheDocument();
  });

  it('render MarkdownContent component with GitHub flavored Markdown dialect', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(<MarkdownContent content="https://example.com" />),
    );
    expect(
      rendered.getByText('https://example.com', { selector: 'a' }),
    ).toBeInTheDocument();
  });

  it('Render MarkdownContent component with common mark dialect', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <MarkdownContent content="https://example.com" dialect="common-mark" />,
      ),
    );
    expect(
      rendered.getByText('https://example.com', { selector: 'p' }),
    ).toBeInTheDocument();
  });

  it('render MarkdownContent component with CodeSnippet for code blocks', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <MarkdownContent content={'```typescript\njest(test: string);\n```'} />,
      ),
    );
    const fp1 = await rendered.findByText('jest(test:', { selector: 'span' });
    expect(fp1).toBeInTheDocument();
    const fp2 = rendered.getByText('string', { selector: 'span' });
    expect(fp2).toBeInTheDocument();
    expect(rendered.getByText(');', { selector: 'span' })).toBeInTheDocument();
  });

  it('render MarkdownContent component with transformed link', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <MarkdownContent
          content="[Title](https://backstage.io/link)"
          transformLinkUri={href => {
            return `${href}-modified`;
          }}
        />,
      ),
    );
    const fp1 = rendered.getByText('Title', {
      selector: 'a',
    });
    expect(fp1).toBeInTheDocument();
    expect(fp1.getAttribute('href')).toEqual(
      'https://backstage.io/link-modified',
    );
  });

  it('render MarkdownContent component with transformed image', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <MarkdownContent
          content="![Image](https://backstage.io/blog/assets/6/header.png)"
          transformImageUri={() => {
            return `https://example.com/blog/assets/6/header.png`;
          }}
        />,
      ),
    );
    const fp1 = rendered.getByAltText('Image');
    expect(fp1).toBeInTheDocument();
    expect(fp1.getAttribute('src')).toEqual(
      'https://example.com/blog/assets/6/header.png',
    );
  });

  it('render MarkdownContent component with headings given proper ids', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <MarkdownContent
          content={
            '# Lorem ipsum\n' +
            '## bing bong\n' +
            '### The FitnessGram Pacer Test is a multistage aerobic capacity test'
          }
        />,
      ),
    );

    expect(rendered.getByText('Lorem ipsum').getAttribute('id')).toEqual(
      'lorem-ipsum',
    );
    expect(rendered.getByText('bing bong').getAttribute('id')).toEqual(
      'bing-bong',
    );
    expect(
      rendered
        .getByText(
          'The FitnessGram Pacer Test is a multistage aerobic capacity test',
        )
        .getAttribute('id'),
    ).toEqual(
      'the-fitnessgram-pacer-test-is-a-multistage-aerobic-capacity-test',
    );
  });
});
