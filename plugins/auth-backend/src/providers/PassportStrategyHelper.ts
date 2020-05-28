import express, { CookieOptions } from 'express';
import passport from 'passport';
import { RedirectInfo, AuthInfoBase } from './types';

export const executeRedirectStrategy = async (
  req: express.Request,
  providerStrategy: passport.Strategy,
  options: any,
): Promise<RedirectInfo> => {
  return new Promise(resolve => {
    const strategy = Object.create(providerStrategy);
    strategy.redirect = (url: string, status?: number) => {
      resolve({ url, status: status ?? undefined });
    };

    strategy.authenticate(req, { ...options });
  });
};

export const executeFrameHandlerStrategy = async (
  req: express.Request,
  providerStrategy: passport.Strategy,
) => {
  return new Promise<{ user: any; info: any }>((resolve, reject) => {
    const strategy = Object.create(providerStrategy);
    strategy.success = (user: any, info: any) => {
      resolve({ user, info });
    };
    strategy.fail = (
      info: { type: 'success' | 'error'; message?: string },
      _status?: number,
    ) => {
      reject(new Error(`Authentication rejected, ${info.message ?? ''}`));
    };
    strategy.error = (error: Error) => {
      reject(new Error(`Authentication failed, ${error}`));
    };
    strategy.redirect = () => {
      reject(new Error('Unexpected redirect'));
    };

    strategy.authenticate(req);
  });
};

export const executeRefreshTokenStrategy = async (
  providerstrategy: passport.Strategy,
  refreshToken: string,
  scope: string,
): Promise<AuthInfoBase> => {
  return new Promise((resolve, reject) => {
    const anyStrategy = providerstrategy as any;
    const OAuth2 = anyStrategy._oauth2.constructor;
    const oauth2 = new OAuth2(
      anyStrategy._oauth2._clientId,
      anyStrategy._oauth2._clientSecret,
      anyStrategy._oauth2._baseSite,
      anyStrategy._oauth2._authorizeUrl,
      anyStrategy._refreshURL || anyStrategy._oauth2._accessTokenUrl,
      anyStrategy._oauth2._customHeaders,
    );

    oauth2.getOAuthAccessToken(
      refreshToken,
      {
        scope,
        grant_type: 'refresh_token',
      },
      (
        err: Error | null,
        accessToken: string,
        _refreshToken: string,
        params: any,
      ) => {
        if (err) {
          reject(new Error(`Failed to refresh access token ${err}`));
        }
        if (!accessToken) {
          reject(
            new Error(
              `Failed to refresh access token, no access token received`,
            ),
          );
        }
        resolve({
          accessToken,
          idToken: params.id_token,
          expiresInSeconds: params.expires_in,
          scope: params.scope,
        });
      },
    );
  });
};
