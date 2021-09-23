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

import MuiBrokenImageIcon from '@material-ui/icons/BrokenImage';
import React, { ComponentProps } from 'react';
import { useApp, IconComponent } from '@backstage/core-plugin-api';

type IconComponentProps = ComponentProps<IconComponent>;

function useSystemIcon(key: string, props: IconComponentProps) {
  const app = useApp();
  const Icon = app.getSystemIcon(key);
  return Icon ? <Icon {...props} /> : <MuiBrokenImageIcon {...props} />;
}

// Should match the list of overridable system icon keys in @backstage/core-app-api
export function BrokenImageIcon(props: IconComponentProps) {
  return useSystemIcon('brokenImage', props);
}
export function CatalogIcon(props: IconComponentProps) {
  return useSystemIcon('catalog', props);
}
export function ChatIcon(props: IconComponentProps) {
  return useSystemIcon('chat', props);
}
export function DashboardIcon(props: IconComponentProps) {
  return useSystemIcon('dashboard', props);
}
export function DocsIcon(props: IconComponentProps) {
  return useSystemIcon('docs', props);
}
export function EmailIcon(props: IconComponentProps) {
  return useSystemIcon('email', props);
}
export function GitHubIcon(props: IconComponentProps) {
  return useSystemIcon('github', props);
}
export function GroupIcon(props: IconComponentProps) {
  return useSystemIcon('group', props);
}
export function HelpIcon(props: IconComponentProps) {
  return useSystemIcon('help', props);
}
export function UserIcon(props: IconComponentProps) {
  return useSystemIcon('user', props);
}
export function WarningIcon(props: IconComponentProps) {
  return useSystemIcon('warning', props);
}
