/*
 * Copyright 2024 The Backstage Authors
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

/**
 * Props for the main Header component.
 *
 * @public
 */
export interface HeaderProps {
  icon?: React.ReactNode;
  title?: string;
  breadcrumbs?: HeaderBreadcrumb[];
  customActions?: React.ReactNode;
  menuItems?: HeaderMenuItem[];
  tabs?: HeaderTab[];
}

/**
 * Represents a tab item in the header navigation.
 *
 * @public
 */
export interface HeaderTab {
  id: string;
  label: string;
  href?: string;
}

/**
 * Represents an option item in the header dropdown menu.
 *
 * @public
 */
export interface HeaderMenuItem {
  label: string;
  value: string;
  onClick?: () => void;
}

/**
 * Represents a breadcrumb item in the header.
 *
 * @public
 */
export interface HeaderBreadcrumb {
  label: string;
  href: string;
}

/**
 * Props for the HeaderToolbar component.
 *
 * @internal
 */
export interface HeaderToolbarProps {
  icon?: HeaderProps['icon'];
  title?: HeaderProps['title'];
  breadcrumbs?: HeaderProps['breadcrumbs'];
  customActions?: HeaderProps['customActions'];
  menuItems?: HeaderProps['menuItems'];
  hasTabs?: boolean;
}
