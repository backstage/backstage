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

import { createSwappableComponent } from '@backstage/frontend-plugin-api';

/**
 * A widget that can be chosen in the {@link AddWidgetDialog}.
 *
 * @alpha
 */
export interface AddWidgetDialogWidget {
  /** The unique name of the widget. */
  name: string;
  /** The title to show for the widget, the name is used if it is missing. */
  title?: string;
  /** A short description of the widget. */
  description?: string;
}

/**
 * Props for the {@link AddWidgetDialog} swappable component.
 *
 * @alpha
 */
export interface AddWidgetDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Closes the dialog without adding a widget. */
  onClose: () => void;
  /** The widgets that can be added to the grid. */
  widgets: AddWidgetDialogWidget[];
  /** Adds one of the provided widgets to the grid and closes the dialog. */
  handleAdd: (widget: AddWidgetDialogWidget) => void;
}

/**
 * The dialog that the home page grid opens to add widgets. Apps using the new
 * frontend system can replace it by registering a `SwappableComponentBlueprint`
 * that targets `AddWidgetDialog`.
 *
 * @alpha
 */
export const AddWidgetDialog = createSwappableComponent<AddWidgetDialogProps>({
  id: 'home.add-widget-dialog',
  loader: () =>
    import('./DefaultAddWidgetDialog').then(m => m.DefaultAddWidgetDialog),
});
