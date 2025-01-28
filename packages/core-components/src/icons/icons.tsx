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

import { IconComponent, useApp } from '@backstage/core-plugin-api';
import MuiBrokenImageIcon from '@material-ui/icons/BrokenImage';
import { ComponentProps } from 'react';

/**
 * @public
 * Props for the {@link @backstage/core-plugin-api#IconComponent} component.
 */
export type IconComponentProps = ComponentProps<IconComponent>;

/**
 * @public
 * Props for the {@link AppIcon} component.
 */
export type AppIconProps = IconComponentProps & {
  // The key of the system icon to render.
  id: string;
  // An optional fallback icon component to render when the system icon is not found.
  // Default to () => null.
  Fallback?: IconComponent;
};

/**
 * @public
 * A component that renders a system icon by its id.
 */
export function AppIcon(props: AppIconProps) {
  const { id: key, Fallback = MuiBrokenImageIcon, ...rest } = props;
  const app = useApp();
  const Icon = app.getSystemIcon(key) ?? Fallback;
  return <Icon {...rest} />;
}

// Should match the list of overridable system icon keys in @backstage/core-app-api
/**
 * Broken Image Icon
 * @public
 */
export function BrokenImageIcon(props: IconComponentProps) {
  return <AppIcon id="brokenImage" {...props} />;
}
/** @public */
export function CatalogIcon(props: IconComponentProps) {
  return <AppIcon id="catalog" {...props} />;
}
/** @public */
export function ChatIcon(props: IconComponentProps) {
  return <AppIcon id="chat" {...props} />;
}
/** @public */
export function DashboardIcon(props: IconComponentProps) {
  return <AppIcon id="dashboard" {...props} />;
}
/** @public */
export function DocsIcon(props: IconComponentProps) {
  return <AppIcon id="docs" {...props} />;
}
/** @public */
export function EmailIcon(props: IconComponentProps) {
  return <AppIcon id="email" {...props} />;
}
/** @public */
export function GitHubIcon(props: IconComponentProps) {
  return <AppIcon id="github" {...props} />;
}
/** @public */
export function GroupIcon(props: IconComponentProps) {
  return <AppIcon id="group" {...props} />;
}
/** @public */
export function HelpIcon(props: IconComponentProps) {
  return <AppIcon id="help" {...props} />;
}
/** @public */
export function UserIcon(props: IconComponentProps) {
  return <AppIcon id="user" {...props} />;
}
/** @public */
export function WarningIcon(props: IconComponentProps) {
  return <AppIcon id="warning" {...props} />;
}
/** @public */
export function StarIcon(props: IconComponentProps) {
  return <AppIcon id="star" {...props} />;
}
/** @public */
export function UnstarredIcon(props: IconComponentProps) {
  return <AppIcon id="unstarred" {...props} />;
}
