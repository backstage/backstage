import React from 'react';
import { render } from '@testing-library/react';
import { FeedbackIcon } from 'shared/icons';

import MetadataCardAction from './MetadataCardAction';

const refreshProps = {
  refresh: () => {},
};

const actionProps = {
  cardActions: [
    {
      title: 'First Action',
      link: '/firstActionLink',
    },
    {
      title: 'Second Action',
      onClick: () => {},
      icon: <FeedbackIcon titleAccess="Feedback + Support" />,
    },
  ],
};

const combinedProps = { ...refreshProps, ...actionProps };

describe('<MetadataCardAction />', () => {
  it('renders without exploding', () => {
    render(<MetadataCardAction {...refreshProps} />);
  });

  it('renders a refresh action when refreshFn is set', () => {
    const { getByText } = render(<MetadataCardAction {...refreshProps} />);
    expect(getByText('Refresh')).toBeInTheDocument();
  });

  it('does not render a refresh when refreshFn is not set', () => {
    const { queryByText } = render(<MetadataCardAction />);
    expect(queryByText('Refresh')).toBeNull();
  });

  it('renders a additional action buttons when set', () => {
    const { getByText, getByTitle } = render(<MetadataCardAction {...actionProps} />);
    expect(getByText('First Action')).toBeInTheDocument();
    expect(getByText('Second Action')).toBeInTheDocument();
    expect(getByTitle('Feedback + Support')).toBeInTheDocument();
  });

  it('renders both refresh and additional action buttons when set', () => {
    const { getByText, getByTitle } = render(<MetadataCardAction {...combinedProps} />);
    expect(getByText('Refresh')).toBeInTheDocument();
    expect(getByText('First Action')).toBeInTheDocument();
    expect(getByText('Second Action')).toBeInTheDocument();
    expect(getByTitle('Feedback + Support')).toBeInTheDocument();
  });
});
