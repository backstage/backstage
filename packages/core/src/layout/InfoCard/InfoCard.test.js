import React from 'react';
import { render } from '@testing-library/react';
import { wrapInTestApp } from '../../testUtils';
import InfoCard from './InfoCard';

const minProps = {
  title: 'Some title',
  deepLink: {
    title: 'A deepLink title',
    link: '/mocked',
  },
};

describe('<InfoCard />', () => {
  it('renders without exploding', () => {
    const rendered = render(wrapInTestApp(<InfoCard {...minProps} />));
    expect(rendered.getByText('Some title')).toBeInTheDocument();
  });

  it('renders a deepLink when prop is set', () => {
    const rendered = render(wrapInTestApp(<InfoCard {...minProps} />));
    expect(rendered.getByText('A deepLink title')).toBeInTheDocument();
  });
});
