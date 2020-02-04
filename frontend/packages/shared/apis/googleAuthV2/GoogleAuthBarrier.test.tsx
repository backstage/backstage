import GoogleAuthBarrier, { useGetGoogleAccessToken, useGetGoogleIdToken } from './GoogleAuthBarrier';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { withLogCollector } from 'testUtils';
import { googleAuth } from './GoogleAuth';
import GoogleScopes from './GoogleScopes';
import { useInterval, useUpdate } from 'react-use';

describe('GoogleAuthBarrier', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not explode', () => {
    jest.spyOn(googleAuth, 'getSession').mockResolvedValueOnce({
      accessToken: 'mockAccessToken',
      idToken: 'mockIdToken',
      scopes: GoogleScopes.from('mockscope'),
      expiresAt: new Date(),
    });

    const rendered = render(
      <GoogleAuthBarrier>
        <div>hej</div>
      </GoogleAuthBarrier>,
    );
    expect(rendered.queryByText('hej')).not.toBeInTheDocument();
    rendered.getByTestId('progress');
  });

  it('should fail if no context is available', () => {
    const MyAccessComponent = () => {
      const getToken = useGetGoogleAccessToken();
      return <span>access token is {getToken()}</span>;
    };
    const MyIdComponent = () => {
      const getToken = useGetGoogleIdToken();
      return <span>id token is {getToken()}</span>;
    };

    const accessLogs = withLogCollector(['error'], () => {
      expect(() => render(<MyAccessComponent />)).toThrowError(/You can only use this hook inside a GoogleAuthBarrier/);
    });
    expect(accessLogs.error.length).toBe(2);
    expect(accessLogs.error[0]).toMatch(
      /^Error: Uncaught \[Error: You can only use this hook inside a GoogleAuthBarrier/,
    );
    expect(accessLogs.error[1]).toMatch(/^The above error occurred in the <MyAccessComponent> component/);

    const idLogs = withLogCollector(['error'], () => {
      expect(() => render(<MyIdComponent />)).toThrowError(/You can only use this hook inside a GoogleAuthBarrier/);
    });
    expect(idLogs.error.length).toBe(2);
    expect(idLogs.error[0]).toMatch(/^Error: Uncaught \[Error: You can only use this hook inside a GoogleAuthBarrier/);
    expect(idLogs.error[1]).toMatch(/^The above error occurred in the <MyIdComponent> component/);
  });

  it('should make tokens available', async () => {
    const MyAccessComponent = () => {
      const getToken = useGetGoogleAccessToken();
      return <span>access token is {getToken()}</span>;
    };
    const MyIdComponent = () => {
      const getToken = useGetGoogleIdToken();
      return <span>id token is {getToken()}</span>;
    };

    jest.spyOn(googleAuth, 'getSession').mockResolvedValueOnce({
      accessToken: 'mockAccessToken',
      idToken: 'mockIdToken',
      scopes: GoogleScopes.from('mockscope'),
      expiresAt: new Date(),
    });

    const rendered = render(
      <GoogleAuthBarrier>
        <MyAccessComponent />
        <MyIdComponent />
      </GoogleAuthBarrier>,
    );

    await rendered.findByText('access token is mockAccessToken');
    await rendered.findByText('id token is mockIdToken');
  });

  it('handles errors and retries', async () => {
    const getSession = jest
      .spyOn(googleAuth, 'getSession')
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce({
        accessToken: 'mockAccessToken',
        idToken: 'mockIdToken',
        scopes: GoogleScopes.from('mockscope'),
        expiresAt: new Date(),
      });

    const rendered = render(
      <GoogleAuthBarrier>
        <div>hej</div>
      </GoogleAuthBarrier>,
    );

    const button = await rendered.findByText('Retry');
    expect(getSession).toHaveBeenCalledTimes(1);
    fireEvent.click(button);
    await rendered.findByText('hej');
    expect(getSession).toHaveBeenCalledTimes(2);
  });

  it('issues refreshes', async () => {
    jest
      .spyOn(googleAuth, 'getSession')
      .mockResolvedValueOnce({
        accessToken: 'mockAccessToken1',
        idToken: 'mockIdToken1',
        scopes: GoogleScopes.from('mockscope'),
        expiresAt: new Date(),
      })
      .mockResolvedValue({
        accessToken: 'mockAccessToken2',
        idToken: 'mockIdToken2',
        scopes: GoogleScopes.from('mockscope'),
        expiresAt: new Date(),
      });

    const Component = () => {
      const getToken = useGetGoogleAccessToken();
      const update = useUpdate();
      useInterval(update, 5);
      return <span>{getToken()}</span>;
    };

    const rendered = render(
      <GoogleAuthBarrier refreshInterval={100}>
        <Component />
      </GoogleAuthBarrier>,
    );

    await rendered.findByText('mockAccessToken1');

    await rendered.findByText('mockAccessToken2');
  });

  it('should show error if refresh is rejected', async () => {
    const rejectError = new Error('NOPE');
    rejectError.name = 'PopupClosedError';

    jest
      .spyOn(googleAuth, 'getSession')
      .mockResolvedValueOnce({
        accessToken: 'mockAccessToken1',
        idToken: 'mockIdToken1',
        scopes: GoogleScopes.from('mockscope'),
        expiresAt: new Date(),
      })
      .mockRejectedValueOnce(rejectError)
      .mockResolvedValue({
        accessToken: 'mockAccessToken2',
        idToken: 'mockIdToken2',
        scopes: GoogleScopes.from('mockscope'),
        expiresAt: new Date(),
      });

    const Component = () => {
      const getToken = useGetGoogleAccessToken();
      const update = useUpdate();
      useInterval(update, 10);
      return <span>{getToken()}</span>;
    };

    const rendered = render(
      <GoogleAuthBarrier refreshInterval={50}>
        <Component />
      </GoogleAuthBarrier>,
    );

    await rendered.findByText('mockAccessToken1');

    await rendered.findByText('Google auth failed, PopupClosedError: NOPE');

    fireEvent.click(rendered.getByText('Retry'));

    await rendered.findByText('mockAccessToken2');
  });
});
