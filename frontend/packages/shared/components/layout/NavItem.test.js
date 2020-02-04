import React from 'react';
import { matchPath } from 'react-router';
import { fireEvent, render } from '@testing-library/react';

import NavItem from 'shared/components/layout/NavItem';
import { wrapInThemedTestApp } from 'testUtils';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  matchPath: jest.fn(),
}));

const minProps = {
  title: 'A link title',
  href: '/mocked',
};

const minChildProps = {
  title: 'A child title',
  href: '/child',
};

describe('<NavLink />', () => {
  it('renders without exploding', () => {
    const rendered = render(wrapInThemedTestApp(<NavItem {...minProps} />));
    expect(rendered.getByText('A link title')).toBeInTheDocument();
  });

  it('should have an anchor with correct href', () => {
    const rendered = render(wrapInThemedTestApp(<NavItem {...minProps} />));
    const anchor = rendered.container.querySelector('a');
    expect(anchor.href).toBe('http://localhost/mocked');
  });

  it('renders with icon src', () => {
    const rendered = render(wrapInThemedTestApp(<NavItem icon="mocked-icon.png" {...minProps} />));
    const icon = rendered.getByAltText('A link title');
    expect(icon.src).toBe('http://localhost/mocked-icon.png');
  });

  it('renders with icon component', () => {
    const Falafel = () => <div>falafel</div>;
    const rendered = render(wrapInThemedTestApp(<NavItem icon={<Falafel />} {...minProps} />));
    const icon = rendered.getByText('falafel');
    expect(icon).toBeInTheDocument();
  });

  it('shows alpha icon', () => {
    const rendered = render(wrapInThemedTestApp(<NavItem isAlpha {...minProps} />));
    expect(rendered.getByText('α')).toBeInTheDocument();
  });

  it('shows beta icon', () => {
    const rendered = render(wrapInThemedTestApp(<NavItem isBeta {...minProps} />));
    expect(rendered.getByText('β')).toBeInTheDocument();
  });

  it('renders nested navigation without exploding', () => {
    const { getByText, getByTestId } = render(
      wrapInThemedTestApp(
        <NavItem {...minProps}>
          <NavItem {...minChildProps} />
        </NavItem>,
      ),
    );
    expect(getByText('A link title')).toBeInTheDocument();
    expect(getByTestId('expand-toggle')).toBeInTheDocument();
  });

  it('toggles nested navigation', () => {
    const { getByText, getByTestId, queryByText } = render(
      wrapInThemedTestApp(
        <NavItem {...minProps}>
          <NavItem {...minChildProps} />
        </NavItem>,
      ),
    );
    expect(queryByText('A child link')).not.toBeInTheDocument();
    fireEvent.click(getByTestId('expand-toggle'));
    expect(getByText('A child title')).toBeInTheDocument();
  });

  it('shows nested navigation automatically if the child is active', () => {
    matchPath.mockReturnValue(true);
    const { getByText } = render(
      wrapInThemedTestApp(
        <NavItem {...minProps}>
          <NavItem {...minChildProps} />
        </NavItem>,
      ),
    );
    expect(getByText('A link title')).toBeInTheDocument();
    expect(getByText('A child title')).toBeInTheDocument();
  });
});
