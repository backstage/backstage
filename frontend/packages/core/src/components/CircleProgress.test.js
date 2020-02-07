import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from '../testUtils';
import CircleProgress from './CircleProgress';
//import { COLORS, V1 } from 'core/app/Themes';

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

  xit('colors the progress correct', () => {
    expect(CircleProgress.getProgressColor()).toBe(V1.palette.textVerySubtle);
    expect(CircleProgress.getProgressColor(10)).toBe(COLORS.STATUS.ERROR);
    expect(CircleProgress.getProgressColor(50)).toBe(COLORS.STATUS.WARNING);
    expect(CircleProgress.getProgressColor(90)).toBe(COLORS.STATUS.OK);
  });
  xit('colors the inverse progress correct', () => {
    expect(CircleProgress.getProgressColor()).toBe(V1.palette.textVerySubtle);
    expect(CircleProgress.getProgressColor(10, true)).toBe(COLORS.STATUS.OK);
    expect(CircleProgress.getProgressColor(50, true)).toBe(
      COLORS.STATUS.WARNING,
    );
    expect(CircleProgress.getProgressColor(90, true)).toBe(COLORS.STATUS.ERROR);
  });
});
