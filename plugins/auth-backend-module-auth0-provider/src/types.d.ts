/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

declare module 'passport-auth0' {
  import passport from 'passport';
  import express from 'express';

  declare class StrategyInternal extends passport.Strategy {
    constructor(
      options: StrategyInternal.StrategyOptionWithRequest,
      verify: StrategyInternal.VerifyFunctionWithRequest,
    );
    constructor(
      options: StrategyInternal.StrategyOption,
      verify: StrategyInternal.VerifyFunction,
    );

    name: string;
    authenticate(req: express.Request, options?: object): void;
    authorizationParams(options: Record<string, any>): Record<string, any>;
  }

  declare namespace StrategyInternal {
    interface Profile extends passport.Profile {
      id: string;
      displayName: string;
      gender?: string | undefined;
      ageRange?:
        | {
            min: number;
            max?: number | undefined;
          }
        | undefined;
      profileUrl?: string | undefined;
      username?: string | undefined;
      birthday: string;

      _raw: string;
      _json: any;
    }

    interface AuthenticateOptions extends passport.AuthenticateOptions {
      authType?: string | undefined;
    }

    interface StrategyOption {
      clientID: string;
      clientSecret: string;
      callbackURL: string;
      domain: string;
      scopeSeparator?: string | undefined;
      enableProof?: boolean | undefined;
      profileFields?: string[] | undefined;
      state?: boolean | undefined;
    }

    interface StrategyOptionWithRequest extends StrategyOption {
      passReqToCallback: true;
    }
    interface ExtraVerificationParams {
      audience?: string | undefined;
      connection?: string | undefined;
      prompt?: string | undefined;
    }

    type VerifyFunction = (
      accessToken: string,
      refreshToken: string,
      extraParams: ExtraVerificationParams,
      profile: Profile,
      done: (error: any, user?: any, info?: any) => void,
    ) => void;

    type VerifyFunctionWithRequest = (
      req: express.Request,
      accessToken: string,
      refreshToken: string,
      extraParams: ExtraVerificationParams,
      profile: Profile,
      done: (error: any, user?: any, info?: any) => void,
    ) => void;

    export import Strategy = StrategyInternal;
  }

  export = StrategyInternal;
}
