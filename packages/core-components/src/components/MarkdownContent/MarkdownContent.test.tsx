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
import { renderInTestApp } from '@backstage/test-utils';
import { MarkdownContent } from './MarkdownContent';
import { screen } from '@testing-library/react';

describe('<MarkdownContent />', () => {
  it('render MarkdownContent component', async () => {
    await renderInTestApp(
      <MarkdownContent content={'# H1\n' + '## H2\n' + '### H3'} />,
    );
    expect(screen.getByText('H1', { selector: 'h1' })).toBeInTheDocument();
    expect(screen.getByText('H2', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByText('H3', { selector: 'h3' })).toBeInTheDocument();
  });

  it('render MarkdownContent component with GitHub flavored Markdown dialect', async () => {
    await renderInTestApp(<MarkdownContent content="https://example.com" />);
    expect(
      screen.getByText('https://example.com', { selector: 'a' }),
    ).toBeInTheDocument();
  });

  it('Render MarkdownContent component with common mark dialect', async () => {
    await renderInTestApp(
      <MarkdownContent content="https://example.com" dialect="common-mark" />,
    );
    expect(
      screen.getByText('https://example.com', { selector: 'p' }),
    ).toBeInTheDocument();
  });

  it('Render MarkdownContent component without custom class', async () => {
    await renderInTestApp(
      <MarkdownContent content="https://example.com" dialect="common-mark" />,
    );
    const content = screen.getByText('https://example.com', { selector: 'p' });

    expect(
      Array.from(content.parentElement?.classList?.values() ?? []).map(cls =>
        cls.replace(/-\d+$/, ''),
      ),
    ).toEqual(['BackstageMarkdownContent-markdown']);
  });

  it('Render MarkdownContent component with custom class', async () => {
    await renderInTestApp(
      <MarkdownContent
        content="https://example.com"
        dialect="common-mark"
        className="custom-class"
      />,
    );
    const content = screen.getByText('https://example.com', { selector: 'p' });

    expect(
      Array.from(content.parentElement?.classList?.values() ?? []).map(cls =>
        cls.replace(/-\d+$/, ''),
      ),
    ).toEqual(['BackstageMarkdownContent-markdown', 'custom-class']);
  });

  it('render MarkdownContent component with CodeSnippet for code blocks', async () => {
    await renderInTestApp(
      <MarkdownContent content={'```typescript\njest(test: string);\n```'} />,
    );
    const fp1 = await screen.findByText('jest(test:', { selector: 'span' });
    expect(fp1).toBeInTheDocument();
    const fp2 = screen.getByText('string', { selector: 'span' });
    expect(fp2).toBeInTheDocument();
    expect(screen.getByText(');', { selector: 'span' })).toBeInTheDocument();
  });

  it('render MarkdownContent component with transformed link', async () => {
    await renderInTestApp(
      <MarkdownContent
        content="[Title](https://backstage.io/link)"
        transformLinkUri={href => {
          return `${href}-modified`;
        }}
      />,
    );
    const fp1 = screen.getByText('Title', {
      selector: 'a',
    });
    expect(fp1).toBeInTheDocument();
    expect(fp1.getAttribute('href')).toEqual(
      'https://backstage.io/link-modified',
    );
  });

  it('render MarkdownContent component with transformed image', async () => {
    await renderInTestApp(
      <MarkdownContent
        content="![Image](https://backstage.io/blog/assets/6/header.png)"
        transformImageUri={() => {
          return `https://example.com/blog/assets/6/header.png`;
        }}
      />,
    );
    const fp1 = screen.getByAltText('Image');
    expect(fp1).toBeInTheDocument();
    expect(fp1.getAttribute('src')).toEqual(
      'https://example.com/blog/assets/6/header.png',
    );
  });

  it('render MarkdownContent component with link target set to _blank', async () => {
    await renderInTestApp(
      <MarkdownContent
        content="Take a look at the [README](https://github.com/backstage/backstage/blob/master/README.md) file."
        linkTarget="_blank"
      />,
    );
    const readme = screen.getByText('README', {
      selector: 'a',
    });
    expect(readme).toBeInTheDocument();
    expect(readme.getAttribute('href')).toEqual(
      'https://github.com/backstage/backstage/blob/master/README.md',
    );
    expect(readme.getAttribute('target')).toEqual('_blank');
  });

  it('render MarkdownContent component with headings given proper ids', async () => {
    await renderInTestApp(
      <MarkdownContent
        content={
          '# Lorem ipsum\n' +
          '## bing bong\n' +
          '### The FitnessGram Pacer Test is a multistage aerobic capacity test'
        }
      />,
    );

    expect(screen.getByText('Lorem ipsum').getAttribute('id')).toEqual(
      'lorem-ipsum',
    );
    expect(screen.getByText('bing bong').getAttribute('id')).toEqual(
      'bing-bong',
    );
    expect(
      screen
        .getByText(
          'The FitnessGram Pacer Test is a multistage aerobic capacity test',
        )
        .getAttribute('id'),
    ).toEqual(
      'the-fitnessgram-pacer-test-is-a-multistage-aerobic-capacity-test',
    );
  });
});
