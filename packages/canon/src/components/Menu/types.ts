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
import { Menu as MenuPrimitive } from '@base-ui-components/react/menu';

/** @public */
export type MenuComponent = {
  Root: typeof MenuPrimitive.Root;
  Trigger: typeof MenuPrimitive.Trigger;
  Portal: typeof MenuPrimitive.Portal;
  Backdrop: typeof MenuPrimitive.Backdrop;
  Positioner: typeof MenuPrimitive.Positioner;
  Popup: typeof MenuPrimitive.Popup;
  Arrow: typeof MenuPrimitive.Arrow;
  Item: typeof MenuPrimitive.Item;
  Group: typeof MenuPrimitive.Group;
  GroupLabel: typeof MenuPrimitive.GroupLabel;
  RadioGroup: typeof MenuPrimitive.RadioGroup;
  RadioItem: typeof MenuPrimitive.RadioItem;
  RadioItemIndicator: typeof MenuPrimitive.RadioItemIndicator;
  CheckboxItem: typeof MenuPrimitive.CheckboxItem;
  CheckboxItemIndicator: typeof MenuPrimitive.CheckboxItemIndicator;
  SubmenuTrigger: typeof MenuPrimitive.SubmenuTrigger;
  Separator: typeof MenuPrimitive.Separator;
};
