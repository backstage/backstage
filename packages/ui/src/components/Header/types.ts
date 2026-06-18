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
 * Represents a tag item in the header.
 *
 * @public
 */
export interface HeaderTag {
  label: string;
  href?: string;
}

/**
 * Represents a metadata key-value pair in the header.
 *
 * @public
 */
export interface HeaderMetadataItem {
  label: string;
  value: React.ReactNode;
}

/**
 * Represents a user in the HeaderMetadataUsers component.
 *
 * @public
 */
export interface HeaderMetadataUser {
  name: string;
  src?: string;
  href?: string;
}

/**
 * Represents a status item in the HeaderMetadataStatus component.
 *
 * @public
 */
export interface HeaderMetadataStatusProps {
  label: string;
  color: 'danger' | 'warning' | 'success' | 'info';
  href?: string;
}

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
  /**
   * @deprecated The breadcrumbs prop will be removed in a future release.
   */
  breadcrumbs?: HeaderBreadcrumb[];
  /**
   * Markdown string rendered below the title. Only inline links are supported.
   * Bold, italic, and block-level markdown are not rendered.
   */
  description?: string;
  tags?: HeaderTag[];
  metadata?: HeaderMetadataItem[];
  className?: string;
  /**
   * Makes the title-and-actions row stick to the top of its nearest scroll
   * container while the rest of the header content scrolls away.
   */
  sticky?: boolean;
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
