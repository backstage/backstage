import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { wrapInThemedTestApp } from 'testUtils';
import Checker from './ComponentResourceChecker';

jest.mock('shared/auth/GheComposable');

jest.mock('plugins/tugboat/lib/TugApi', () => {
  return class MockTugApi {
    installation = {
      findByComponent: jest.fn().mockImplementation(async id => {
        if (id === 'empty-component') {
          return [];
        } else if (id === 'running-component') {
          return [{ id: 'inst-running' }];
        } else if (id === 'shutdown-component') {
          return [{ id: 'inst-shutdown' }];
        } else if (id === 'mix-component') {
          return [{ id: 'inst-running' }, { id: 'inst-shutdown' }];
        } else if (id === 'error-component') {
          throw new Error('tugboat failure');
        } else {
          return [];
        }
      }),
      status: jest.fn().mockImplementation(async id => {
        if (id === 'inst-running') {
          return {
            statuses: [
              { status: { running: true }, instance: {} },
              { status: { running: true }, instance: {} },
            ],
          };
        } else if (id === 'inst-shutdown') {
          return { statuses: [{ status: { running: false } }] };
        }
      }),
    };
  };
});

jest.mock('plugins/capacity/lib/CPMClient', () => {
  const pools = {
    'role-0': { desired_capacity: 0 },
    'role-1': { desired_capacity: 1 },
    'role-2': { desired_capacity: 2 },
  };
  return class MockCPMClient {
    static getPools = jest.fn().mockImplementation(async roles => {
      if (roles.includes('role-error')) {
        throw new Error('cortana failure');
      }
      return roles.map(role => pools[role.id]).filter(pool => pool);
    });
  };
});

describe('<ComponentResourceChecker />', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without exploding', () => {
    render(wrapInThemedTestApp(<Checker componentId="test-component" componentType="other" />));
  });

  it('shows a warning when only instances are running', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <Checker componentId="running-component" componentType="service" roles={[{ id: 'empty', components: [] }]} />,
      ),
    );
    await waitForElementToBeRemoved(() => rendered.queryByTestId('progress'));
    rendered.getByText('Note that this service has 2 running container instances and 0 machines provisioned in CPM.');
  });

  it('shows a warning when only machines are provisioned', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <Checker
          componentId="empty-component"
          componentType="service"
          roles={[
            { id: 'role-1', components: [] },
            { id: 'role-2', components: [] },
          ]}
        />,
      ),
    );
    await waitForElementToBeRemoved(() => rendered.queryByTestId('progress'));
    rendered.getByText('Note that this service has 0 running container instances and 3 machines provisioned in CPM.');
  });

  it('does not warn about machines when roles are shared with other components', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <Checker
          componentId="running-component"
          componentType="service"
          roles={[{ id: 'role-1', components: ['running-component', 'other-component'] }]}
        />,
      ),
    );
    await waitForElementToBeRemoved(() => rendered.queryByTestId('progress'));
    rendered.getByText('Note that this service has 2 running container instances.');
  });

  it('shows a warning with instances running and provisioned machines', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <Checker
          componentId="mix-component"
          componentType="website"
          roles={[
            { id: 'role-0', components: ['mix-component'] },
            { id: 'role-1', components: ['mix-component'] },
          ]}
        />,
      ),
    );
    await waitForElementToBeRemoved(() => rendered.queryByTestId('progress'));
    rendered.getByText('Note that this service has 2 running container instances and 1 machines provisioned in CPM.');
  });

  it('does not show a warning if the instances are not running', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <Checker componentId="shutdown-component" componentType="service" roles={[{ id: 'empty', components: [] }]} />,
      ),
    );
    await waitForElementToBeRemoved(() => rendered.queryByTestId('progress'));
    expect(rendered.container).toBeEmpty();
  });

  it('ignores roles that are shared with other components', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <Checker
          componentId="no-install-component"
          componentType="service"
          roles={[
            { id: 'role-1', components: ['no-install-component', 'other-component'] },
            { id: 'role-2', components: ['no-install-component'] },
          ]}
        />,
      ),
    );
    await waitForElementToBeRemoved(() => rendered.queryByTestId('progress'));
    rendered.getByText('Note that this service has 0 running container instances and 2 machines provisioned in CPM.');
  });

  it('shows an error when failing to connect to tugboat', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <Checker componentId="error-component" componentType="service" roles={[{ id: 'role-1', components: [] }]} />,
      ),
    );
    await waitForElementToBeRemoved(() => rendered.queryByTestId('progress'));
    rendered.getByText('Failed to fetch installation information from tugboat');
  });

  it('shows an error when failing to connect to cortana', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <Checker componentId="empty-component" componentType="service" roles={[{ id: 'role-error' }]} />,
      ),
    );
    await waitForElementToBeRemoved(() => rendered.queryByTestId('progress'));
    rendered.getByText('Failed to fetch capacity information from cortana');
  });
});
