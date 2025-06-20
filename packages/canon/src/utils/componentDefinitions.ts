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
  Container: {
    classNames: {
      root: 'canon-Container',
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
    },
  },

  // Typography Components
  Text: {
    classNames: {
      root: 'canon-Text',
    },
    dataAttributes: {
      variant: ['body', 'caption', 'label'] as const,
      weight: ['regular', 'medium', 'bold'] as const,
      color: ['primary', 'secondary', 'muted'] as const,
      truncate: [true, false] as const,
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

  TextField: {
    classNames: {
      root: 'canon-TextField',
      input: 'canon-TextField-input',
      label: 'canon-TextField-label',
      error: 'canon-TextField-error',
      helper: 'canon-TextField-helper',
      container: 'canon-TextField-container',
    },
    dataAttributes: {
      invalid: [true, false] as const,
      disabled: [true, false] as const,
    },
  },

  FieldLabel: {
    classNames: {
      root: 'canon-FieldLabel',
      required: 'canon-FieldLabel-required',
    },
    dataAttributes: {
      required: [true, false] as const,
    },
  },

  Select: {
    classNames: {
      root: 'canon-Select',
      trigger: 'canon-Select-trigger',
      content: 'canon-Select-content',
      item: 'canon-Select-item',
      value: 'canon-Select-value',
      icon: 'canon-Select-icon',
      separator: 'canon-Select-separator',
    },
    dataAttributes: {
      invalid: [true, false] as const,
      disabled: [true, false] as const,
      open: [true, false] as const,
    },
  },

  Switch: {
    classNames: {
      root: 'canon-Switch',
      thumb: 'canon-Switch-thumb',
      track: 'canon-Switch-track',
    },
    dataAttributes: {
      checked: [true, false] as const,
      disabled: [true, false] as const,
    },
  },

  // Navigation Components
  Link: {
    classNames: {
      root: 'canon-Link',
    },
    dataAttributes: {
      variant: ['primary', 'secondary'] as const,
    },
  },

  Menu: {
    classNames: {
      root: 'canon-Menu',
      trigger: 'canon-Menu-trigger',
      content: 'canon-Menu-content',
      item: 'canon-Menu-item',
      separator: 'canon-Menu-separator',
      label: 'canon-Menu-label',
      group: 'canon-Menu-group',
    },
  },

  Tabs: {
    classNames: {
      root: 'canon-Tabs',
      list: 'canon-Tabs-list',
      tab: 'canon-Tabs-tab',
      panel: 'canon-Tabs-panel',
      trigger: 'canon-Tabs-trigger',
    },
  },

  // Data Display Components
  Table: {
    classNames: {
      root: 'canon-Table',
      header: 'canon-Table-header',
      body: 'canon-Table-body',
      footer: 'canon-Table-footer',
      row: 'canon-Table-row',
      cell: 'canon-Table-cell',
      headerCell: 'canon-Table-headerCell',
      caption: 'canon-Table-caption',
    },
  },

  DataTable: {
    classNames: {
      root: 'canon-DataTable',
      container: 'canon-DataTable-container',
      header: 'canon-DataTable-header',
      body: 'canon-DataTable-body',
      row: 'canon-DataTable-row',
      cell: 'canon-DataTable-cell',
      headerCell: 'canon-DataTable-headerCell',
      toolbar: 'canon-DataTable-toolbar',
      pagination: 'canon-DataTable-pagination',
      search: 'canon-DataTable-search',
      filters: 'canon-DataTable-filters',
    },
  },

  Icon: {
    classNames: {
      root: 'canon-Icon',
    },
    dataAttributes: {
      size: ['small', 'medium', 'large'] as const,
    },
  },

  // Feedback Components
  Tooltip: {
    classNames: {
      root: 'canon-Tooltip',
      trigger: 'canon-Tooltip-trigger',
      content: 'canon-Tooltip-content',
      arrow: 'canon-Tooltip-arrow',
    },
  },

  // Disclosure Components
  Collapsible: {
    classNames: {
      root: 'canon-Collapsible',
      trigger: 'canon-Collapsible-trigger',
      content: 'canon-Collapsible-content',
      icon: 'canon-Collapsible-icon',
    },
    dataAttributes: {
      open: [true, false] as const,
    },
  },

  // Utility Components
  ScrollArea: {
    classNames: {
      root: 'canon-ScrollArea',
      viewport: 'canon-ScrollArea-viewport',
      scrollbar: 'canon-ScrollArea-scrollbar',
      thumb: 'canon-ScrollArea-thumb',
      corner: 'canon-ScrollArea-corner',
      track: 'canon-ScrollArea-track',
    },
  },
} as const satisfies Record<string, ComponentDefinition>;
