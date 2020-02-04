import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';
import CircleProgress from 'shared/components/CircleProgress';
import { colors } from '@backstage/core';

describe('<CircleProgress />', () => {
  it('renders without exploding', () => {
    const { getByText } = render(
      wrapInThemedTestApp(<CircleProgress value={10} fractional={false} />),
    );
    getByText('10%');
  });
  it('handles fractional prop', () => {
    const { getByText } = render(
      wrapInThemedTestApp(<CircleProgress value={0.1} fractional={true} />),
    );
    getByText('10%');
  });
  it('handles max prop', () => {
    const { getByText } = render(
      wrapInThemedTestApp(
        <CircleProgress value={1} max={10} fractional={false} />,
      ),
    );
    getByText('1%');
  });
  it('handles unit prop', () => {
    const { getByText } = render(
      wrapInThemedTestApp(
        <CircleProgress value={10} fractional={false} unit="m" />,
      ),
    );
    getByText('10m');
  });
  it('colors the progress correct', () => {
    expect(CircleProgress.getProgressColor()).toBe(
      colors.VERY_SUBTLE_TEXT_COLOR,
    );
    expect(CircleProgress.getProgressColor(10)).toBe(colors.STATUS.ERROR);
    expect(CircleProgress.getProgressColor(50)).toBe(colors.STATUS.WARNING);
    expect(CircleProgress.getProgressColor(90)).toBe(colors.STATUS.OK);
  });
  it('colors the inverse progress correct', () => {
    expect(CircleProgress.getProgressColor()).toBe(
      colors.VERY_SUBTLE_TEXT_COLOR,
    );
    expect(CircleProgress.getProgressColor(10, true)).toBe(colors.STATUS.OK);
    expect(CircleProgress.getProgressColor(50, true)).toBe(
      colors.STATUS.WARNING,
    );
    expect(CircleProgress.getProgressColor(90, true)).toBe(colors.STATUS.ERROR);
  });
});
