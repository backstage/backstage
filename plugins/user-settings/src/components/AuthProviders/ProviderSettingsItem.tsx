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

import { useEffect, useState } from 'react';
import {
  ShadcnButton as Button,
  ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@backstage/core-components';
import {
  ApiRef,
  SessionApi,
  SessionState,
  ProfileInfoApi,
  ProfileInfo,
  useApi,
  errorApiRef,
  IconComponent,
} from '@backstage/core-plugin-api';
import { ProviderSettingsAvatar } from './ProviderSettingsAvatar';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '../../translation';

const emptyProfile: ProfileInfo = {};

/** @public */
export const ProviderSettingsItem = (props: {
  title: string;
  description: string;
  icon: IconComponent;
  apiRef: ApiRef<ProfileInfoApi & SessionApi>;
}) => {
  const { title, description, icon: Icon, apiRef } = props;

  const api = useApi(apiRef);
  const errorApi = useApi(errorApiRef);
  const [signedIn, setSignedIn] = useState(false);
  const [profile, setProfile] = useState<ProfileInfo>(emptyProfile);
  const { t } = useTranslationRef(userSettingsTranslationRef);

  useEffect(() => {
    let didCancel = false;

    const subscription = api
      .sessionState$()
      .subscribe((sessionState: SessionState) => {
        if (sessionState !== SessionState.SignedIn) {
          setProfile(emptyProfile);
          setSignedIn(false);
        }
        if (!didCancel) {
          api
            .getProfile({ optional: true })
            .then((profileResponse: ProfileInfo | undefined) => {
              if (!didCancel) {
                if (sessionState === SessionState.SignedIn) {
                  setSignedIn(true);
                }
                if (profileResponse) {
                  setProfile(profileResponse);
                }
              }
            });
        }
      });

    return () => {
      didCancel = true;
      subscription.unsubscribe();
    };
  }, [api]);

  return (
    <TooltipProvider>
      <li className="flex items-center gap-4 px-4 py-3">
        {/* Icon area — replaces MUI ListItemIcon */}
        <div className="flex shrink-0 items-center text-muted-foreground">
          <Icon />
        </div>

        {/* Content area — replaces MUI ListItemText */}
        <div className="min-w-0 flex-1">
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <div>
                <p className="text-sm font-medium leading-none">{title}</p>
                <div className="mt-2 flex items-start gap-4">
                  {/* Avatar section */}
                  <ProviderSettingsAvatar size={48} picture={profile.picture} />
                  {/* Profile info section */}
                  <div className="flex flex-col gap-1">
                    {profile.displayName && (
                      <p className="text-sm font-medium text-foreground">
                        {profile.displayName}
                      </p>
                    )}
                    {profile.email && (
                      <p className="text-xs text-muted-foreground">
                        {profile.email}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{description}</p>
            </TooltipContent>
          </ShadcnTooltip>
        </div>

        {/* Action area — replaces MUI ListItemSecondaryAction */}
        <div className="shrink-0">
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                title={
                  signedIn
                    ? t('providerSettingsItem.title.signOut', { title })
                    : t('providerSettingsItem.title.signIn', { title })
                }
                onClick={() => {
                  const action = signedIn ? api.signOut() : api.signIn();
                  action.catch(error => errorApi.post(error));
                }}
              >
                {signedIn
                  ? t('providerSettingsItem.buttonTitle.signOut')
                  : t('providerSettingsItem.buttonTitle.signIn')}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>
                {signedIn
                  ? t('providerSettingsItem.title.signOut', { title })
                  : t('providerSettingsItem.title.signIn', { title })}
              </p>
            </TooltipContent>
          </ShadcnTooltip>
        </div>
      </li>
    </TooltipProvider>
  );
};
