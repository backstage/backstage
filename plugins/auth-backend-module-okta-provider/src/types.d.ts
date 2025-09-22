/*
 * Copyright 2020 The Backstage Authors
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

declare module 'passport-okta2' {
  import { Request } from 'express';
  import { StrategyCreated } from 'passport';

  export class Strategy {
    constructor(options: any, verify: any);
    authenticate(this: StrategyCreated<this>, req: Request, options?: any): any;
  }
}

// NOTE(freben): This entire block is here because version 0.0.6 of this library
// accidentally didn't include types. It did, however, include a scope fix that
// is interesting for Backstage to get in.
// See https://github.com/backstage/backstage/pull/29529
// See https://github.com/DavidZemon/passport-okta-oauth/pull/1
declare module '@davidzemon/passport-okta-oauth' {
  import OAuth2Strategy = require('passport-oauth2');

  type OktaStrategyOptions = UniqueOktaStrategyOptions &
    Omit<
      import('passport-oauth2')._StrategyOptionsBase,
      'authorizationURL' | 'tokenURL'
    >;
  type UniqueOktaStrategyOptions = {
    /**
     * audience is the Okta Domain, e.g. `https://example.okta.com`,
     * `https://example.oktapreview.com`
     */
    audience: string;
    /**
     * authServerID is the authorization server ID. If it is defined, the token
     * URL might be something like `https://example.okta.com/oauth2/authServerID/v1/token`
     */
    authServerID: string | undefined;
    /**
     * idp is the Identity Provider (id). This is an optional field. it's a 20 character
     * alphanumeric string, e.g. `qOp8aaJmCEhvep5Il6ZJ`  (generated example)
     */
    idp: string | undefined;
    /**
     * With this option enabled, `req` will be passed as the first argument to the
     * verify callback.
     */
    passReqToCallback: boolean | undefined;
    /**
     * Set this to 'code'
     */
    response_type: 'code';
  };

  class Strategy extends OAuth2Strategy {
    /**
     * @param {OktaStrategyOptions | undefined} options
     * @param {import("passport-oauth2").VerifyFunction | import("passport-oauth2").VerifyFunctionWithRequest} verify
     */
    constructor(
      options: OktaStrategyOptions | undefined,
      verify:
        | import('passport-oauth2').VerifyFunction
        | import('passport-oauth2').VerifyFunctionWithRequest,
    );
    _userInfoUrl: string;
    _idp: string;
    _state: any;
    /**
     * Retrieve user profile from Okta.
     * Further references at http://developer.okta.com/docs/api/resources/oidc.html#get-user-information
     *
     * This function constructs a normalized profile, with the following properties:
     *
     *   - `provider`         always set to `okta`
     *   - `id`
     *   - `username`
     *   - `displayName`
     *
     * @param {String} accessToken
     * @param {Function} done
     * @api protected
     */
    userProfile(accessToken: string, done: Function): void;
    /**
     * Return extra Okta-specific parameters to be included in the authorization
     * request.
     *
     * @param {Object} option
     * @return {Object}
     * @api protected
     */
    authorizationParams(option: any): any;
  }

  export { Strategy };
}
