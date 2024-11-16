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
import { style } from '@vanilla-extract/css';

export const chipStyles = style({
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: 'Geist Mono, monospace',
  fontSize: '13px',
  borderRadius: '6px',
  padding: '0px 8px',
  height: '24px',
  backgroundColor: '#eaf2fd',
  color: '#2563eb',
  marginRight: '4px',
});
