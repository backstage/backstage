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
 * Shared text styling props used by Breadcrumbs, BreadcrumbSegment, and BreadcrumbCurrent.
 *
 * @public
 */
export type BreadcrumbTextProps = Pick<
  TextOwnProps,
  'variant' | 'weight' | 'color'
>;

/**
 * Own props for the {@link Breadcrumbs} component.
 *
 * @public
 */
export interface BreadcrumbsOwnProps extends BreadcrumbTextProps {
  children: React.ReactNode;
  className?: string;
  separator?: React.ReactNode;
}

/**
 * Props for the {@link Breadcrumbs} component.
 *
 * @public
 */
export interface BreadcrumbsProps extends BreadcrumbsOwnProps {}

/**
 * Own props for the {@link BreadcrumbSegment} component.
 *
 * @public
 */
export interface BreadcrumbSegmentOwnProps extends BreadcrumbTextProps {
  href: string;
  children: React.ReactNode;
}

/**
 * Props for the {@link BreadcrumbSegment} component.
 *
 * @public
 */
export interface BreadcrumbSegmentProps extends BreadcrumbSegmentOwnProps {}

/**
 * Own props for the {@link BreadcrumbCurrent} component.
 *
 * @public
 */
export interface BreadcrumbCurrentOwnProps extends BreadcrumbTextProps {
  as?: TextOwnProps['as'];
  children: React.ReactNode;
}

/**
 * Props for the {@link BreadcrumbCurrent} component.
 *
 * @public
 */
export interface BreadcrumbCurrentProps extends BreadcrumbCurrentOwnProps {}
