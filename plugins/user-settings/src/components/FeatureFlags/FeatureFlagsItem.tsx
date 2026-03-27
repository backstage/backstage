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
} from '@backstage/core-components';
import { FeatureFlag } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '../../translation';
import { TranslationFunction } from '@backstage/core-plugin-api/alpha';

type Props = {
  flag: FeatureFlag;
  enabled: boolean;
  toggleHandler: Function;
};

const getSecondaryText = (
  flag: FeatureFlag,
  t: TranslationFunction<typeof userSettingsTranslationRef.T>,
) => {
  if (flag.description) {
    return flag.description;
  }
  return flag.pluginId
    ? t('featureFlags.flagItem.subtitle.registeredInPlugin', {
        pluginId: flag.pluginId,
      })
    : t('featureFlags.flagItem.subtitle.registeredInApplication');
};

export const FlagItem = ({ flag, enabled, toggleHandler }: Props) => {
  const { t } = useTranslationRef(userSettingsTranslationRef);

  return (
    <div
      className="flex items-center gap-3 border-b border-border px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => toggleHandler(flag.name)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleHandler(flag.name);
        }
      }}
    >
      <div className="flex items-center shrink-0">
        <ShadcnTooltip>
          <TooltipTrigger asChild>
            {/* eslint-disable-next-line react/forbid-elements -- replacing MUI Typography with Tailwind-styled span during shadcn/ui migration */}
            <span>
              <Switch
                checked={enabled}
                onCheckedChange={() => toggleHandler(flag.name)}
                name={flag.name}
                aria-label={
                  enabled
                    ? t('featureFlags.flagItem.title.disable')
                    : t('featureFlags.flagItem.title.enable')
                }
              />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            {enabled
              ? t('featureFlags.flagItem.title.disable')
              : t('featureFlags.flagItem.title.enable')}
          </TooltipContent>
        </ShadcnTooltip>
      </div>
      <div className="flex flex-col min-w-0">
        {/* eslint-disable-next-line react/forbid-elements -- replacing MUI Typography with Tailwind-styled span during shadcn/ui migration */}
        <span className="text-sm font-medium text-foreground truncate">
          {flag.name}
        </span>
        {/* eslint-disable-next-line react/forbid-elements -- replacing MUI Typography with Tailwind-styled span during shadcn/ui migration */}
        <span className="text-xs text-muted-foreground truncate">
          {getSecondaryText(flag, t)}
        </span>
      </div>
    </div>
  );
};
