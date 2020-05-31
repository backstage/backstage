import express from 'express';
import passport from 'passport';
import {
  executeRedirectStrategy,
  executeFrameHandlerStrategy,
  executeRefreshTokenStrategy,
} from './PassportStrategyHelper';
import { RedirectInfo } from './types';

const mockRequest = ({} as unknown) as express.Request;

describe('PassportStrategyHelper', () => {
  class MyCustomRedirectStrategy extends passport.Strategy {
    authenticate(_req: express.Request, options: any) {
      this.redirect('a', 302);
    }
  }

  describe('executeRedirectStrategy', () => {
    it('should call authenticate and resolve with RedirectInfo', () => {
      const mockStrategy = new MyCustomRedirectStrategy();
      const spyAuthenticate = jest.spyOn(mockStrategy, 'authenticate');
      const redirectStrategyPromise = executeRedirectStrategy(
        mockRequest,
        mockStrategy,
        {},
      );
      expect(spyAuthenticate).toBeCalledTimes(1);
      expect(redirectStrategyPromise).resolves.toStrictEqual(
        expect.objectContaining({ url: 'a', status: 302 }),
      );
    });
  });

  describe('executeFrameHandlerStrategy', () => {
    class MyCustomAuthSuccessStrategy extends passport.Strategy {
      authenticate(_req: express.Request, options: any) {
        this.success(
          { accessToken: 'ACCESS_TOKEN' },
          { refreshToken: 'REFRESH_TOKEN' },
        );
      }
    }
    class MyCustomAuthErrorStrategy extends passport.Strategy {
      authenticate(_req: express.Request, options: any) {
        this.error(new Error('MyCustomAuth error'));
      }
    }
    class MyCustomAuthRedirectStrategy extends passport.Strategy {
      authenticate(_req: express.Request, options: any) {
        this.redirect('URL', 302);
      }
    }
    class MyCustomAuthFailStrategy extends passport.Strategy {
      authenticate(_req: express.Request, options: any) {
        this.fail('challenge', 302);
      }
    }

    it('should resolve with user and info on success', () => {
      const mockStrategy = new MyCustomAuthSuccessStrategy();
      const spyAuthenticate = jest.spyOn(mockStrategy, 'authenticate');
      const frameHandlerStrategyPromise = executeFrameHandlerStrategy(
        mockRequest,
        mockStrategy,
      );
      expect(spyAuthenticate).toBeCalledTimes(1);
      expect(frameHandlerStrategyPromise).resolves.toStrictEqual(
        expect.objectContaining({
          user: { accessToken: 'ACCESS_TOKEN' },
          info: { refreshToken: 'REFRESH_TOKEN' },
        }),
      );
    });

    it('should reject on error', () => {
      const mockStrategy = new MyCustomAuthErrorStrategy();
      const spyAuthenticate = jest.spyOn(mockStrategy, 'authenticate');
      const frameHandlerStrategyPromise = executeFrameHandlerStrategy(
        mockRequest,
        mockStrategy,
      );
      expect(spyAuthenticate).toBeCalledTimes(1);
      expect(frameHandlerStrategyPromise).rejects.toThrowError(
        'Authentication failed, Error: MyCustomAuth error',
      );
    });

    it('should reject on redirect', () => {
      const mockStrategy = new MyCustomAuthRedirectStrategy();
      const spyAuthenticate = jest.spyOn(mockStrategy, 'authenticate');
      const frameHandlerStrategyPromise = executeFrameHandlerStrategy(
        mockRequest,
        mockStrategy,
      );
      expect(spyAuthenticate).toBeCalledTimes(1);
      expect(frameHandlerStrategyPromise).rejects.toThrowError(
        'Unexpected redirect',
      );
    });

    it('should reject on fail', () => {
      const mockStrategy = new MyCustomAuthFailStrategy();
      const spyAuthenticate = jest.spyOn(mockStrategy, 'authenticate');
      const frameHandlerStrategyPromise = executeFrameHandlerStrategy(
        mockRequest,
        mockStrategy,
      );
      expect(spyAuthenticate).toBeCalledTimes(1);
      expect(frameHandlerStrategyPromise).rejects.toThrow();
    });
  });

  describe('executeRefreshTokenStrategy', () => {
    it('should resolve with a new access token, scope and expiry', () => {
      class MyCustomOAuth2Success {
        constructor() {}
        getOAuthAccessToken(
          _refreshToken: string,
          _options: any,
          callback: Function,
        ) {
          callback(null, 'ACCESS_TOKEN', 'REFRESH_TOKEN', {
            scope: 'a',
            expires_in: 10,
          });
        }
      }
      class MyCustomRefreshTokenSuccess extends passport.Strategy {
        private _oauth2 = new MyCustomOAuth2Success();
      }

      const mockStrategy = new MyCustomRefreshTokenSuccess();
      const refreshTokenPromise = executeRefreshTokenStrategy(
        mockStrategy,
        'REFRESH_TOKEN',
        'a',
      );
      expect(refreshTokenPromise).resolves.toStrictEqual(
        expect.objectContaining({
          accessToken: 'ACCESS_TOKEN',
          params: expect.objectContaining({ scope: 'a', expires_in: 10 }),
        }),
      );
    });

    it('should reject with an error if refresh failed', () => {
      class MyCustomOAuth2Error {
        constructor() {}
        getOAuthAccessToken(
          _refreshToken: string,
          _options: any,
          callback: Function,
        ) {
          callback(new Error('Unknown error'));
        }
      }
      class MyCustomRefreshTokenSuccess extends passport.Strategy {
        private _oauth2 = new MyCustomOAuth2Error();
      }

      const mockStrategy = new MyCustomRefreshTokenSuccess();
      const refreshTokenPromise = executeRefreshTokenStrategy(
        mockStrategy,
        'REFRESH_TOKEN',
        'a',
      );
      expect(refreshTokenPromise).rejects.toThrow(
        'Failed to refresh access token Error: Unknown error',
      );
    });

    it('should reject with an error if access token missing in refresh callback', () => {
      class MyCustomOAuth2AccessTokenMissing {
        constructor() {}
        getOAuthAccessToken(
          _refreshToken: string,
          _options: any,
          callback: Function,
        ) {
          callback(null, '');
        }
      }
      class MyCustomRefreshTokenSuccess extends passport.Strategy {
        private _oauth2 = new MyCustomOAuth2AccessTokenMissing();
      }

      const mockStrategy = new MyCustomRefreshTokenSuccess();
      const refreshTokenPromise = executeRefreshTokenStrategy(
        mockStrategy,
        'REFRESH_TOKEN',
        'a',
      );
      expect(refreshTokenPromise).rejects.toThrow(
        'Failed to refresh access token, no access token received',
      );
    });
  });
});
