import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';
import ExpansionAlertPanel from 'shared/components/ExpansionAlertPanel';

const props = {
  type: 'info',
  title: 'test title',
};

describe('<ExpansionAlertPanel />', () => {
  it('renders without exploding', () => {
    const { getByText } = render(wrapInThemedTestApp(<ExpansionAlertPanel {...props}>test child</ExpansionAlertPanel>));
    getByText('test title');
    getByText('test child');
  });
});
