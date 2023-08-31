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

import {
  ApiHolder,
  ApiRef,
  BackstageIdentityApi,
  IdentityApi,
  ProfileInfoApi,
  SessionApi,
  SignInPageProps,
} from '@backstage/core-plugin-api';

export type SignInProviderConfig = {
  id: string;
  title: string;
  message: string;
  apiRef: ApiRef<ProfileInfoApi & BackstageIdentityApi & SessionApi>;
};

/** @public */
export type IdentityProviders = ('guest' | 'custom' | SignInProviderConfig)[];

/**
 * Invoked when the sign-in process has failed.
 */
export type onSignInFailure = () => void;
/**
 * Invoked when the sign-in process has started.
 */
export type onSignInStarted = () => void;

export type ProviderComponent = (
  props: SignInPageProps & {
    config: SignInProviderConfig;
    onSignInStarted(): void;
    onSignInFailure(): void;
  },
) => JSX.Element;

export type ProviderLoader = (
  apis: ApiHolder,
  apiRef: ApiRef<ProfileInfoApi & BackstageIdentityApi & SessionApi>,
) => Promise<IdentityApi | undefined>;

export type SignInProvider = {
  Component: ProviderComponent;
  loader: ProviderLoader;
};
