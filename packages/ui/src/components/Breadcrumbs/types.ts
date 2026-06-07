/*
 * Copyright 2026 The Backstage Authors
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

import type { TextOwnProps } from '../Text/types';

/**
 * Shared style props available on both Breadcrumbs (as defaults) and
 * individual Breadcrumb items (as overrides).
 *
 * @public
 */
export interface BreadcrumbStyleProps {
  variant?: TextOwnProps['variant'];
  color?: TextOwnProps['color'];
  weight?: TextOwnProps['weight'];
}

/**
 * Own props for the {@link Breadcrumb} component.
 *
 * @public
 */
export interface BreadcrumbOwnProps extends BreadcrumbStyleProps {
  as?: TextOwnProps['as'];
  href?: string;
  children: React.ReactNode;
}

/**
 * Props for the {@link Breadcrumb} component.
 *
 * @public
 */
export interface BreadcrumbProps extends BreadcrumbOwnProps {}

/**
 * Own props for the {@link Breadcrumbs} component.
 *
 * @public
 */
export interface BreadcrumbsOwnProps extends BreadcrumbStyleProps {
  'aria-label'?: string;
  currentAs?: BreadcrumbOwnProps['as'];
  separator?: React.ReactNode;
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
}

/**
 * Props for the {@link Breadcrumbs} component.
 *
 * @public
 */
export interface BreadcrumbsProps extends BreadcrumbsOwnProps {}
