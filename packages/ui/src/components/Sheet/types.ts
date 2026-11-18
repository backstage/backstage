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

import type { CSSProperties, ReactNode } from 'react';
import type {
  SheetOverlayProps as RASheetOverlayProps,
  SheetTriggerProps as RASheetTriggerProps,
} from 'react-aria-components';

/**
 * Props for the SheetTrigger component.
 * @public
 */
export interface SheetTriggerProps extends RASheetTriggerProps {}

/** @public */
export type SheetOwnProps = {
  children?: ReactNode;
  className?: string;
  /**
   * The width of the sheet panel.
   *
   * Defaults to `400px` for `left` and `right` positions, and `800px` for
   * `top`, `bottom`, and `center` positions.
   */
  width?: number | string;
  /**
   * The height of the sheet panel.
   *
   * Side sheets fill the viewport height by default, while other positions
   * size themselves to their content up to the available viewport height.
   */
  height?: number | string;
  style?: CSSProperties;
  /** Accessible label for the sheet when no SheetHeader title is rendered. */
  'aria-label'?: string;
  /** ID of an element that labels the sheet when no SheetHeader title is rendered. */
  'aria-labelledby'?: string;
  /** CSS `@keyframes` name for the animation that occurs while the user swipes. */
  swipeAnimation?: string;
  /** The snap point indices between which the swipe animation occurs. */
  swipeAnimationRange?: {
    start?: number;
    end?: number;
  };
  /**
   * CSS `@keyframes` name for the animation applied to a parent sheet when a
   * nested sheet is opened on top of it.
   */
  stackAnimation?: string;
  /**
   * Whether to add padding to the sheet so that it appears to continue outside
   * the viewport.
   *
   * @defaultValue true
   */
  overscrollPadding?: boolean;
};

/**
 * Props for the Sheet component.
 * @public
 */
export interface SheetProps
  extends SheetOwnProps,
    Omit<RASheetOverlayProps, keyof SheetOwnProps> {}

/** @public */
export type SheetHeaderOwnProps = {
  children?: ReactNode;
  className?: string;
  /**
   * The heading level of the sheet title.
   *
   * @defaultValue 3
   */
  level?: number;
};

/**
 * Props for the SheetHeader component.
 * @public
 */
export interface SheetHeaderProps
  extends SheetHeaderOwnProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, keyof SheetHeaderOwnProps> {}

/** @public */
export type SheetBodyOwnProps = {
  children?: ReactNode;
  className?: string;
};

/**
 * Props for the SheetBody component.
 * @public
 */
export interface SheetBodyProps
  extends SheetBodyOwnProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, keyof SheetBodyOwnProps> {}

/** @public */
export type SheetFooterOwnProps = {
  children?: ReactNode;
  className?: string;
};

/**
 * Props for the SheetFooter component.
 * @public
 */
export interface SheetFooterProps
  extends SheetFooterOwnProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, keyof SheetFooterOwnProps> {}
