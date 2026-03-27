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

import { Settings as LucideSettingsIcon } from 'lucide-react';
import { settingsRouteRef } from '../plugin';
import { SidebarItem } from '@backstage/core-components';
import { useRouteRef, IconComponent } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '../translation';

/** Map MUI-style fontSize values to Lucide pixel sizes */
const ICON_SIZE_MAP: Record<string, number> = {
  small: 20,
  medium: 24,
  large: 35,
  inherit: 24,
};

/** Wrapper to adapt Lucide icon to Backstage's IconComponent interface */
const SettingsIcon: IconComponent = ({ fontSize = 'medium' }) => (
  <LucideSettingsIcon size={ICON_SIZE_MAP[fontSize] ?? 24} />
);

/** @public */
export const Settings = (props: { icon?: IconComponent }) => {
  const routePath = useRouteRef(settingsRouteRef);
  const Icon = props.icon ? props.icon : SettingsIcon;
  const { t } = useTranslationRef(userSettingsTranslationRef);
  return <SidebarItem text={t('sidebarTitle')} to={routePath()} icon={Icon} />;
};
