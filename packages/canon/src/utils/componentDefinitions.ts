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
 * Component definitions for the Backstage UI library
 * @public
 */
export const componentDefinitions = {
  Avatar: {
    classNames: {
      root: 'bui-AvatarRoot',
      image: 'bui-AvatarImage',
      fallback: 'bui-AvatarFallback',
    },
    dataAttributes: {
      size: ['small', 'medium', 'large'] as const,
    },
  },
  Box: {
    classNames: {
      root: 'bui-Box',
    },
  },
  Button: {
    classNames: {
      root: 'bui-Button',
    },
    dataAttributes: {
      size: ['small', 'medium', 'large'] as const,
      variant: ['primary', 'secondary', 'ghost'] as const,
    },
  },
  ButtonIcon: {
    classNames: {
      root: 'bui-ButtonIcon',
    },
  },
  ButtonLink: {
    classNames: {
      root: 'bui-ButtonLink',
    },
  },
  Card: {
    classNames: {
      root: 'bui-Card',
      header: 'bui-CardHeader',
      body: 'bui-CardBody',
      footer: 'bui-CardFooter',
    },
  },
  Checkbox: {
    classNames: {
      root: 'bui-CheckboxRoot',
      label: 'bui-CheckboxLabel',
      indicator: 'bui-CheckboxIndicator',
    },
    dataAttributes: {
      checked: [true, false] as const,
    },
  },
  Collapsible: {
    classNames: {
      root: 'bui-CollapsibleRoot',
      trigger: 'bui-CollapsibleTrigger',
      panel: 'bui-CollapsiblePanel',
    },
  },
  Container: {
    classNames: {
      root: 'bui-Container',
    },
  },
  FieldLabel: {
    classNames: {
      root: 'bui-FieldLabelWrapper',
      label: 'bui-FieldLabel',
      secondaryLabel: 'bui-FieldSecondaryLabel',
      description: 'bui-FieldDescription',
    },
  },
  Flex: {
    classNames: {
      root: 'bui-Flex',
    },
  },
  Grid: {
    classNames: {
      root: 'bui-Grid',
      item: 'bui-GridItem',
    },
  },
  Heading: {
    classNames: {
      root: 'bui-Heading',
    },
    dataAttributes: {
      variant: ['title1', 'title2', 'title3', 'subtitle'] as const,
      color: ['primary', 'secondary', 'muted'] as const,
      truncate: [true, false] as const,
    },
  },
  Icon: {
    classNames: {
      root: 'bui-Icon',
    },
  },
  Link: {
    classNames: {
      root: 'bui-Link',
    },
    dataAttributes: {
      variant: ['subtitle', 'body', 'caption', 'label'] as const,
      weight: ['regular', 'bold'] as const,
    },
  },
  List: {
    classNames: {
      root: 'bui-List',
      row: 'bui-ListRow',
    },
  },
  Menu: {
    classNames: {
      trigger: 'bui-MenuTrigger',
      backdrop: 'bui-MenuBackdrop',
      positioner: 'bui-MenuPositioner',
      popup: 'bui-MenuPopup',
      arrow: 'bui-MenuArrow',
      item: 'bui-MenuItem',
      group: 'bui-MenuGroup',
      groupLabel: 'bui-MenuGroupLabel',
      radioGroup: 'bui-MenuRadioGroup',
      radioItem: 'bui-MenuRadioItem',
      radioItemIndicator: 'bui-MenuRadioItemIndicator',
      checkboxItem: 'bui-MenuCheckboxItem',
      checkboxItemIndicator: 'bui-MenuCheckboxItemIndicator',
      submenuTrigger: 'bui-MenuSubmenuTrigger',
      separator: 'bui-MenuSeparator',
    },
  },
  Popover: {
    classNames: {
      root: 'bui-Popover',
    },
  },
  RadioGroup: {
    classNames: {
      root: 'bui-RadioGroup',
      content: 'bui-RadioGroupContent',
      radio: 'bui-Radio',
    },
  },
  ScrollArea: {
    classNames: {
      root: 'bui-ScrollAreaRoot',
      viewport: 'bui-ScrollAreaViewport',
      scrollbar: 'bui-ScrollAreaScrollbar',
      thumb: 'bui-ScrollAreaThumb',
    },
  },
  SearchField: {
    classNames: {
      root: 'bui-SearchField',
      clear: 'bui-InputClear',
    },
  },
  Select: {
    classNames: {
      root: 'bui-Select',
      trigger: 'bui-SelectTrigger',
      value: 'bui-SelectValue',
      icon: 'bui-SelectIcon',
      popup: 'bui-SelectPopup',
      item: 'bui-SelectItem',
      itemIndicator: 'bui-SelectItemIndicator',
      itemText: 'bui-SelectItemText',
      description: 'bui-SelectDescription',
      error: 'bui-SelectError',
    },
    dataAttributes: {
      size: ['small', 'medium'] as const,
    },
  },
  Skeleton: {
    classNames: {
      root: 'bui-Skeleton',
    },
  },
  Switch: {
    classNames: {
      root: 'bui-Switch',
      indicator: 'bui-SwitchIndicator',
    },
  },
  Table: {
    classNames: {
      root: 'bui-TableRoot',
      header: 'bui-TableHeader',
      body: 'bui-TableBody',
      row: 'bui-TableRow',
      head: 'bui-TableHead',
      caption: 'bui-TableCaption',
      cell: 'bui-TableCell',
      cellText: 'bui-TableCellText',
      cellLink: 'bui-TableCellLink',
      cellProfile: 'bui-TableCellProfile',
      cellProfileAvatar: 'bui-TableCellProfileAvatar',
      cellProfileAvatarImage: 'bui-TableCellProfileAvatarImage',
      cellProfileAvatarFallback: 'bui-TableCellProfileAvatarFallback',
      cellProfileName: 'bui-TableCellProfileName',
      cellProfileLink: 'bui-TableCellProfileLink',
    },
  },
  Tabs: {
    classNames: {
      root: 'bui-TabsRoot',
      list: 'bui-TabsList',
      indicator: 'bui-TabsIndicator',
      tab: 'bui-TabsTab',
      panel: 'bui-TabsPanel',
    },
  },
  Text: {
    classNames: {
      root: 'bui-Text',
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
      root: 'bui-TextField',
      inputWrapper: 'bui-InputWrapper',
      input: 'bui-Input',
      inputIcon: 'bui-InputIcon',
    },
    dataAttributes: {
      invalid: [true, false] as const,
      disabled: [true, false] as const,
    },
  },
  Header: {
    classNames: {
      toolbar: 'bui-HeaderToolbar',
      toolbarWrapper: 'bui-HeaderToolbarWrapper',
      toolbarContent: 'bui-HeaderToolbarContent',
      toolbarControls: 'bui-HeaderToolbarControls',
      toolbarIcon: 'bui-HeaderToolbarIcon',
      toolbarName: 'bui-HeaderToolbarName',
      breadcrumbs: 'bui-HeaderBreadcrumbs',
      breadcrumb: 'bui-HeaderBreadcrumb',
      breadcrumbLink: 'bui-HeaderBreadcrumbLink',
      breadcrumbSeparator: 'bui-HeaderBreadcrumbSeparator',
      tabs: 'bui-HeaderTabs',
      tabList: 'bui-HeaderTabList',
      tab: 'bui-HeaderTab',
      tabActive: 'bui-HeaderTabActive',
      tabHovered: 'bui-HeaderTabHovered',
      subNav: 'bui-HeaderSubNav',
    },
  },
  Tooltip: {
    classNames: {
      tooltip: 'bui-Tooltip',
      arrow: 'bui-TooltipArrow',
    },
  },
} as const satisfies Record<string, ComponentDefinition>;
