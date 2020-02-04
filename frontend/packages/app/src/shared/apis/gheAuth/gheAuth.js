import { urls } from 'shared/apis/baseUrls';
import { env } from 'shared/apis/env';

/**
 * Checks whether a hostname represents a Slingshot host, and in that case returns
 * information about the slingshot build.
 *
 * @param {string} host - The hostname to check.
 * @returns {{}} - An object with the slingshot build `id` and `region`, both as strings.
 */
function getSlingshotInfo(host) {
  if (!host) {
    return null;
  }

  const match = host.match(/^backstage-backstage-frontend-([0-9]+)\.services\.([a-z0-9]+)\.spotify\.net$/);
  if (!match) {
    return null;
  }

  const [, id, region] = match;
  return { id, region };
}

/**
 * Checks whether a hostname/IP represents the local host.
 *
 * @param host The host name or IP to inspect, with or without port number
 * @returns {boolean}
 */
export function isLocalHost(host) {
  if (!host) {
    return false;
  }

  return !!host.match(/^(0\.0\.0\.0|127\.0\.0\.1|localhost)(:\d+)?$/);
}

const PRODUCTION_CLIENT_ID = '354bc7c49b64bf7d7bc8';
const DEVELOPMENT_CLIENT_ID = 'b444743194e5f57b7f17';
const SLINGSHOT_CLIENT_IDS = {
  '0': 'ae3c6b52a22ff5509fb7',
  '1': '5787beb3ee9c0f9dfc7d',
  '2': 'fafdcf9f860dc63ff86d',
  '3': '73521c219b3c62af996b',
  '4': 'd92e272e2c2c8b89f9c5',
  '5': '344acf7e426ad4b32eb5',
  '6': '724521bc9238bcf8e63f',
  '7': 'fd0eb21789e76e74f48a',
  '8': '4134c26941c896dae0c6',
  '9': '0409e26dfe87f78e96f5',
  '10': '2ba99717f2513cba2208',
  '11': '88a70d171a2f53e18966',
  '12': '8647a90097c26fb68698',
  '13': '0a69388c960f6987e6cd',
  '14': 'b2fe4cd9e61c3e71ddb5',
  '15': 'b50841e2e6dd50b4a3dc',
  '16': '1a37e7489299c5c8c6fd',
  '17': '626a5554b095de95561b',
  '18': 'c98129a1cdf02a4af285',
  '19': '97062a432db9972b6f80',
};

// TODO: non-prefixed keys are deprecated, remove once this has been live long enough that ppl have refreshed their tokens
const TOKEN_KEY = 'gheAccessToken';
const STATE_KEY = 'gheOauthState';
const REDIRECT_URL_KEY = 'gheOauthRedirectUrl';

function storeValue(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getValue(key) {
  const value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) : value;
}

function removeValue(key) {
  return window.localStorage.removeItem(key);
}

function getClientId(host) {
  if (isLocalHost(host)) {
    return DEVELOPMENT_CLIENT_ID;
  }
  const slingshotInfo = getSlingshotInfo(host);
  if (slingshotInfo) {
    return SLINGSHOT_CLIENT_IDS[slingshotInfo.id];
  }

  return PRODUCTION_CLIENT_ID;
}

function gheOAuthConfig() {
  const { protocol, host } = window.location;

  return {
    // Access tokens could in theory be fetched directly from GHE, but the call requires a
    // client_secret which we don't want to distribute to browsers. We do that specific call
    // through the proxy instead which has the ability to decorate it with the correct client
    // secret.
    accessTokenEndpoint: `${urls.proxy}/api/backend/ghe-proxy/login/oauth/access_token`,
    // This is where the user is redirected initially, to authorize our application to talk to GHE.
    authorizationEndpoint: 'https://ghe.spotify.net/login/oauth/authorize',
    // This is where the user shall be redirected back, after completing the above authorization.
    redirectUri: `${protocol}//${host}/oauth/ghe`,
    // The root of the GHE API.
    apiEndpoint: `${urls.ghe}/api/v3`,
    // The ID of the identity that our application wants to use when performing operations in GHE.
    clientId: getClientId(host),
  };
}

// Store a GHE access token. This lets us act on the user's behalf across sessions, without them
// re-authorizing us over and over.
export function setCachedGheAccessToken(accessToken) {
  storeValue('accessToken', accessToken);
  storeValue(TOKEN_KEY, accessToken);
}

// Attempt to fetch a stored GHE access token.
export function getCachedGheAccessToken() {
  return getValue(TOKEN_KEY) || getValue('accessToken');
}

// Forget a stored GHE access token.
export function removeCachedGheAccessToken() {
  const removed = removeValue('accessToken');
  return removeValue(TOKEN_KEY) || removed;
}

function randomBase64String(length) {
  if (env.isTest) {
    // window.crypto is not available in jsdom, get rid of this when it is https://github.com/jsdom/jsdom/issues/1612
    return Math.random().toString(36);
  }
  const randomValues = crypto.getRandomValues(new Uint8Array((length * 1.2 + 10) | 0));
  const string = btoa(String.fromCharCode(...randomValues)).replace(/[+\/=]/g, '');
  return string.slice(0, length);
}

/*
 * Initiates a new GHE login cycle, by redirecting the user to the GHE authorization page. When the
 * user has consented, they will be redirected back to the redirect_uri together with a temporary
 * code that they generate, and the state that we generate in here.
 */
export function initiateLogin(targetUrl) {
  const oauthState = randomBase64String(20);
  const config = gheOAuthConfig();
  storeValue('oauthState', oauthState);
  storeValue('oauthRedirectUrl', targetUrl);
  storeValue(STATE_KEY, oauthState); // Store for validation later (see below)
  storeValue(REDIRECT_URL_KEY, targetUrl);
  window.location = [
    config.authorizationEndpoint,
    `?client_id=${config.clientId}`,
    `&redirect_uri=${config.redirectUri}`,
    `&state=${oauthState}`,
    '&scope=user,admin:org,repo,gist',
  ].join('');
}

/*
 * When the user has authorized us and the redirect has happened back to our site, we need to check
 * that the state parameter we got back was the one that we generated earlier. This protects against
 * some forms of attack. Returns null on failure, or the desired target URL if successful.
 */
export function validateLoginState(state) {
  const originalState = getValue(STATE_KEY) || getValue('oauthState');
  removeValue('oauthState');
  removeValue(STATE_KEY);
  if (state !== originalState) {
    return null;
  } else {
    return getValue(REDIRECT_URL_KEY) || getValue('oauthRedirectUrl');
  }
}

/*
 * When a valid login redirect has happened, we take the code and state and send those again to GHE,
 * in order to get a long lived access token. This token is tied to the current user, and can be
 * supplied in future API calls.
 */
export async function getNewAccessToken(code, state) {
  const config = gheOAuthConfig();

  const response = await fetch(config.accessTokenEndpoint, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: code,
      state: state,
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to authorize: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.access_token || data.error) {
    throw new Error(`Failed to authorize: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}
