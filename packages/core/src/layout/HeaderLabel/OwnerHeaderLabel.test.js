import React from 'react';
import { render } from '@testing-library/react';
import OwnerHeaderLabel from './OwnerHeaderLabel';
import { wrapInThemedTestApp } from '../../testUtils';

const properOwner = { id: 'tools', name: 'tools', type: 'squad' };
const badOwner = { id: 'tools-xxx', name: 'tools-xxx' };

describe('<OwnerHeaderLabel />', () => {
  it('should have a label', () => {
    const rendered = render(
      wrapInThemedTestApp(<OwnerHeaderLabel owner={properOwner} />),
    );
    expect(rendered.getByText('Owner')).toBeInTheDocument();
    expect(rendered.getByText('tools')).toBeInTheDocument();
    expect(rendered.queryByText('Squad not verified!')).not.toBeInTheDocument();
  });

  it('should have an org link', () => {
    const rendered = render(
      wrapInThemedTestApp(<OwnerHeaderLabel owner={properOwner} />),
    );
    const anchor = rendered.container.querySelector('a');
    expect(anchor.href).toBe('http://localhost/org/tools');
  });

  it('should have WARNING label', () => {
    const rendered = render(
      wrapInThemedTestApp(<OwnerHeaderLabel owner={badOwner} />),
    );
    expect(rendered.getByText('Squad not verified!')).toBeInTheDocument();
  });

  it('should have status error label', () => {
    const rendered = render(
      wrapInThemedTestApp(<OwnerHeaderLabel owner={badOwner} />),
    );
    expect(rendered.getByLabelText('Status error')).toBeInTheDocument();
  });

  it('should handle empty input', () => {
    const rendered = render(
      wrapInThemedTestApp(<OwnerHeaderLabel owner={{}} />),
    );
    expect(rendered.getByLabelText('Status error')).toBeInTheDocument();
  });
});
