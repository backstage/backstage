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

import { createExtensionDataRef } from '@backstage/frontend-plugin-api';
import { ReactElement } from 'react';
import type { CardLayout, CardSettings } from '../extensions';

/**
 * Extension data for homepage widgets, bundling the rendered component
 * with its metadata.
 *
 * @alpha
 */
export interface HomePageWidgetData {
  /**
   * The rendered widget component (typically a card with header, content, etc.)
   */
  component: ReactElement;
  /**
   * Optional name identifier for the widget
   */
  name?: string;
  /**
   * Optional title displayed in the widget header
   */
  title?: string;
  /**
   * Optional description shown in widget catalogs or configuration UIs
   */
  description?: string;
  /**
   * Optional layout hints for positioning and sizing
   */
  layout?: CardLayout;
  /**
   * Optional settings schema for widget configuration
   */
  settings?: CardSettings;
}

/**
 * Extension data ref for homepage widgets.
 *
 * This follows the pattern from FormFieldBlueprint, bundling the component
 * and metadata into a single comprehensive data ref rather than outputting
 * them separately.
 *
 * @alpha
 */
export const homePageWidgetDataRef =
  createExtensionDataRef<HomePageWidgetData>().with({
    id: 'home.widget.data',
  });
