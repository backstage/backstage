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

import { ReactElement } from 'react';
import { Layout } from 'react-grid-layout';
import { z } from 'zod';
import { RJSFSchema } from '@rjsf/utils';

const RSJFTypeSchema: z.ZodType<RJSFSchema> = z.any();
const ReactElementSchema: z.ZodType<ReactElement> = z.any();
const LayoutSchema: z.ZodType<Layout> = z.any();

export const LayoutConfigurationSchema = z.object({
  component: ReactElementSchema,
  x: z.number().nonnegative('x must be positive number'),
  y: z.number().nonnegative('y must be positive number'),
  width: z.number().positive('width must be positive number'),
  height: z.number().positive('height must be positive number'),
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
});

export type Widget = z.infer<typeof WidgetSchema>;

const GridWidgetSchema = z.object({
  id: z.string(),
  layout: LayoutSchema,
  settings: z.record(z.string(), z.any()),
});

export type GridWidget = z.infer<typeof GridWidgetSchema>;

export const CustomHomepageGridStateV1Schema = z.object({
  version: z.literal(1),
  pages: z.record(z.string(), z.array(GridWidgetSchema)),
});

export type CustomHomepageGridStateV1 = z.infer<
  typeof CustomHomepageGridStateV1Schema
>;
