import React from 'react';
import { render, cleanup } from '@testing-library/react';
import isEmpty from './isEmpty';

describe('isEmpty', () => {
  const Wrapped = isEmpty(
    { title: 'a-title', helperText: 'help', bottomText: 'bottom' },
    props => props.a,
  )(() => <div data-testid="wrapped" />);

  it('should show empty state', () => {
    render(<Wrapped a={false} />).getByTestId('empty');
    cleanup();
    render(<Wrapped a={[]} />).getByTestId('empty');
    cleanup();
    render(<Wrapped a="" />).getByTestId('empty');
    cleanup();
    render(<Wrapped a={null} />).getByTestId('empty');
    cleanup();
    render(<Wrapped a={undefined} />).getByTestId('empty');
    cleanup();
    render(<Wrapped a={NaN} />).getByTestId('empty');
    cleanup();
    render(<Wrapped />).getByTestId('empty');
    cleanup();
    render(<Wrapped a={0} />).getByTestId('empty');
    cleanup();
  });

  it('should not show empty state', () => {
    render(<Wrapped a />).getByTestId('wrapped');
    cleanup();
    render(<Wrapped a={['']} />).getByTestId('wrapped');
    cleanup();
    render(<Wrapped a="0" />).getByTestId('wrapped');
    cleanup();
    render(<Wrapped a={{}} />).getByTestId('wrapped');
    cleanup();
    render(<Wrapped a={Infinity} />).getByTestId('wrapped');
    cleanup();
    render(<Wrapped a={1} />).getByTestId('wrapped');
    cleanup();
  });
});
