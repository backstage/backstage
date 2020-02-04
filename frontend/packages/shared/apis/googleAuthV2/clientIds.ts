import { env } from 'shared/apis/env';

/**
 * OAuth 2.0 Client IDs
 * https://console.cloud.google.com/apis/credentials?folder=&organizationId=642708779950&orgonly=true&project=xpn-system-z-1&supportedpurview=organizationId
 */
export const CLIENT_ID_DEV = '820235932049-nc367ocqr8rfknrjrd71cfog3figgt1s.apps.googleusercontent.com'; // oauth client allowing JavaScript origin http://localhost:5678 and slingshot domains
export const CLIENT_ID_PROD = '820235932049-g88s8ltjd53af38go61db8debamdlh7d.apps.googleusercontent.com'; // oauth client allowing JavaScript origin from trusted domains.

export function getClientId() {
  if (env.isDevelopment || env.isStaging) {
    return CLIENT_ID_DEV;
  }
  return CLIENT_ID_PROD;
}

export type SlingshotInfo = {
  id: number;
  site: string;
};

export function getSlingshotInfo(): undefined | SlingshotInfo {
  const { hostname } = location;
  if (!hostname) {
    return;
  }

  const match = hostname.match(/^backstage-backstage-frontend-([0-9]+)\.services\.([a-z0-9]+)\.spotify\.net$/);
  if (!match) {
    return;
  }

  const [, id, site] = match;
  return { id: Number(id), site };
}
