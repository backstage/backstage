import React from 'react';
import { cleanup, render } from '@testing-library/react';

import Index from '../pages/index';

afterEach(cleanup);

describe('Index', () => {
  it('Says hello', () => {
    const { queryByText } = render(<Index />);
    expect(queryByText('Hello!')).toBeTruthy();
  });
});
