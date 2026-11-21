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
import React from 'react';

// The Tabs mock reads `value`/`label`/`children` straight off each element's
// props without rendering TabItem itself, mirroring how @theme/Tabs consumes
// @theme/TabItem in the real Docusaurus implementation.
interface TabItemProps {
  value: string;
  label?: string;
  children?: React.ReactNode;
}

export default function TabItem({ children }: TabItemProps) {
  return <>{children}</>;
}
