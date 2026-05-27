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
import { type CSSProperties } from 'react';

export const chipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--bui-space-1)',
  padding: '2px var(--bui-space-2)',
  borderRadius: 'var(--bui-radius-3)',
  backgroundColor: 'var(--bui-bg-neutral-2-hover)',
  fontSize: 'var(--bui-font-size-3)',
  color: 'var(--bui-fg-primary)',
  lineHeight: '1.5',
};

export const chipRemoveStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0 2px',
  color: 'var(--bui-fg-secondary)',
  fontSize: '1rem',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
};
