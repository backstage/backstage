/*
 * Copyright 2022 The Backstage Authors
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

import React, { CSSProperties } from 'react';

import { PluginInfo } from '@backstage/core-plugin-api';

import Typography from '@material-ui/core/Typography';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import DescriptionIcon from '@material-ui/icons/Description';
import BurstModeIcon from '@material-ui/icons/BurstMode';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';

import { Unknown } from './unknown';

const roleIconStyle: CSSProperties = {
  marginRight: 8,
  verticalAlign: 'middle',
};

const roleIcon: Record<string, JSX.Element> = {
  'frontend-plugin': (
    <DesktopWindowsIcon fontSize="small" style={roleIconStyle} />
  ),
  'frontend-plugin-module': (
    <DescriptionIcon fontSize="small" style={roleIconStyle} />
  ),
  'common-library': <BurstModeIcon fontSize="small" style={roleIconStyle} />,
};

export function PluginRole({ info }: { info: PluginInfo }) {
  if (!info.role) {
    return <Unknown />;
  }

  const icon = roleIcon[info.role] ?? (
    <NotListedLocationIcon fontSize="small" style={roleIconStyle} />
  );
  return (
    <Typography>
      {icon}
      {info.role}
    </Typography>
  );
}
