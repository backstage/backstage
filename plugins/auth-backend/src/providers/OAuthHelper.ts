import express, { CookieOptions } from 'express';
import crypto from 'crypto';

export const THOUSAND_DAYS_MS = 1000 * 24 * 60 * 60 * 1000;
export const TEN_MINUTES_MS = 600 * 1000;

// TODO: move all of these methods to OAuthProvider

export const verifyNonce = (req: express.Request, provider: string) => {
  const cookieNonce = req.cookies[`${provider}-nonce`];
  const stateNonce = req.query.state;

  if (!cookieNonce || !stateNonce) {
    throw new Error('Missing nonce');
  }

  if (cookieNonce !== stateNonce) {
    throw new Error('Invalid nonce');
  }
};

export const setNonceCookie = (res: express.Response, provider: string) => {
  const nonce = crypto.randomBytes(16).toString('base64');

  const options: CookieOptions = {
    maxAge: TEN_MINUTES_MS,
    secure: false,
    sameSite: 'none',
    domain: 'localhost',
    path: `/auth/${provider}/handler`,
    httpOnly: true,
  };

  res.cookie(`${provider}-nonce`, nonce, options);

  return nonce;
};

export const setRefreshTokenCookie = (
  res: express.Response,
  provider: string,
  refreshToken: string,
) => {
  const options: CookieOptions = {
    maxAge: THOUSAND_DAYS_MS,
    secure: false,
    sameSite: 'none',
    domain: 'localhost',
    path: `/auth/${provider}`,
    httpOnly: true,
  };

  res.cookie(`${provider}-refresh-token`, refreshToken, options);
};

export const removeRefreshTokenCookie = (
  res: express.Response,
  provider: string,
) => {
  const options: CookieOptions = {
    maxAge: 0,
    secure: false,
    sameSite: 'none',
    domain: 'localhost',
    path: `/auth/${provider}`,
    httpOnly: true,
  };

  res.cookie(`${provider}-refresh-token`, '', options);
};
