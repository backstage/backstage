import { OAuthPendingRequests } from 'shared/apis/oauth/OAuthPendingRequests';
import { GoogleSession } from './types';

export const googleAuthPendingRequests = new OAuthPendingRequests<GoogleSession>();
