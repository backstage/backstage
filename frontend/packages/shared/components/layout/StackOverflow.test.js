import React from 'react';
import { render } from '@testing-library/react';

import { StackOverflow, StackOverflowTag } from 'shared/components/layout';
import { wrapInThemedTestApp } from 'testUtils';

const minProps = {};

describe('<StackOverflow />', () => {
  const Stack = () => (
    <StackOverflow>
      <StackOverflowTag tag="example" />
      <StackOverflowTag tag="test" />
    </StackOverflow>
  );

  it('renders without exploding', () => {
    const rendered = render(wrapInThemedTestApp(<Stack {...minProps} />));
    expect(rendered.getByText('StackOverflow Tags')).toBeInTheDocument();
  });

  it('renders tags without exploding', () => {
    const rendered = render(wrapInThemedTestApp(<Stack {...minProps} />));
    expect(rendered.getByText('example')).toBeInTheDocument();
    expect(rendered.getByText('test')).toBeInTheDocument();
  });

  it('should link out to StackOverflow Enterprise', () => {
    const rendered = render(wrapInThemedTestApp(<Stack {...minProps} />));
    const anchor = rendered.container.querySelector('a');
    expect(anchor.href).toBe('https://spotify.stackenterprise.co/questions/tagged/example');
  });

  it('renders SOE icon', () => {
    const rendered = render(wrapInThemedTestApp(<Stack {...minProps} />));
    const icon = rendered.getByAltText('SOE');
    expect(icon.src).toContain('soe.png');
  });
});
