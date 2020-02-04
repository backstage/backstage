import React from 'react';
import gql from 'graphql-tag';
import { MemoryRouter } from 'react-router-dom';
import { render, waitForElement } from '@testing-library/react';

import QueryLayout from 'shared/components/layout/QueryLayout';
import { MockedProvider } from '@apollo/react-testing';

// the query we'll pass to the QueryLayout, along with a variable prop
const query = gql`
  query($username: String!) {
    user(username: $username) {
      id
    }
  }
`;

// Depending on username, the different results will be returned
const mocks = [
  {
    request: {
      query: query,
      variables: {
        username: 'albus',
      },
    },
    result: {
      data: { user: { id: 'albus' } },
    },
  },
  {
    request: {
      query: query,
      variables: {
        username: 'grindelwald',
      },
    },
    error: new Error('No owl mail today'),
  },
  {
    request: {
      query: query,
      variables: {
        username: 'malfoy',
      },
    },
    error: new Error('Not found'),
  },
];

// create out components with the mocked apollo provider so that we can control
// what the query returns it will always start with returning loading, and after the
// first tick the promise is resolved to the mocked return value
const getSetup = (user, props = {}) =>
  render(
    <MemoryRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <QueryLayout query={query} variables={{ username: user }} {...props}>
          {data => {
            return <div>{data.user.id}</div>;
          }}
        </QueryLayout>
      </MockedProvider>
    </MemoryRouter>,
  );

describe('<QueryLayout />', () => {
  it('renders progress bar', async () => {
    const rendered = getSetup('albus');
    expect(rendered.getByTestId('progress')).toBeInTheDocument();
  });

  it('renders username', async () => {
    const rendered = getSetup('albus');
    await waitForElement(() => rendered.getByText('albus'));
  });

  it('renders error', async () => {
    const rendered = getSetup('grindelwald');
    await waitForElement(() => rendered.getByTestId('error'));
  });

  it('renders not found', async () => {
    const { getByTestId } = getSetup('malfoy');
    await waitForElement(() => getByTestId('empty'));
  });

  it('uses provided empty check handler', async () => {
    const { getByTestId } = getSetup('albus', { handleEmptyCheck: data => !data.missingKey });
    await waitForElement(() => getByTestId('empty'));
  });
});
