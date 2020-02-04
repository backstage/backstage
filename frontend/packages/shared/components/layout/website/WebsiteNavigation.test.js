import React from 'react';
import { render } from '@testing-library/react';
import WebsiteNavigation from './WebsiteNavigation';
import { wrapInThemedTestApp } from 'testUtils';

describe('<WebsiteNavigation />', () => {
  it('renders without exploding', () => {
    const rendered = render(wrapInThemedTestApp(<WebsiteNavigation id="test" />));
    expect(rendered.getByText('Overview')).toBeInTheDocument();
  });

  it('renders nav items', () => {
    const rendered = render(wrapInThemedTestApp(<WebsiteNavigation id="test" />));
    expect(rendered.getByText('Capacity')).toBeInTheDocument();
    expect(rendered.getByText('CI/CD')).toBeInTheDocument();
    expect(rendered.getByText('Deployments')).toBeInTheDocument();
    expect(rendered.getByText('Secrets')).toBeInTheDocument();
  });

  it('renders links', () => {
    const rendered = render(wrapInThemedTestApp(<WebsiteNavigation id="test" />));
    const anchor = rendered.container.querySelector('a');
    expect(anchor.href).toContain('websites/test');
  });
});
