import React from 'react';
import { render } from '@testing-library/react';
import { Incidents } from './Incidents';
import { wrapInTestApp } from '@backstage/test-utils';
import { Incident } from './types';

export const incidents: Incident[] = [
  {
    id: 'id1',
    status: 'triggered',
    title: 'title1',
    created_at: '2020-11-06T00:00:00Z',
    assignments: [
      {
        assignee: {
          name: 'person1',
          id: 'p1',
          summary: 'person1',
          email: 'person1@example.com',
          html_url: 'http://a.com/id1',
        },
      },
    ],
    homepageUrl: 'http://a.com/id1',
    serviceId: 'sId1',
  },
  {
    id: 'id2',
    status: 'acknowledged',
    title: 'title2',
    created_at: '2020-11-07T00:00:00Z',
    assignments: [
      {
        assignee: {
          name: 'person2',
          id: 'p2',
          summary: 'person2',
          email: 'person2@example.com',
          html_url: 'http://a.com/id2',
        },
      },
    ],
    homepageUrl: 'http://a.com/id2',
    serviceId: 'sId2',
  },
];

describe('Incidents', () => {
  it('renders an empty state is there are no incidents', () => {
    const { getByText } = render(wrapInTestApp(<Incidents incidents={[]} />));
    expect(getByText('No incidents')).toBeInTheDocument();
  });

  it('renders all incidents', () => {
    const { getByText, getByTitle, getAllByTitle, getByLabelText } = render(
      wrapInTestApp(<Incidents incidents={incidents} />),
    );

    expect(getByText('title1')).toBeInTheDocument();
    expect(getByText('title2')).toBeInTheDocument();
    expect(getByText('person1')).toBeInTheDocument();
    expect(getByText('person2')).toBeInTheDocument();
    expect(getByTitle('triggered')).toBeInTheDocument();
    expect(getByTitle('acknowledged')).toBeInTheDocument();
    expect(getByLabelText('Status error')).toBeInTheDocument();
    expect(getByLabelText('Status warning')).toBeInTheDocument();

    // assert links, mailto and hrefs, date calculation
    expect(getAllByTitle('View in PagerDuty').length).toEqual(2);
  });
});
