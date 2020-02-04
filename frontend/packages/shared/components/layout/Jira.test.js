import React from 'react';
import { render } from '@testing-library/react';

import { Jira } from 'shared/components/layout';
import { wrapInThemedTestApp } from 'testUtils';

const minProps = { projectID: 56565 };

describe('<Jira />', () => {
  it('renders without exploding', () => {
    const rendered = render(wrapInThemedTestApp(<Jira {...minProps} />));
    expect(rendered.getByText('Jira')).toBeInTheDocument();
  });

  it('renders 2 links', () => {
    const rendered = render(wrapInThemedTestApp(<Jira {...minProps} />));
    expect(rendered.getByText('Report', { exact: false })).toBeInTheDocument();
    expect(rendered.getByText('Feature', { exact: false })).toBeInTheDocument();
  });

  it('should link out to Jira', () => {
    const rendered = render(wrapInThemedTestApp(<Jira {...minProps} />));
    const anchor = rendered.container.querySelector('a');
    expect(anchor.href).toContain('https://jira.spotify.net');
  });

  it('should link out to specific Jira project', () => {
    const rendered = render(wrapInThemedTestApp(<Jira {...minProps} />));
    const anchor = rendered.container.querySelector('a');
    expect(anchor.href).toContain(minProps.projectID);
  });

  it('renders Jira icon', () => {
    const rendered = render(wrapInThemedTestApp(<Jira {...minProps} />));

    rendered.getByAltText('Jira');
  });
});
