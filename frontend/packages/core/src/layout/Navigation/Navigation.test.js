import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Navigation, NavItem } from 'shared/components/layout';
import { wrapInThemedTestApp } from 'testUtils';

import { GcpProjectIcon, OverviewIcon } from 'shared/icons';

describe('<Navigation />', () => {
  it('renders without exploding', () => {
    const nav = (
      <Navigation>
        <NavItem title="Overview" icon={<OverviewIcon />} href={'/'} />
        <NavItem title="Projects" icon={<GcpProjectIcon />} href={'/projects'} />
      </Navigation>
    );
    const rendered = render(wrapInThemedTestApp(nav));
    expect(rendered.getByText('Overview')).toBeInTheDocument();
    expect(rendered.getByText('Projects')).toBeInTheDocument();
  });

  it('renders a condenseable navigation bar', () => {
    const nav = (
      <Navigation condensable={true}>
        <NavItem title="Overview" icon={<OverviewIcon />} href={'/'} />
        <NavItem title="Projects" icon={<GcpProjectIcon />} href={'/projects'} />
      </Navigation>
    );
    const rendered = render(wrapInThemedTestApp(nav));
    const btn = rendered.getByTestId('nav-expand-toggle');
    expect(btn).toBeInTheDocument();
  });

  it('is condenseable', () => {
    const nav = (
      <Navigation condensable={true}>
        <NavItem title="Overview" icon={<OverviewIcon />} href={'/'} />
        <NavItem title="Projects" icon={<GcpProjectIcon />} href={'/projects'} />
      </Navigation>
    );
    const rendered = render(wrapInThemedTestApp(nav));
    const btn = rendered.getByTestId('nav-expand-toggle');
    fireEvent.click(btn);
    expect(rendered.queryByText('Overview')).not.toBeInTheDocument();
  });

  it('should have an anchor with correct href', () => {
    const nav = (
      <Navigation>
        <NavItem title="Projects" icon={<GcpProjectIcon />} href={'/projects'} />
      </Navigation>
    );
    const rendered = render(wrapInThemedTestApp(nav));
    const anchor = rendered.container.querySelector('a');
    expect(anchor.href).toBe('http://localhost/projects');
  });
});
