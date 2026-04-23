/*
 * Copyright 2025 The Backstage Authors
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
 * Represents a single navigation tab in the header.
 *
 * @public
 */
export interface HeaderNavTab {
  id: string;
  label: string;
  href: string;
}

/** @internal */
export interface HeaderNavLinkProps extends HeaderNavTab {
  noTrack?: boolean;
  active: boolean;
  registerRef: (key: string, el: HTMLElement | null) => void;
  onHighlight: (key: string | null) => void;
  className?: string;
}

/**
 * Represents a group of navigation tabs rendered as a dropdown menu.
 *
 * @public
 */
export interface HeaderNavTabGroup {
  id: string;
  label: string;
  items: HeaderNavTab[];
}

/**
 * A navigation tab item — either a flat link or a dropdown group.
 *
 * @public
 */
export type HeaderNavTabItem = HeaderNavTab | HeaderNavTabGroup;

/**
 * Own props for the Header component.
 *
 * @public
 */
export interface HeaderOwnProps {
  title?: string;
  customActions?: React.ReactNode;
  tabs?: HeaderNavTabItem[];
  activeTabId?: string | null;
  breadcrumbs?: HeaderBreadcrumb[];
  className?: string;
}

/**
 * Props for the Header component.
 *
 * @public
 */
export interface HeaderProps extends HeaderOwnProps {}

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
 * @public
 * @deprecated Use {@link HeaderOwnProps} instead.
 */
export type HeaderPageOwnProps = HeaderOwnProps;

/**
 * @public
 * @deprecated Use {@link HeaderProps} instead.
 */
export type HeaderPageProps = HeaderProps;

/**
 * @public
 * @deprecated Use {@link HeaderBreadcrumb} instead.
 */
export type HeaderPageBreadcrumb = HeaderBreadcrumb;
