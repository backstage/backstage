import React from 'react';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';
import PagerDutyServiceStatus from 'shared/components/PagerDutyServiceStatus';

const props = {
  service: {
    name: 'test-service',
    activeIncidents: [{ status: 'triggered' }],
  },
};
describe('<PagerDutyServiceStatus />', () => {
  it('renders an error icon and title for an incident', () => {
    const { getByTitle, getByLabelText } = render(wrapInThemedTestApp(<PagerDutyServiceStatus {...props} />));
    getByTitle('PagerDuty service "test-service": 1 triggered incidents');
    getByLabelText('Status error');
  });
});
