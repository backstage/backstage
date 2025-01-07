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

import React from 'react';

export const Title = ({
  children,
  style,
  type = 'h1',
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  type?: 'h1' | 'h2' | 'h3';
}) => {
  let Component = 'h1';
  if (type === 'h1') Component = 'h1';
  if (type === 'h2') Component = 'h2';
  if (type === 'h3') Component = 'h3';

  return React.createElement(Component, {
    className: `sb-title ${type}`,
    style,
    children,
  });
};
