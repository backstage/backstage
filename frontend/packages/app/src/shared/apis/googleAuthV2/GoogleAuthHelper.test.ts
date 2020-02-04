import GoogleAuthHelper from './GoogleAuthHelper';
import GoogleScopes from './GoogleScopes';

const anyFetch = fetch as any;

const pendingRequests = {
  request: jest.fn(),
  resolve: jest.fn(),
  reject: jest.fn(),
  pending: jest.fn(),
};

describe('GoogleAuthHelper', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should refresh a session', async () => {
    anyFetch.mockResponseOnce(
      JSON.stringify({
        idToken: 'mock-id-token',
        accessToken: 'mock-access-token',
        scopes: 'a b c',
        expiresInSeconds: '60',
      }),
    );

    const helper = new GoogleAuthHelper({ clientId: 'mock-id', apiOrigin: 'my-origin', dev: false, pendingRequests });
    const session = await helper.refreshSession();
    expect(session.idToken).toBe('mock-id-token');
    expect(session.accessToken).toBe('mock-access-token');
    expect(session.scopes.hasScopes('a b c')).toBe(true);
    expect(session.expiresAt.getTime()).toBeLessThan(Date.now() + 70000);
    expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now() + 50000);
  });

  it('should handle failure to refresh session', async () => {
    anyFetch.mockRejectOnce(new Error('Network NOPE'));

    const helper = new GoogleAuthHelper({ clientId: 'mock-id', apiOrigin: 'my-origin', dev: true, pendingRequests });
    await expect(helper.refreshSession()).rejects.toThrow('Auth refresh request failed, Error: Network NOPE');
  });

  it('should handle failure response when refreshing session', async () => {
    anyFetch.mockResponseOnce({}, { status: 401, statusText: 'NOPE' });

    const helper = new GoogleAuthHelper({ clientId: 'mock-id', apiOrigin: 'my-origin', dev: false, pendingRequests });
    await expect(helper.refreshSession()).rejects.toThrow('Auth refresh request failed with status NOPE');
  });

  it('should fail if popup could not be shown', async () => {
    pendingRequests.request.mockRejectedValueOnce(new Error('BAH'));
    const helper = new GoogleAuthHelper({ clientId: 'mock-id', apiOrigin: 'my-origin', dev: false, pendingRequests });
    await expect(helper.createSession('a b')).rejects.toThrow('BAH');
  });

  it('should show an auth popup', async () => {
    const helper = new GoogleAuthHelper({ clientId: 'mock-id', apiOrigin: 'my-origin', dev: false, pendingRequests });

    const openSpy = jest.spyOn(window, 'open');
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const popupMock = { closed: false };

    openSpy.mockReturnValue(popupMock as Window);
    pendingRequests.request.mockImplementationOnce(scopes => helper.showPopup(scopes.toString()));

    const sessionPromise = helper.createSession('a b');

    expect(openSpy).toBeCalledTimes(1);
    expect(openSpy.mock.calls[0][0]).toBe(
      'my-origin/api/backend/auth/start?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fa%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fb',
    );
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(0);

    const listener = addEventListenerSpy.mock.calls[0][1] as EventListener;

    await expect(Promise.race([sessionPromise, 'waiting'])).resolves.toBe('waiting');

    listener({} as MessageEvent);

    await expect(Promise.race([sessionPromise, 'waiting'])).resolves.toBe('waiting');

    // None of these should be accepted
    listener({ source: popupMock } as MessageEvent);
    listener({ origin: 'my-origin' } as MessageEvent);
    listener({ data: { type: 'oauth-result' } } as MessageEvent);
    listener({ source: popupMock, origin: 'my-origin', data: {} } as MessageEvent);
    listener({
      source: popupMock,
      origin: 'my-origin',
      data: { type: 'not-oauth-result', payload: {} },
    } as MessageEvent);

    await expect(Promise.race([sessionPromise, 'waiting'])).resolves.toBe('waiting');

    // This should be accepted as a valid sessions response
    listener({
      source: popupMock,
      origin: 'my-origin',
      data: {
        type: 'oauth-result',
        payload: { accessToken: 'my-access-token', idToken: 'my-id-token', expiresInSeconds: 5, scopes: 'a b' },
      },
    } as MessageEvent);

    await expect(sessionPromise).resolves.toEqual({
      idToken: 'my-id-token',
      accessToken: 'my-access-token',
      scopes: expect.any(GoogleScopes),
      expiresAt: expect.any(Date),
    });

    expect(openSpy).toBeCalledTimes(1);
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(1);
  });

  it('should forward slingshot info', async () => {
    const helper = new GoogleAuthHelper({
      clientId: 'mock-id',
      apiOrigin: 'my-origin',
      dev: false,
      slingshotInfo: {
        id: 101,
        site: 'narnia',
      },
      pendingRequests,
    });

    const openSpy = jest.spyOn(window, 'open').mockReturnValue(null);
    pendingRequests.request.mockImplementationOnce(scopes => helper.showPopup(scopes.toString()));

    await expect(helper.createSession('a b')).rejects.toThrow('Failed to open google login popup.');

    expect(openSpy).toBeCalledTimes(1);
    expect(openSpy.mock.calls[0][0]).toBe(
      'my-origin/api/backend/auth/start?slingshot=101%3Anarnia&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fa%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fb',
    );
  });

  it('should fail if popup returns error', async () => {
    const helper = new GoogleAuthHelper({ clientId: 'mock-id', apiOrigin: 'my-origin', dev: false, pendingRequests });

    const openSpy = jest.spyOn(window, 'open');
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const popupMock = { closed: false };

    openSpy.mockReturnValue(popupMock as Window);
    pendingRequests.request.mockImplementationOnce(scopes => helper.showPopup(scopes.toString()));

    const sessionPromise = helper.createSession('a b');

    expect(openSpy).toBeCalledTimes(1);
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(0);

    const listener = addEventListenerSpy.mock.calls[0][1] as EventListener;

    listener({
      source: popupMock,
      origin: 'my-origin',
      data: {
        type: 'oauth-result',
        payload: {
          error: {
            message: 'NOPE',
            name: 'NopeError',
          },
        },
      },
    } as MessageEvent);

    await expect(sessionPromise).rejects.toThrow({
      name: 'NopeError',
      message: 'NOPE',
    });

    expect(openSpy).toBeCalledTimes(1);
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(1);
  });

  it('should fail if popup is closed', async () => {
    const helper = new GoogleAuthHelper({ clientId: 'mock-id', apiOrigin: 'my-origin', dev: false, pendingRequests });

    const openSpy = jest.spyOn(window, 'open');
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const popupMock = { closed: false };

    openSpy.mockReturnValue(popupMock as Window);
    pendingRequests.request.mockImplementationOnce(scopes => helper.showPopup(scopes.toString()));

    const sessionPromise = helper.createSession('a b');

    expect(openSpy).toBeCalledTimes(1);
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(0);

    setTimeout(() => {
      popupMock.closed = true;
    }, 150);
    await expect(sessionPromise).rejects.toThrow('Google login failed, popup was closed');

    expect(openSpy).toBeCalledTimes(1);
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(1);
  });
});
