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

/**
 * @public
 */
export type AuthConnectorCreateSessionOptions = {
  scopes: Set<string>;
  instantPopup?: boolean;
};

/**
 * @public
 */
export type AuthConnectorRefreshSessionOptions = {
  scopes: Set<string>;
};

/**
 * An AuthConnector is responsible for realizing auth session actions
 * by for example communicating with a backend or interacting with the user.
 *
 * @public
 */
export type AuthConnector<AuthSession> = {
  createSession(
    options: AuthConnectorCreateSessionOptions,
  ): Promise<AuthSession>;
  refreshSession(
    options?: AuthConnectorRefreshSessionOptions,
  ): Promise<AuthSession>;
  removeSession(): Promise<void>;
};

/**
 * Options for login popup
 * @public
 */
export type PopupOptions = {
  size?:
    | { width: number; height: number; fullscreen?: never }
    | { width?: never; height?: never; fullscreen: boolean };
};
