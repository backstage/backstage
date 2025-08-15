import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { UptimeRobotComponent } from './UptimeRobotComponent';

const mockDiscoveryApi = {
  getBaseUrl: jest.fn(),
};

const mockFetchApi = {
  fetch: jest.fn(),
};

describe('UptimeRobotComponent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading state initially', () => {
    mockDiscoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7007/api');
    mockFetchApi.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <TestApiProvider
        apis={[
          [discoveryApiRef, mockDiscoveryApi],
          [fetchApiRef, mockFetchApi],
        ]}
      >
        <UptimeRobotComponent />
      </TestApiProvider>,
    );

    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('renders table when data is loaded', async () => {
    const mockData = {
      stat: 'ok',
      monitors: [
        {
          id: 1,
          friendly_name: 'Test Monitor',
          url: 'https://example.com',
          type: 1,
          status: 2,
          interval: 300,
        },
      ],
    };

    mockDiscoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7007/api');
    mockFetchApi.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    render(
      <TestApiProvider
        apis={[
          [discoveryApiRef, mockDiscoveryApi],
          [fetchApiRef, mockFetchApi],
        ]}
      >
        <UptimeRobotComponent />
      </TestApiProvider>,
    );

    expect(await screen.findByText('UptimeRobot Monitors')).toBeInTheDocument();
    expect(await screen.findByText('Test Monitor')).toBeInTheDocument();
    expect(await screen.findByText('https://example.com')).toBeInTheDocument();
  });
});