// /*
//  * Copyright 2020 Spotify AB
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// import passport from 'passport';
// import express from 'express';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import {
//   AuthProvider,
//   AuthProviderRouteHandlers,
//   AuthProviderConfig,
// } from './../types';
// import { postMessageResponse, ensuresXRequestedWith } from './../utils';
// import { InputError } from '@backstage/backend-common';

// export class GoogleAuthProvider
//   implements AuthProvider, AuthProviderRouteHandlers {
//   private readonly provider: string;
//   private readonly providerConfig: AuthProviderConfig;
//   private readonly _strategy: GoogleStrategy;

//   constructor(handler: OAuthProviderHandlers) {
//     this.provider = providerConfig.provider;
//     this.providerConfig = providerConfig;
//     // TODO: throw error if env variables not set?
//     this._strategy = new GoogleStrategy(
//       { ...this.providerConfig.options },
//       (
//         accessToken: any,
//         refreshToken: any,
//         params: any,
//         profile: any,
//         done: any,
//       ) => {
//         done(
//           undefined,
//           {
//             profile,
//             idToken: params.id_token,
//             accessToken,
//             scope: params.scope,
//             expiresInSeconds: params.expires_in,
//           },
//           {
//             refreshToken,
//           },
//         );
//       },
//     );
//   }

//   async start(req: express.Request, res: express.Response) {
//     const scope = req.query.scope?.toString() ?? '';

//     if (!scope) {
//       throw new InputError('missing scope parameter');
//     }

//     // router -> [AuthProviderRouteHandlers] -> OAuthProvider -> [OAuthProviderHandler] -> GoogleAuthProvider
//     // router -> [AuthProviderRouteHandlers] -> GoogleAuthProvider

//     // class GoogleAuthProvider2 implements OAuthProviderHandler {
//     //   async start(req: express.Request): Promise<RedirectInfo> {

//     //   }
//     //   async handler(req: express.Request): Promise<AuthInfo> {
//     //     const { user, info } = await executeFrameHandlerStrategy(
//     //       req,
//     //       this.provider,
//     //       this._strategy,
//     //     );
//     //     return { user, info }
//     //   }
//     // }

//     executeRedirectStrategy(req, res, this.provider, this._strategy, {
//       scope,
//       accessType: 'offline',
//       prompt: 'consent',
//     });
//   }

//   async frameHandler(req: express.Request, res: express.Response) {
//     try {
//       // const { user, info } = await this.handler.handler(req);
//       const { user, info } = await executeFrameHandlerStrategy(req);

//       const { refreshToken } = info;
//       if (!refreshToken) {
//         throw new Error('Missing refresh token');
//       }

//       setRefreshTokenCookie(res, this.provider, refreshToken);

//       return postMessageResponse(res, {
//         type: 'auth-result',
//         payload: user,
//       });
//     } catch (error) {
//       return postMessageResponse(res, {
//         type: 'auth-result',
//         error: {
//           name: error.name,
//           message: error.message,
//         },
//       });
//     }
//   }

//   async logout(req: express.Request, res: express.Response) {
//     if (!ensuresXRequestedWith(req)) {
//       return res.status(401).send('Invalid X-Requested-With header');
//     }

//     removeRefreshTokenCookie(res, this.provider);
//     return res.send('logout!');
//   }

//   async refresh(req: express.Request, res: express.Response) {
//     if (!ensuresXRequestedWith(req)) {
//       return res.status(401).send('Invalid X-Requested-With header');
//     }

//     try {
//       const refreshInfo = await executeRefreshTokenStrategy(
//         req,
//         this.provider,
//         this._strategy,
//       );
//       res.send(refreshInfo);
//     } catch (error) {
//       res.status(401).send(`${error.message}`);
//     }
//   }

//   strategy(): passport.Strategy {
//     return this._strategy;
//   }
// }
