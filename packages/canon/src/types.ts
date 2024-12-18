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
export interface Breakpoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export type Space = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Display = 'none' | 'flex' | 'block' | 'inline';
export type FlexDirection = 'row' | 'column';
export type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
export type JustifyContent =
  | 'stretch'
  | 'start'
  | 'center'
  | 'end'
  | 'around'
  | 'between';
export type AlignItems = 'stretch' | 'start' | 'center' | 'end';
export type BorderRadius = 'none' | 'small' | 'medium' | 'full';
export type BoxShadow = 'small' | 'medium' | 'large';

export interface UtilityProps {
  display?: Display | Partial<Record<keyof Breakpoints, Display>>;
  flexDirection?:
    | FlexDirection
    | Partial<Record<keyof Breakpoints, FlexDirection>>;
  flexWrap?: FlexWrap | Partial<Record<keyof Breakpoints, FlexWrap>>;
  justifyContent?:
    | JustifyContent
    | Partial<Record<keyof Breakpoints, JustifyContent>>;
  alignItems?: AlignItems | Partial<Record<keyof Breakpoints, AlignItems>>;
  borderRadius?:
    | BorderRadius
    | Partial<Record<keyof Breakpoints, BorderRadius>>;
  boxShadow?: BoxShadow | Partial<Record<keyof Breakpoints, BoxShadow>>;
  padding?: Space | Partial<Record<keyof Breakpoints, Space>>;
  paddingX?: Space | Partial<Record<keyof Breakpoints, Space>>;
  paddingY?: Space | Partial<Record<keyof Breakpoints, Space>>;
  paddingLeft?: Space | Partial<Record<keyof Breakpoints, Space>>;
  paddingRight?: Space | Partial<Record<keyof Breakpoints, Space>>;
  paddingTop?: Space | Partial<Record<keyof Breakpoints, Space>>;
  paddingBottom?: Space | Partial<Record<keyof Breakpoints, Space>>;
  margin?: Space | Partial<Record<keyof Breakpoints, Space>>;
  marginX?: Space | Partial<Record<keyof Breakpoints, Space>>;
  marginY?: Space | Partial<Record<keyof Breakpoints, Space>>;
  marginLeft?: Space | Partial<Record<keyof Breakpoints, Space>>;
  marginRight?: Space | Partial<Record<keyof Breakpoints, Space>>;
  marginTop?: Space | Partial<Record<keyof Breakpoints, Space>>;
  marginBottom?: Space | Partial<Record<keyof Breakpoints, Space>>;
  gap?: Space | Partial<Record<keyof Breakpoints, Space>>;
}
