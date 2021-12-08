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
// Remove oauth2ApiRef
// Remove oidcAuthApiRef
// Investigate oneloginAuthApiRef, also remove?
// Investigate samlAuthApiRef, also remove?

// Rename AuthProvider to something more specific

// Possibly rename AuthRequester to something less awkward?
// AuthRequester -> OAuthRequester
// AuthRequesterOptions -> OAuthRequesterOptions
// AuthRequestOptions -> OAuthRequestOptions
// AuthRequester options instead of plain scopes param

// Possibly DiscoveryApi -> PluginDiscoveryApi and getBaseUrl -> getPluginBaseUrl?

// ErrorApiErrorContext: rename hidden?

// Rename ProfileInfoApi: rename getProfile -> getProfileInfo?

// Investigate StorageApi, async get?
