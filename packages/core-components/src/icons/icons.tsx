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
 * @deprecated Legacy icon wrapper props. The new frontend system's
 * `useApi(coreApis.icons).icon(key)` returns an icon element to render directly;
 * import `useApi` and `coreApis` from `@backstage/frontend-plugin-api`.
 */
export type IconComponentProps = ComponentProps<IconComponent>;

/**
 * @public
 * Props for the {@link AppIcon} component.
 * @deprecated Legacy icon wrapper props. See {@link AppIcon} for migration guidance.
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
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon(id)`, importing `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api`, to retain app icon customization. Render the
 * returned icon element directly and handle an undefined result with your own
 * fallback; this is not an icon component accepting the legacy wrapper props.
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
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('brokenImage')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function BrokenImageIcon(props: IconComponentProps) {
  return <AppIcon id="brokenImage" {...props} />;
}
/**
 * @public
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('catalog')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function CatalogIcon(props: IconComponentProps) {
  return <AppIcon id="catalog" {...props} />;
}
/**
 * @public
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('chat')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function ChatIcon(props: IconComponentProps) {
  return <AppIcon id="chat" {...props} />;
}
/**
 * @public
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('dashboard')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function DashboardIcon(props: IconComponentProps) {
  return <AppIcon id="dashboard" {...props} />;
}
/**
 * @public
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('docs')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function DocsIcon(props: IconComponentProps) {
  return <AppIcon id="docs" {...props} />;
}
/**
 * @public
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('email')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function EmailIcon(props: IconComponentProps) {
  return <AppIcon id="email" {...props} />;
}
/**
 * @public
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('github')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function GitHubIcon(props: IconComponentProps) {
  return <AppIcon id="github" {...props} />;
}
/**
 * @public
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('group')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function GroupIcon(props: IconComponentProps) {
  return <AppIcon id="group" {...props} />;
}
/**
 * @public
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('help')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function HelpIcon(props: IconComponentProps) {
  return <AppIcon id="help" {...props} />;
}
/**
 * @public
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('user')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function UserIcon(props: IconComponentProps) {
  return <AppIcon id="user" {...props} />;
}
/**
 * @public
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('warning')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function WarningIcon(props: IconComponentProps) {
  return <AppIcon id="warning" {...props} />;
}
/**
 * @public
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('star')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function StarIcon(props: IconComponentProps) {
  return <AppIcon id="star" {...props} />;
}
/**
 * @public
 * @deprecated Legacy icon wrapper, superseded for new frontend development. Use
 * `useApi(coreApis.icons).icon('unstarred')` with `useApi` and `coreApis` from
 * `@backstage/frontend-plugin-api` to retain app icon customization. Render the
 * returned icon element directly, handling an undefined result as needed.
 */
export function UnstarredIcon(props: IconComponentProps) {
  return <AppIcon id="unstarred" {...props} />;
}
