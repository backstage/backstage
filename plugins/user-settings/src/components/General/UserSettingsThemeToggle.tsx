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

import { cloneElement, type ReactNode } from 'react';
import useObservable from 'react-use/esm/useObservable';
import { SunMoon } from 'lucide-react';
import {
  ShadcnButton as Button,
  ShadcnTooltip as Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  cn,
} from '@backstage/core-components';
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { userSettingsTranslationRef } from '../../translation';

type ThemeIconProps = {
  id: string;
  activeId: string | undefined;
  icon: JSX.Element | undefined;
};

const ThemeIcon = ({ id, activeId, icon }: ThemeIconProps) =>
  icon ? (
    cloneElement(icon, {
      className: cn(
        'h-4 w-4',
        activeId === id ? 'text-primary' : 'text-muted-foreground',
      ),
    })
  ) : (
    <SunMoon
      className={cn(
        'h-4 w-4',
        activeId === id ? 'text-primary' : 'text-muted-foreground',
      )}
    />
  );

type TooltipToggleButtonProps = {
  children: ReactNode;
  title: string;
  value: string;
  isActive: boolean;
  onClick: () => void;
};

/**
 * A single toggle button wrapped in a Radix Tooltip.
 * Uses shadcn/ui Button with variant switching for active/inactive state
 * and `aria-pressed` for accessible toggle semantics.
 */
const TooltipToggleButton = ({
  children,
  title,
  value,
  isActive,
  onClick,
  ...props
}: TooltipToggleButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        size="sm"
        onClick={onClick}
        className={cn(
          'rounded-none first:rounded-l-md last:rounded-r-md border-r border-input last:border-r-0',
          isActive && 'bg-accent text-accent-foreground',
        )}
        aria-pressed={isActive}
        data-value={value}
        {...props}
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent side="top">{title}</TooltipContent>
  </Tooltip>
);

/** @public */
export const UserSettingsThemeToggle = () => {
  const appThemeApi = useApi(appThemeApiRef);
  const activeThemeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );

  const themeIds = appThemeApi.getInstalledThemes();

  const { t } = useTranslationRef(userSettingsTranslationRef);

  const handleSetTheme = (newThemeId: string | undefined) => {
    if (newThemeId && themeIds.some(it => it.id === newThemeId)) {
      appThemeApi.setActiveThemeId(newThemeId);
    } else {
      appThemeApi.setActiveThemeId(undefined);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap w-full items-center justify-between pb-2 pr-4 sm:w-auto sm:pb-0">
        <div className="px-0">
          <p className="text-sm font-medium text-foreground">
            {t('themeToggle.title')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('themeToggle.description')}
          </p>
        </div>
        <div className="relative pl-4 sm:pl-0 min-w-0">
          <div
            className="flex flex-wrap rounded-md border border-input"
            role="group"
            aria-label={t('themeToggle.title')}
          >
            {themeIds.map(theme => {
              const themeId = theme.id;
              const themeIcon = theme.icon;
              const themeTitle =
                theme.title ||
                (themeId === 'light' || themeId === 'dark'
                  ? t(`themeToggle.names.${themeId}`)
                  : themeId);
              return (
                <TooltipToggleButton
                  key={themeId}
                  title={t('themeToggle.select', { theme: themeTitle })}
                  value={themeId}
                  isActive={activeThemeId === themeId}
                  onClick={() => handleSetTheme(themeId)}
                >
                  <span className="flex items-center gap-1">
                    {themeTitle}
                    <ThemeIcon
                      id={themeId}
                      icon={themeIcon}
                      activeId={activeThemeId}
                    />
                  </span>
                </TooltipToggleButton>
              );
            })}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeThemeId === undefined ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleSetTheme(undefined)}
                  className={cn(
                    'rounded-none last:rounded-r-md border-r-0',
                    activeThemeId === undefined &&
                      'bg-accent text-accent-foreground',
                  )}
                  aria-pressed={activeThemeId === undefined}
                >
                  <span className="flex items-center gap-1">
                    {t('themeToggle.names.auto')}
                    <SunMoon
                      className={cn(
                        'h-4 w-4',
                        activeThemeId === undefined
                          ? 'text-primary'
                          : 'text-muted-foreground',
                      )}
                    />
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {t('themeToggle.selectAuto')}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
