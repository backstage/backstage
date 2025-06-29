/*
 * Copyright 2024 The Backstage Authors
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

import type { ComponentDefinition } from '../types';

/**
 * Component definitions for the Canon library
 * @public
 */
export const componentDefinitions = {
  Avatar: {
    classNames: {
      root: 'canon-AvatarRoot',
      image: 'canon-AvatarImage',
      fallback: 'canon-AvatarFallback',
    },
    dataAttributes: {
      size: ['small', 'medium', 'large'] as const,
    },
  },
  Box: {
    classNames: {
      root: 'canon-Box',
    },
  },
  Button: {
    classNames: {
      root: 'canon-Button',
    },
    dataAttributes: {
      size: ['small', 'medium', 'large'] as const,
      variant: ['primary', 'secondary', 'ghost'] as const,
    },
  },
  ButtonIcon: {
    classNames: {
      root: 'canon-ButtonIcon',
    },
  },
  ButtonLink: {
    classNames: {
      root: 'canon-ButtonLink',
    },
  },
  Checkbox: {
    classNames: {
      root: 'canon-CheckboxRoot',
      label: 'canon-CheckboxLabel',
      indicator: 'canon-CheckboxIndicator',
    },
    dataAttributes: {
      checked: [true, false] as const,
    },
  },
  Collapsible: {
    classNames: {
      root: 'canon-CollapsibleRoot',
      trigger: 'canon-CollapsibleTrigger',
      panel: 'canon-CollapsiblePanel',
    },
  },
  Container: {
    classNames: {
      root: 'canon-Container',
    },
  },
  FieldLabel: {
    classNames: {
      root: 'canon-FieldLabelWrapper',
      label: 'canon-FieldLabel',
      secondaryLabel: 'canon-FieldSecondaryLabel',
      description: 'canon-FieldDescription',
    },
  },
  Flex: {
    classNames: {
      root: 'canon-Flex',
    },
  },
  Grid: {
    classNames: {
      root: 'canon-Grid',
      item: 'canon-GridItem',
    },
  },
  Heading: {
    classNames: {
      root: 'canon-Heading',
    },
    dataAttributes: {
      variant: ['title1', 'title2', 'title3', 'subtitle'] as const,
      color: ['primary', 'secondary', 'muted'] as const,
      truncate: [true, false] as const,
    },
  },
  Icon: {
    classNames: {
      root: 'canon-Icon',
    },
  },
  Link: {
    classNames: {
      root: 'canon-Link',
    },
    dataAttributes: {
      variant: ['subtitle', 'body', 'caption', 'label'] as const,
      weight: ['regular', 'bold'] as const,
    },
  },
  Menu: {
    classNames: {
      trigger: 'canon-MenuTrigger',
      backdrop: 'canon-MenuBackdrop',
      positioner: 'canon-MenuPositioner',
      popup: 'canon-MenuPopup',
      arrow: 'canon-MenuArrow',
      item: 'canon-MenuItem',
      group: 'canon-MenuGroup',
      groupLabel: 'canon-MenuGroupLabel',
      radioGroup: 'canon-MenuRadioGroup',
      radioItem: 'canon-MenuRadioItem',
      radioItemIndicator: 'canon-MenuRadioItemIndicator',
      checkboxItem: 'canon-MenuCheckboxItem',
      checkboxItemIndicator: 'canon-MenuCheckboxItemIndicator',
      submenuTrigger: 'canon-MenuSubmenuTrigger',
      separator: 'canon-MenuSeparator',
    },
  },
  RadioGroup: {
    classNames: {
      root: 'canon-RadioGroup',
      content: 'canon-RadioGroupContent',
      radio: 'canon-Radio',
    },
  },
  ScrollArea: {
    classNames: {
      root: 'canon-ScrollAreaRoot',
      viewport: 'canon-ScrollAreaViewport',
      scrollbar: 'canon-ScrollAreaScrollbar',
      thumb: 'canon-ScrollAreaThumb',
    },
  },
  SearchField: {
    classNames: {
      root: 'canon-SearchField',
      clear: 'canon-InputClear',
    },
  },
  Select: {
    classNames: {
      root: 'canon-Select',
      required: 'canon-SelectRequired',
      trigger: 'canon-SelectTrigger',
      value: 'canon-SelectValue',
      icon: 'canon-SelectIcon',
      popup: 'canon-SelectPopup',
      item: 'canon-SelectItem',
      itemIndicator: 'canon-SelectItemIndicator',
      itemText: 'canon-SelectItemText',
      description: 'canon-SelectDescription',
      error: 'canon-SelectError',
    },
    dataAttributes: {
      size: ['small', 'medium'] as const,
    },
  },
  Switch: {
    classNames: {
      root: 'canon-Switch',
      indicator: 'canon-SwitchIndicator',
    },
  },
  Table: {
    classNames: {
      root: 'canon-TableRoot',
      header: 'canon-TableHeader',
      body: 'canon-TableBody',
      row: 'canon-TableRow',
      head: 'canon-TableHead',
      caption: 'canon-TableCaption',
      cell: 'canon-TableCell',
      cellText: 'canon-TableCellText',
      cellLink: 'canon-TableCellLink',
      cellProfile: 'canon-TableCellProfile',
      cellProfileAvatar: 'canon-TableCellProfileAvatar',
      cellProfileAvatarImage: 'canon-TableCellProfileAvatarImage',
      cellProfileAvatarFallback: 'canon-TableCellProfileAvatarFallback',
      cellProfileName: 'canon-TableCellProfileName',
      cellProfileLink: 'canon-TableCellProfileLink',
    },
  },
  Tabs: {
    classNames: {
      root: 'canon-TabsRoot',
      list: 'canon-TabsList',
      indicator: 'canon-TabsIndicator',
      tab: 'canon-TabsTab',
      panel: 'canon-TabsPanel',
    },
  },
  Text: {
    classNames: {
      root: 'canon-Text',
    },
    dataAttributes: {
      variant: ['subtitle', 'body', 'caption', 'label'] as const,
      weight: ['regular', 'bold'] as const,
      color: ['primary', 'secondary', 'danger', 'warning', 'success'] as const,
      truncate: [true, false] as const,
    },
  },
  TextField: {
    classNames: {
      root: 'canon-TextField',
      inputWrapper: 'canon-InputWrapper',
      input: 'canon-Input',
      inputIcon: 'canon-InputIcon',
    },
    dataAttributes: {
      invalid: [true, false] as const,
      disabled: [true, false] as const,
    },
  },
  Toolbar: {
    classNames: {
      tabs: 'canon-ToolbarTabs',
      tabList: 'canon-ToolbarTabList',
      tab: 'canon-ToolbarTab',
      activeIndicator: 'canon-ToolbarActiveIndicator',
      hoveredIndicator: 'canon-ToolbarHoveredIndicator',
    },
  },
  Tooltip: {
    classNames: {
      trigger: 'canon-TooltipTrigger',
      positioner: 'canon-TooltipPositioner',
      popup: 'canon-TooltipPopup',
      arrow: 'canon-TooltipArrow',
    },
  },
} as const satisfies Record<string, ComponentDefinition>;
