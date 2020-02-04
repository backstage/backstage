import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ErrorLogEntry from './ErrorLogEntry';

describe('<ErrorLogEntry />', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without exploding', () => {
    const rendered = render(<ErrorLogEntry />);
    rendered.getByText('Unknown error');
  });

  it('renders with all props', () => {
    const rendered = render(
      <ErrorLogEntry message="a" error={new Error('b').toString()} timestamp="c" longMessage="d" />,
    );

    expect(rendered.queryByText('a')).toBeInTheDocument();
    expect(rendered.queryByText('Error: b')).not.toBeInTheDocument();
    expect(rendered.queryByText('c')).toBeInTheDocument();
    expect(rendered.queryByText('d')).not.toBeInTheDocument();
  });

  it('renders and expands', () => {
    const rendered = render(<ErrorLogEntry message="a" error="b" longMessage="d" />);

    expect(rendered.queryByText('d')).not.toBeInTheDocument();
    fireEvent.click(rendered.getByText('a'));
    expect(rendered.queryByText('d')).toBeInTheDocument();
  });

  it('copies error to clipboard', () => {
    let selectedText = null;
    let copiedText = null;

    document.onselect = event => {
      const { target } = event;
      selectedText = target.value.slice(target.selectionStart, target.selectionEnd);
    };

    document.execCommand = command => {
      if (command === 'copy') {
        copiedText = selectedText;
      }
    };

    const rendered = render(<ErrorLogEntry message="a" error="b" />);
    expect(copiedText).toBeNull();
    fireEvent.click(rendered.getByLabelText('Copy to clipboard'));
    expect(copiedText).toBe(JSON.stringify({ message: 'a', error: 'b' }));

    document.onselect = null;
    document.execCommand = null;
  });
});
