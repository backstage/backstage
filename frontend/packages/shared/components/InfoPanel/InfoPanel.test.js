import React from 'react';
import InfoPanel from './InfoPanel';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';

describe('<InfoPanel />', () => {
  it('renders message and actions', () => {
    const { getByText } = render(wrapInThemedTestApp(<InfoPanel message="message" action={<button>click</button>} />));
    expect(getByText('message')).toBeInTheDocument();
    expect(getByText('click')).toBeInTheDocument();
  });
});
