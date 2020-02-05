import React from 'react';
import { render } from '@testing-library/react';
import HeaderLabel from './HeaderLabel';
import { wrapInThemedTestApp } from '../../testUtils';

describe('<HeaderLabel />', () => {
  it('should have a label', () => {
    const rendered = render(wrapInThemedTestApp(<HeaderLabel label="Label" />));
    expect(rendered.getByText('Label')).toBeInTheDocument();
  });

  it('should say unknown', () => {
    const rendered = render(wrapInThemedTestApp(<HeaderLabel label="Label" />));
    expect(rendered.getByText('<Unknown>')).toBeInTheDocument();
  });

  it('should have value', () => {
    const rendered = render(wrapInThemedTestApp(<HeaderLabel label="Label" value="Value" />));
    expect(rendered.getByText('Value')).toBeInTheDocument();
  });

  it('should have a link', () => {
    const rendered = render(wrapInThemedTestApp(<HeaderLabel label="Label" value="Value" url="/test" />));
    const anchor = rendered.container.querySelector('a');
    expect(rendered.getByText('Value')).toBeInTheDocument();
    expect(anchor.href).toBe('http://localhost/test');
  });
});
