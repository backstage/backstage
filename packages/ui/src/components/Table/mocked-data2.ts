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

import { createElement } from 'react';
import { RiCactusLine } from '@remixicon/react';

export interface DataProps {
  name: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
}

export const data: DataProps[] = [
  {
    name: 'Cell with title only',
  },
  {
    name: 'Cell with title and description',
    description:
      'A comprehensive service handling user authentication and role-based access control across all applications.',
  },
  {
    name: 'Cell with title and icon',
    icon: createElement(RiCactusLine),
  },
  {
    name: 'Cell with title, description and icon',

    description:
      'A comprehensive service handling user authentication and role-based access control across all applications.',
    icon: createElement(RiCactusLine),
  },
  {
    icon: createElement(RiCactusLine),
    name: 'Cell with extremely long title that demonstrates text wrapping behavior and how the component handles content that extends well beyond typical cell widths in table layouts',
    description:
      'This is a comprehensive and detailed description that contains a substantial amount of text to demonstrate how the CellText component handles lengthy content. It includes multiple sentences and covers various aspects of the service or component being described. The text should wrap appropriately within the cell boundaries while maintaining readability and proper spacing. This example helps ensure that the table remains visually consistent and user-friendly even when dealing with extensive content that might otherwise break the layout or cause accessibility issues. The component should gracefully handle such scenarios by providing appropriate text wrapping, maintaining proper line heights, and ensuring that all content remains accessible and readable regardless of its length.',
  },
  {
    name: 'Cell with title and URL',
    href: '/catalog/default/service/auth-service',
  },
  {
    name: 'Cell with title, description and URL',
    description:
      'A comprehensive service handling user authentication and role-based access control across all applications.',
    href: '/catalog/default/service/auth-service',
  },
  {
    name: 'Cell with title, icon and URL',
    icon: createElement(RiCactusLine),
    href: '/catalog/default/service/auth-service',
  },
  {
    name: 'Cell with title, description, icon and URL',
    description:
      'A comprehensive service handling user authentication and role-based access control across all applications.',
    icon: createElement(RiCactusLine),
    href: '/catalog/default/service/auth-service',
  },
  {
    icon: createElement(RiCactusLine),
    name: 'Cell with extremely long title that demonstrates text wrapping behavior and how the component handles content that extends well beyond typical cell widths in table layouts',
    description:
      'This is a comprehensive and detailed description that contains a substantial amount of text to demonstrate how the CellText component handles lengthy content. It includes multiple sentences and covers various aspects of the service or component being described. The text should wrap appropriately within the cell boundaries while maintaining readability and proper spacing. This example helps ensure that the table remains visually consistent and user-friendly even when dealing with extensive content that might otherwise break the layout or cause accessibility issues. The component should gracefully handle such scenarios by providing appropriate text wrapping, maintaining proper line heights, and ensuring that all content remains accessible and readable regardless of its length.',
    href: '/catalog/default/service/auth-service',
  },
  {
    name: 'External link example',
    description: 'This is an external link that opens in a new tab',
    href: 'https://backstage.io',
  },
];
