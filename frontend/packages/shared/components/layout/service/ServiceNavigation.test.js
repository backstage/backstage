import React from 'react';
import { render } from '@testing-library/react';
import ServiceNavigation from './ServiceNavigation';
import { wrapInThemedTestApp } from 'testUtils';
import FeatureFlags from 'shared/apis/featureFlags/featureFlags';

describe('<ServiceNavigation />', () => {
  it('renders without exploding', () => {
    const rendered = render(wrapInThemedTestApp(<ServiceNavigation id="test" repository="a/b" />));
    expect(rendered.getByText('Overview')).toBeInTheDocument();
  });

  it('renders nav items', () => {
    const rendered = render(wrapInThemedTestApp(<ServiceNavigation id="test" repository="a/b" />));
    expect(rendered.getByText('Capacity')).toBeInTheDocument();
    expect(rendered.getByText('CI/CD')).toBeInTheDocument();
    expect(rendered.getByText('Monitoring')).toBeInTheDocument();
    expect(rendered.getByText('API')).toBeInTheDocument();
    expect(rendered.getByText('Service Levels')).toBeInTheDocument();
    expect(rendered.getByText('Service Advisor')).toBeInTheDocument();
    expect(rendered.getByText('Podlinks')).toBeInTheDocument();
    expect(rendered.getByText('Deployments')).toBeInTheDocument();
    expect(rendered.getByText('Secrets')).toBeInTheDocument();
  });

  it('renders source indexer', () => {
    FeatureFlags.enable('source-indexer');
    const rendered = render(wrapInThemedTestApp(<ServiceNavigation id="test" repository="a/b" />));
    expect(rendered.getByText('Java Source Browser')).toBeInTheDocument();
    FeatureFlags.disable('source-indexer');
  });

  it('renders links', () => {
    const rendered = render(wrapInThemedTestApp(<ServiceNavigation id="test" repository="a/b" />));
    const anchor = rendered.container.querySelector('a');
    expect(anchor.href).toContain('services/test');
  });

  it('does not render Cassandra specific plugin', () => {
    const rendered = render(wrapInThemedTestApp(<ServiceNavigation id="test" repository="a/b" />));
    expect(rendered.queryByText('Reaper')).not.toBeInTheDocument();
  });

  it('renders Cassandra specific plugin', () => {
    const rendered = render(wrapInThemedTestApp(<ServiceNavigation id="test-cassandra" repository="a/b" />));
    expect(rendered.getByText('Reaper')).toBeInTheDocument();
  });
});
