/*
 * Copyright 2020 Spotify AB
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
import React from 'react';
import { Breadcrumbs } from '.';

export default {
  title: 'Layout/Breadcrumbs',
  component: Breadcrumbs,
};

const pages = [
  {
    href: '/',
    name: 'A',
  },
  {
    href: '/',
    name: 'B',
  },
  {
    href: '/',
    name: 'C',
  },
  {
    href: '/',
    name: 'D',
  },
];

// export const InHeader = () => <Breadcrumbs pages={pages} />;
export const OutsideOfHeader = () => <Breadcrumbs pages={pages} />;
// export const ExampleUsage = () => <Breadcrumbs pages={pages} />;
