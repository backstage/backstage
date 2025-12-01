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
];
