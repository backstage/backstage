/*
 * Copyright 2023 The Backstage Authors
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

import React, { ReactElement, ReactNode } from 'react';
import { Layout } from 'react-grid-layout';
import { z } from 'zod';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

const RSJFTypeSchema: z.ZodType<RJSFSchema> = z.any();
const RSJFTypeUiSchema: z.ZodType<UiSchema> = z.any();
const ReactElementSchema: z.ZodType<ReactElement> = z.any();
const LayoutSchema: z.ZodType<Layout> = z.any();

/**
 * Breakpoint options for <CustomHomepageGridProps/>
 *
 * @public
 */
export type Breakpoint = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props customizing the <CustomHomepageGrid/> component.
 *
 * @public
 */
export type CustomHomepageGridProps = {
  /**
   * Children contain all widgets user can configure on their own homepage.
   */
  children?: ReactNode;
  /**
   * Default layout for the homepage before users have modified it.
   */
  config?: LayoutConfiguration[];
  /**
   * Height of grid row in pixels.
   * @defaultValue 60
   */
  rowHeight?: number;
  /**
   * Screen width in pixels for different breakpoints.
   * @defaultValue theme breakpoints
   */
  breakpoints?: Record<Breakpoint, number>;
  /**
   * Number of grid columns for different breakpoints.
   * @defaultValue \{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 \}
   */
  cols?: Record<Breakpoint, number>;
  /**
   * Grid container padding (x, y) in pixels for all or specific breakpoints.
   * @defaultValue [0, 0]
   * @example [10, 10]
   * @example \{ lg: [10, 10] \}
   */
  containerPadding?: [number, number] | Record<Breakpoint, [number, number]>;
  /**
   * Grid container margin (x, y) in pixels for all or specific breakpoints.
   * @defaultValue [0, 0]
   * @example [10, 10]
   * @example \{ lg: [10, 10] \}
   */
  containerMargin?: [number, number] | Record<Breakpoint, [number, number]>;
  /**
   * Maximum number of rows user can have in the grid.
   * @defaultValue unlimited
   */
  maxRows?: number;
  /**
   * Custom style for grid.
   */
  style?: React.CSSProperties;
  /**
   * Compaction type of widgets in the grid. This controls where widgets are moved in case
   * they are overlapping in the grid.
   */
  compactType?: 'vertical' | 'horizontal' | null;
  /**
   * Controls if widgets can overlap in the grid. If true, grid can be placed one over the other.
   * @defaultValue false
   */
  allowOverlap?: boolean;
  /**
   * Controls if widgets can collide with each other. If true, grid items won't change position when being dragged over.
   * @defaultValue false
   */
  preventCollision?: boolean;
};

export const LayoutConfigurationSchema = z.object({
  component: ReactElementSchema,
  x: z.number().nonnegative('x must be positive number'),
  y: z.number().nonnegative('y must be positive number'),
  width: z.number().positive('width must be positive number'),
  height: z.number().positive('height must be positive number'),
  movable: z.boolean().optional(),
  deletable: z.boolean().optional(),
  resizable: z.boolean().optional(),
});

/**
 * Layout configuration that can be passed to the custom home page.
 *
 * @public
 */
export type LayoutConfiguration = {
  component: ReactElement | string;
  x: number;
  y: number;
  width: number;
  height: number;
  movable?: boolean;
  deletable?: boolean;
  resizable?: boolean;
};

export const WidgetSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  component: ReactElementSchema,
  width: z.number().positive('width must be positive number').optional(),
  height: z.number().positive('height must be positive number').optional(),
  minWidth: z.number().positive('minWidth must be positive number').optional(),
  maxWidth: z.number().positive('maxWidth must be positive number').optional(),
  minHeight: z
    .number()
    .positive('minHeight must be positive number')
    .optional(),
  maxHeight: z
    .number()
    .positive('maxHeight must be positive number')
    .optional(),
  settingsSchema: RSJFTypeSchema.optional(),
  uiSchema: RSJFTypeUiSchema.optional(),
  movable: z.boolean().optional(),
  deletable: z.boolean().optional(),
  resizable: z.boolean().optional(),
});

export type Widget = z.infer<typeof WidgetSchema>;

const GridWidgetSchema = z.object({
  id: z.string(),
  layout: LayoutSchema,
  settings: z.record(z.string(), z.any()),
  movable: z.boolean().optional(),
  deletable: z.boolean().optional(),
  resizable: z.boolean().optional(),
});

export type GridWidget = z.infer<typeof GridWidgetSchema>;

export const CustomHomepageGridStateV1Schema = z.object({
  version: z.literal(1),
  pages: z.record(z.string(), z.array(GridWidgetSchema)),
});

export type CustomHomepageGridStateV1 = z.infer<
  typeof CustomHomepageGridStateV1Schema
>;
