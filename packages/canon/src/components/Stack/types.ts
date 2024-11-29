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
import { AsProps, Breakpoint, ColorProps } from '../../layout/types';
import { SpaceProps } from '../../layout/types';

export interface StackProps extends SpaceProps, ColorProps {
  children: React.ReactNode;
  as?: AsProps;
  align?:
    | 'left'
    | 'center'
    | 'right'
    | Partial<Record<Breakpoint, 'left' | 'center' | 'right'>>;
  className?: string;
  style?: React.CSSProperties;
}
