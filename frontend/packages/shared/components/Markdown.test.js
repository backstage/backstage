import React from 'react';
import Markdown from './Markdown';
import { render } from '@testing-library/react';

describe('<Markdown />', () => {
  it('renders empty input correctly', () => {
    const { container } = render(<Markdown />);
    expect(container).toBeEmpty();
  });

  it('renders regular string correctly', () => {
    const { getByText } = render(<Markdown>Regular string</Markdown>);
    expect(getByText('Regular string')).toBeInTheDocument();
  });

  it('renders links', () => {
    const md = 'Hello [link](https://link.com) in md';
    const { getByText, container } = render(<Markdown>{md}</Markdown>);
    expect(container.querySelector('a')).toBeInTheDocument();
    expect(getByText('link')).toBeInTheDocument();
  });

  it('renders heading - h2', () => {
    const md = '## Heading2';
    const { getByText, container } = render(<Markdown>{md}</Markdown>);
    expect(container.querySelector('h2')).toBeInTheDocument();
    expect(getByText('Heading2')).toBeInTheDocument();
  });
});
