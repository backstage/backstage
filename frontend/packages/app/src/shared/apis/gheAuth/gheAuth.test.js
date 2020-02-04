import {
  initiateLogin,
  validateLoginState,
  getNewAccessToken,
  setCachedGheAccessToken,
  getCachedGheAccessToken,
  removeCachedGheAccessToken,
  isLocalHost,
} from './gheAuth';

describe('isLocalHost', () => {
  it('handles anomalous input', () => {
    expect(isLocalHost('')).toBe(false);
    expect(isLocalHost(null)).toBe(false);
  });

  it('deals with it', () => {
    expect(isLocalHost('localhost')).toBe(true);
    expect(isLocalHost('localhost:3000')).toBe(true);
    expect(isLocalHost('localhosts')).toBe(false);
    expect(isLocalHost('127.0.0.1')).toBe(true);
    expect(isLocalHost('0.0.0.0')).toBe(true);
    expect(isLocalHost('google.com')).toBe(false);
  });
});

describe('gheClient', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { protocol: 'http', host: 'localhost' },
      writable: true,
    });
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('should initiate login', () => {
    initiateLogin('/here');

    // Remove once removed
    const oldState = JSON.parse(window.localStorage.getItem('oauthState'));
    expect(oldState.length).toBeGreaterThan(8);
    expect(JSON.parse(window.localStorage.getItem('oauthRedirectUrl'))).toBe('/here');
    expect(window.location).toMatch(`state=${oldState}`);

    const state = JSON.parse(window.localStorage.getItem('gheOauthState'));
    expect(state.length).toBeGreaterThan(8);
    expect(JSON.parse(window.localStorage.getItem('gheOauthRedirectUrl'))).toBe('/here');
    expect(window.location).toMatch(`state=${state}`);
  });

  it('should validate login state', () => {
    initiateLogin('/here');

    expect(validateLoginState(JSON.parse(window.localStorage.getItem('oauthState')))).toBe('/here');
    expect(validateLoginState(JSON.parse(window.localStorage.getItem('gheOauthState')))).toBe('/here');
  });

  it('should detect invalid login state', () => {
    initiateLogin('/here');

    expect(validateLoginState('not-the-state')).toBeNull();
  });

  it('should be able to cache access token', () => {
    expect(getCachedGheAccessToken()).toBeNull();
    setCachedGheAccessToken('abc');
    expect(getCachedGheAccessToken()).toBe('abc');
    removeCachedGheAccessToken();
    expect(getCachedGheAccessToken()).toBeNull();
  });

  it('should get access token', async () => {
    fetch.mockResponseOnce(JSON.stringify({ access_token: 'abc' }), { status: 200 });
    await expect(getNewAccessToken('my-code', 'my-state')).resolves.toBe('abc');
  });

  it('should fail to get access token', async () => {
    fetch.mockRejectOnce(new Error('it failed'));
    await expect(getNewAccessToken('my-code', 'my-state')).rejects.toMatchObject({ message: 'it failed' });

    fetch.mockResponseOnce(JSON.stringify({ access_token: 'abc' }), { status: 401, statusText: 'NOPE' });
    await expect(getNewAccessToken('my-code', 'my-state')).rejects.toMatchObject({
      message: 'Failed to authorize: 401 NOPE',
    });

    fetch.mockResponseOnce(JSON.stringify({ error: 'fail' }), { status: 200 });
    await expect(getNewAccessToken('my-code', 'my-state')).rejects.toMatchObject({
      message: 'Failed to authorize: {"error":"fail"}',
    });
  });
});
