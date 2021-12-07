import { BackstageTheme } from '@backstage/theme';
import { ComponentType } from 'react';
import { Config } from '@backstage/config';
import { Observable as Observable_2 } from '@backstage/types';
import { ReactElement } from 'react';
import { ReactNode } from 'react';

// AnalyticsApi:
// Check with Eric if there are any changes he wants to do to the AnalyticsApi
// Remove AnyAnalyticsContext?
// CommonAnalyticsContext fields?

// AppTheme:
// variant -> mode?

// Mark ALL the auth APIs as experimental

// Remove auth0AuthApiRef

// @public
export const auth0AuthApiRef: ApiRef<
  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
>;

// @public
export type AuthProvider = {
  title: string;
  icon: IconComponent;
};

// @public
export type IconComponent = ComponentType<{
  fontSize?: 'default' | 'small' | 'large';
}>;

// @public
export type AuthRequester<AuthResponse> = (
  scopes: Set<string>,
) => Promise<AuthResponse>;

// @public
export type AuthRequesterOptions<AuthResponse> = {
  provider: AuthProvider;
  onAuthRequest(scopes: Set<string>): Promise<AuthResponse>;
};

// @public
export type AuthRequestOptions = {
  optional?: boolean;
  instantPopup?: boolean;
};

// @public
export type BackstageIdentityApi = {
  getBackstageIdentity(
    options?: AuthRequestOptions,
  ): Promise<BackstageIdentityResponse | undefined>;
};

// @public
export type BackstageIdentityResponse = {
  id: string;
  token: string;
  identity: BackstageUserIdentity;
};

// @public
export type BackstageUserIdentity = {
  type: 'user';
  userEntityRef: string;
  ownershipEntityRefs: string[];
};

// @public
export const bitbucketAuthApiRef: ApiRef<
  OAuthApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
>;

// @public
export type ConfigApi = Config;

// @public
export const configApiRef: ApiRef<ConfigApi>;

// @public
export type DiscoveryApi = {
  getBaseUrl(pluginId: string): Promise<string>;
};

// @public
export const discoveryApiRef: ApiRef<DiscoveryApi>;

// @public
export type ErrorApi = {
  post(error: ErrorApiError, context?: ErrorApiErrorContext): void;
  error$(): Observable_2<{
    error: ErrorApiError;
    context?: ErrorApiErrorContext;
  }>;
};

// @public
export type ErrorApiError = {
  name: string;
  message: string;
  stack?: string;
};

// @public
export type ErrorApiErrorContext = {
  hidden?: boolean;
};

// @public
export const errorApiRef: ApiRef<ErrorApi>;

// @public
export type FeatureFlag = {
  name: string;
  pluginId: string;
};

// @public
export interface FeatureFlagsApi {
  getRegisteredFlags(): FeatureFlag[];
  isActive(name: string): boolean;
  registerFlag(flag: FeatureFlag): void;
  save(options: FeatureFlagsSaveOptions): void;
}

// @public
export const featureFlagsApiRef: ApiRef<FeatureFlagsApi>;

// @public
export type FeatureFlagsHooks = {
  register(name: string): void;
};

// @public
export type FeatureFlagsSaveOptions = {
  states: Record<string, FeatureFlagState>;
  merge?: boolean;
};

// @public
export enum FeatureFlagState {
  Active = 1,
  None = 0,
}

// @public
export const githubAuthApiRef: ApiRef<
  OAuthApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
>;

// @public
export const gitlabAuthApiRef: ApiRef<
  OAuthApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
>;

// @public
export const googleAuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
>;

// @public
export type IdentityApi = {
  getUserId(): string;
  getIdToken(): Promise<string | undefined>;
  getProfile(): ProfileInfo;
  getProfileInfo(): Promise<ProfileInfo>;
  getBackstageIdentity(): Promise<BackstageUserIdentity>;
  getCredentials(): Promise<{
    token?: string;
  }>;
  signOut(): Promise<void>;
};

// @public
export const identityApiRef: ApiRef<IdentityApi>;

// @public
export const microsoftAuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
>;

// @public
export const oauth2ApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
>;

// @public
export type OAuthApi = {
  getAccessToken(
    scope?: OAuthScope,
    options?: AuthRequestOptions,
  ): Promise<string>;
};

// @public
export type OAuthRequestApi = {
  createAuthRequester<AuthResponse>(
    options: AuthRequesterOptions<AuthResponse>,
  ): AuthRequester<AuthResponse>;
  authRequest$(): Observable_2<PendingAuthRequest[]>;
};

// @public
export const oauthRequestApiRef: ApiRef<OAuthRequestApi>;

// @public
export type OAuthScope = string | string[];

// @public
export const oidcAuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
>;

// @public
export const oktaAuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
>;

// @public
export const oneloginAuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
>;

// @public
export type OpenIdConnectApi = {
  getIdToken(options?: AuthRequestOptions): Promise<string>;
};

// @public
export type PendingAuthRequest = {
  provider: AuthProvider;
  reject: () => void;
  trigger(): Promise<void>;
};

// @public
export type ProfileInfo = {
  email?: string;
  displayName?: string;
  picture?: string;
};

// @public
export type ProfileInfoApi = {
  getProfile(options?: AuthRequestOptions): Promise<ProfileInfo | undefined>;
};

// @public
export const samlAuthApiRef: ApiRef<
  ProfileInfoApi & BackstageIdentityApi & SessionApi
>;

// @public
export type SessionApi = {
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  sessionState$(): Observable_2<SessionState>;
};

// @public
export enum SessionState {
  SignedIn = 'SignedIn',
  SignedOut = 'SignedOut',
}

// @public
export interface StorageApi {
  forBucket(name: string): StorageApi;
  get<T>(key: string): T | undefined;
  observe$<T>(key: string): Observable_2<StorageValueChange<T>>;
  remove(key: string): Promise<void>;
  set(key: string, data: any): Promise<void>;
}

// @public
export const storageApiRef: ApiRef<StorageApi>;

// @public
export type StorageValueChange<T = any> = {
  key: string;
  newValue?: T;
};
