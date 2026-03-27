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

import { LogOut, MoreVertical } from 'lucide-react';
import {
  ShadcnButton as Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@backstage/core-components';
import {
  identityApiRef,
  errorApiRef,
  useApi,
  useAnalytics,
} from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '../../translation';

/** @public */
export const UserSettingsMenu = () => {
  const errorApi = useApi(errorApiRef);
  const identityApi = useApi(identityApiRef);
  const { t } = useTranslationRef(userSettingsTranslationRef);
  const analytics = useAnalytics();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          data-testid="user-settings-menu"
          aria-label={t('signOutMenu.moreIconTitle')}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          data-testid="sign-out"
          onClick={() => {
            identityApi.signOut().catch(error => errorApi.post(error));
            analytics.captureEvent('signOut', 'success');
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('signOutMenu.title')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
