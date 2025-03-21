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

import { CodeSnippet } from './CodeSnippet';

const JAVASCRIPT = `
  const greeting = "Hello";
  const world = "World";
  const greet = person => gretting + " " + person + "!";
`;

const minProps = {
  text: JAVASCRIPT,
  language: 'javascript',
};

describe('<CodeSnippet />', () => {
  // react-syntax-highlighter is large and can cause significant slowdowns
  // This test makes sure we're loading things in asynchronously and not too broadly.
  it('renders quickly', async () => {
    const start = new Date();
    await renderInTestApp(<CodeSnippet text="" language="javascript" />);
    const end = new Date();

    expect(end.getTime() - start.getTime()).toBeLessThanOrEqual(1000);
  }, 1500);

  it('renders text without exploding', async () => {
    const { getByText } = await renderInTestApp(<CodeSnippet {...minProps} />);
    expect(getByText(/"Hello"/)).toBeInTheDocument();
    expect(getByText(/"World"/)).toBeInTheDocument();
  });

  it('renders without line numbers', async () => {
    const { queryByText } = await renderInTestApp(
      <CodeSnippet {...minProps} />,
    );
    expect(queryByText('1')).not.toBeInTheDocument();
    expect(queryByText('2')).not.toBeInTheDocument();
    expect(queryByText('3')).not.toBeInTheDocument();
  });

  it('renders with line numbers', async () => {
    const { getByText } = await renderInTestApp(
      <CodeSnippet {...minProps} showLineNumbers />,
    );
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
  });
});
