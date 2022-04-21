/*
 * Copyright 2022 The Backstage Authors
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
import express from 'express';
import { OAuthProviderInfo, OAuthResponse } from '../../lib/oauth';
import { AuthResponse, RedirectInfo } from '../types';

export interface OAuthProviderHandlers {
  start(
    req: express.Request,
    options: Record<string, string>,
  ): Promise<RedirectInfo>;
  handler(req: express.Request): Promise<{
    response: OAuthResponse;
    refreshToken?: string;
  }>;
  refresh?(
    refreshToken: string,
    scope: string,
  ): Promise<AuthResponse<OAuthProviderInfo>>;
  logout?(): Promise<void>;
}
