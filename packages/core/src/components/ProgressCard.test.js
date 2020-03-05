import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from '../testUtils';

import ProgressCard from './ProgressCard';

const minProps = { title: 'Tingle upgrade', progress: 0.12 };

describe('<ProgressCard />', () => {
  it('renders without exploding', () => {
    const { getByText } = render(
      wrapInThemedTestApp(<ProgressCard {...minProps} />),
    );
    expect(getByText(/Tingle.*/)).toBeInTheDocument();
  });

  it('renders progress and title', () => {
    const { getByText } = render(
      wrapInThemedTestApp(<ProgressCard {...minProps} />),
    );
    expect(getByText(/Tingle.*/)).toBeInTheDocument();
    expect(getByText(/12%.*/)).toBeInTheDocument();
  });

  it('does not render deepLink', () => {
    const { queryByText } = render(
      wrapInThemedTestApp(<ProgressCard {...minProps} />),
    );
    expect(queryByText('View more')).not.toBeInTheDocument();
  });

  it('handles invalid numbers', () => {
    const badProps = { title: 'Tingle upgrade', progress: 'hejjo' };
    const { getByText } = render(
      wrapInThemedTestApp(<ProgressCard {...badProps} />),
    );
    expect(getByText(/N\/A.*/)).toBeInTheDocument();
  });
});
