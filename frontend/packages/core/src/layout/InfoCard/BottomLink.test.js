import React from 'react';
import { render } from '@testing-library/react';
import { wrapInTestApp } from '../../testUtils';
import BottomLink from './BottomLink';

const minProps = {
  title: 'A deepLink title',
  link: '/mocked',
};

describe('<BottomLink />', () => {
  it('renders without exploding', () => {
    const rendered = render(wrapInTestApp(<BottomLink {...minProps} />));
    expect(rendered.getByText('A deepLink title')).toBeInTheDocument();
  });
});
