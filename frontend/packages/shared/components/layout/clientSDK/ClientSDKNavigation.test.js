import React from 'react';
import { render } from '@testing-library/react';
import ClientSDKNavigation from 'shared/components/layout/clientSDK/ClientSDKNavigation';
import { wrapInThemedTestApp } from 'testUtils';

describe('<ClientSDKLayout.test.js />', () => {
  it('renders without exploding', () => {
    const rendered = render(wrapInThemedTestApp(<ClientSDKNavigation id="test" repository="a/b" />));
    expect(rendered.getByText('Overview')).toBeInTheDocument();
  });

  it('renders nav items', () => {
    const rendered = render(wrapInThemedTestApp(<ClientSDKNavigation id="test" repository="a/b" />));
    expect(rendered.getByText('Overview')).toBeInTheDocument();
  });

  it('renders links', () => {
    const rendered = render(wrapInThemedTestApp(<ClientSDKNavigation id="test" repository="a/b" />));
    const anchor = rendered.container.querySelector('a');
    expect(anchor.href).toContain('client-sdks/test');
  });
});
