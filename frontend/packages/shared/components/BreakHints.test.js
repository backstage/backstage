import React from 'react';
import { render } from '@testing-library/react';
import BreakHints from './BreakHints';

describe('BreakHints', () => {
  it('Inserts wbr tags in camelCase expressions', () => {
    const { container } = render(<BreakHints body="aCamelCaseWord" />);
    expect(container.innerHTML).toBe('a<wbr>Camel<wbr>Case<wbr>Word');
  });

  it('Inserts wbr tags with periods', () => {
    const { container } = render(<BreakHints body="a.b" />);
    expect(container.innerHTML).toBe('a<wbr>.b');
  });

  it('Inserts wbr tags with underscores', () => {
    const { container } = render(<BreakHints body="a_b" />);
    expect(container.innerHTML).toBe('a<wbr>_b');
  });

  it('Inserts wbr tags with hyphens', () => {
    const { container } = render(<BreakHints body="a-b" />);
    expect(container.innerHTML).toBe('a<wbr>-b');
  });

  it('Inserts wbr tags with forward slashes', () => {
    const { container } = render(<BreakHints body="a/b/c" />);
    expect(container.innerHTML).toBe('a<wbr>/b<wbr>/c');
  });
});
