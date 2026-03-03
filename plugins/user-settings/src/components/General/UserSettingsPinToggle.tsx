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
  Switch,
  ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  useSidebarPinState,
} from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '../../translation';

/** @public */
export const UserSettingsPinToggle = () => {
  const { isPinned, toggleSidebarPinState } = useSidebarPinState();
  const { t } = useTranslationRef(userSettingsTranslationRef);

  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div>
        <p className="text-sm font-medium text-foreground">
          {t('pinToggle.title')}
        </p>
        <p className="text-xs text-muted-foreground">
          {t('pinToggle.description')}
        </p>
      </div>
      <div>
        <TooltipProvider>
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <span>
                <Switch
                  checked={isPinned}
                  onCheckedChange={() => toggleSidebarPinState()}
                  name="pin"
                  aria-label={t('pinToggle.ariaLabelTitle')}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {isPinned
                ? t('pinToggle.switchTitles.unpin')
                : t('pinToggle.switchTitles.pin')}
            </TooltipContent>
          </ShadcnTooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
