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
    utilityProps: [
      'm',
      'mb',
      'ml',
      'mr',
      'mt',
      'mx',
      'my',
      'p',
      'pb',
      'pl',
      'pr',
      'pt',
      'px',
      'py',
      'position',
      'display',
      'width',
      'minWidth',
      'maxWidth',
      'height',
      'minHeight',
      'maxHeight',
    ],
  },
  Button: {
    classNames: {
      root: 'bui-Button',
    },
    dataAttributes: {
      size: ['small', 'medium', 'large'] as const,
      variant: ['primary', 'secondary', 'tertiary'] as const,
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
      root: 'bui-Checkbox',
      indicator: 'bui-CheckboxIndicator',
    },
    dataAttributes: {
      selected: [true, false] as const,
    },
  },
  Container: {
    classNames: {
      root: 'bui-Container',
    },
    utilityProps: ['my', 'mt', 'mb', 'py', 'pt', 'pb', 'display'],
  },
  Dialog: {
    classNames: {
      overlay: 'bui-DialogOverlay',
      dialog: 'bui-Dialog',
      header: 'bui-DialogHeader',
      headerTitle: 'bui-DialogHeaderTitle',
      body: 'bui-DialogBody',
      footer: 'bui-DialogFooter',
    },
  },
  Accordion: {
    classNames: {
      root: 'bui-Accordion',
      trigger: 'bui-AccordionTrigger',
      triggerButton: 'bui-AccordionTriggerButton',
      triggerTitle: 'bui-AccordionTriggerTitle',
      triggerSubtitle: 'bui-AccordionTriggerSubtitle',
      triggerIcon: 'bui-AccordionTriggerIcon',
      panel: 'bui-AccordionPanel',
      group: 'bui-AccordionGroup',
    },
  },
  FieldError: {
    classNames: {
      root: 'bui-FieldError',
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
    utilityProps: [
      'm',
      'mb',
      'ml',
      'mr',
      'mt',
      'mx',
      'my',
      'p',
      'pb',
      'pl',
      'pr',
      'pt',
      'px',
      'py',
      'gap',
      'align',
      'justify',
      'direction',
    ],
  },
  Grid: {
    classNames: {
      root: 'bui-Grid',
    },
    utilityProps: [
      'columns',
      'gap',
      'm',
      'mb',
      'ml',
      'mr',
      'mt',
      'mx',
      'my',
      'p',
      'pb',
      'pl',
      'pr',
      'pt',
      'px',
      'py',
    ],
  },
  GridItem: {
    classNames: {
      root: 'bui-GridItem',
    },
    utilityProps: ['colSpan', 'colEnd', 'colStart', 'rowSpan'],
  },
  Header: {
    classNames: {
      toolbar: 'bui-HeaderToolbar',
      toolbarWrapper: 'bui-HeaderToolbarWrapper',
      toolbarContent: 'bui-HeaderToolbarContent',
      toolbarControls: 'bui-HeaderToolbarControls',
      toolbarIcon: 'bui-HeaderToolbarIcon',
      toolbarName: 'bui-HeaderToolbarName',
      tabsWrapper: 'bui-HeaderTabsWrapper',
    },
  },
  HeaderPage: {
    classNames: {
      root: 'bui-HeaderPage',
      content: 'bui-HeaderPageContent',
      breadcrumbs: 'bui-HeaderPageBreadcrumbs',
      tabsWrapper: 'bui-HeaderPageTabsWrapper',
      controls: 'bui-HeaderPageControls',
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
      color: ['primary', 'secondary', 'danger', 'warning', 'success'] as const,
      truncate: [true, false] as const,
    },
  },
  List: {
    classNames: {
      root: 'bui-List',
      row: 'bui-ListRow',
      label: 'bui-ListLabel',
    },
  },
  Menu: {
    classNames: {
      root: 'bui-Menu',
      popover: 'bui-MenuPopover',
      content: 'bui-MenuContent',
      section: 'bui-MenuSection',
      sectionHeader: 'bui-MenuSectionHeader',
      item: 'bui-MenuItem',
      itemListBox: 'bui-MenuItemListBox',
      itemListBoxCheck: 'bui-MenuItemListBoxCheck',
      itemWrapper: 'bui-MenuItemWrapper',
      itemContent: 'bui-MenuItemContent',
      itemArrow: 'bui-MenuItemArrow',
      separator: 'bui-MenuSeparator',
      searchField: 'bui-MenuSearchField',
      searchFieldInput: 'bui-MenuSearchFieldInput',
      searchFieldClear: 'bui-MenuSearchFieldClear',
      emptyState: 'bui-MenuEmptyState',
    },
  },
  PasswordField: {
    classNames: {
      root: 'bui-PasswordField',
      inputWrapper: 'bui-PasswordFieldInputWrapper',
      input: 'bui-PasswordFieldInput',
      inputIcon: 'bui-PasswordFieldIcon',
      inputVisibility: 'bui-PasswordFieldVisibility',
    },
    dataAttributes: {
      size: ['small', 'medium'] as const,
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
  SearchField: {
    classNames: {
      root: 'bui-SearchField',
      clear: 'bui-SearchFieldClear',
      inputWrapper: 'bui-SearchFieldInputWrapper',
      input: 'bui-SearchFieldInput',
      inputIcon: 'bui-SearchFieldInputIcon',
    },
    dataAttributes: {
      startCollapsed: [true, false] as const,
      size: ['small', 'medium'] as const,
    },
  },
  Select: {
    classNames: {
      root: 'bui-Select',
      popover: 'bui-SelectPopover',
      trigger: 'bui-SelectTrigger',
      chevron: 'bui-SelectTriggerChevron',
      value: 'bui-SelectValue',
      list: 'bui-SelectList',
      item: 'bui-SelectItem',
      itemIndicator: 'bui-SelectItemIndicator',
      itemLabel: 'bui-SelectItemLabel',
      searchWrapper: 'bui-SelectSearchWrapper',
      search: 'bui-SelectSearch',
      searchClear: 'bui-SelectSearchClear',
      noResults: 'bui-SelectNoResults',
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
      table: 'bui-Table',
      header: 'bui-TableHeader',
      body: 'bui-TableBody',
      row: 'bui-TableRow',
      head: 'bui-TableHead',
      headContent: 'bui-TableHeadContent',
      headSortButton: 'bui-TableHeadSortButton',
      caption: 'bui-TableCaption',
      cell: 'bui-TableCell',
      cellContentWrapper: 'bui-TableCellContentWrapper',
      cellContent: 'bui-TableCellContent',
      cellIcon: 'bui-TableCellIcon',
      cellProfileAvatar: 'bui-TableCellProfileAvatar',
      cellProfileAvatarImage: 'bui-TableCellProfileAvatarImage',
      cellProfileAvatarFallback: 'bui-TableCellProfileAvatarFallback',
      cellProfileName: 'bui-TableCellProfileName',
      cellProfileLink: 'bui-TableCellProfileLink',
    },
  },
  TablePagination: {
    classNames: {
      root: 'bui-TablePagination',
      left: 'bui-TablePaginationLeft',
      right: 'bui-TablePaginationRight',
      select: 'bui-TablePaginationSelect',
    },
  },
  Tabs: {
    classNames: {
      tabs: 'bui-Tabs',
      tabList: 'bui-TabList',
      tabListWrapper: 'bui-TabListWrapper',
      tab: 'bui-Tab',
      tabActive: 'bui-TabActive',
      tabHovered: 'bui-TabHovered',
      panel: 'bui-TabPanel',
    },
  },
  TagGroup: {
    classNames: {
      group: 'bui-TagGroup',
      list: 'bui-TagList',
      tag: 'bui-Tag',
      tagIcon: 'bui-TagIcon',
      tagRemoveButton: 'bui-TagRemoveButton',
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
      inputAction: 'bui-InputAction',
    },
    dataAttributes: {
      invalid: [true, false] as const,
      disabled: [true, false] as const,
      size: ['small', 'medium'] as const,
    },
  },
  Tooltip: {
    classNames: {
      tooltip: 'bui-Tooltip',
      arrow: 'bui-TooltipArrow',
    },
  },
  VisuallyHidden: {
    classNames: {
      root: 'bui-VisuallyHidden',
    },
  },
} as const satisfies Record<string, ComponentDefinition>;
