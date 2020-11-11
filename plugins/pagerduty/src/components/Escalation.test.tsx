import React from 'react';
import { render } from '@testing-library/react';
import { EscalationPolicy } from './Escalation';
import { wrapInTestApp } from '@backstage/test-utils';
import { OnCall } from './types';

export const escalations: OnCall[] = [
  {
    user: {
      name: 'person1',
      id: 'p1',
      summary: 'person1',
      email: 'person1@example.com',
      html_url: 'http://a.com/id1',
    },
  },
];

describe('Escalation', () => {
  it('render emptyState', () => {
    const { getByText } = render(
      wrapInTestApp(<EscalationPolicy escalation={[]} />),
    );
    expect(getByText('Empty escalation policy')).toBeInTheDocument();
  });

  it('render Escalation list', () => {
    const { getByText } = render(
      wrapInTestApp(<EscalationPolicy escalation={escalations} />),
    );
    expect(getByText('person1')).toBeInTheDocument();
    expect(getByText('person1@example.com')).toBeInTheDocument();
  });
});
