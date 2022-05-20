/*
 * Copyright 2020 The Backstage Authors
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

import { createContext, Dispatch, SetStateAction } from 'react';

const drawerWidthClosed = 72;
const iconPadding = 24;
const userBadgePadding = 18;

/** @public **/
export type SidebarOptions = {
  drawerWidthClosed?: number;
  drawerWidthOpen?: number;
};

/** @public **/
export type SubmenuOptions = {
  drawerWidthClosed?: number;
  drawerWidthOpen?: number;
};

/** @internal **/
export type SidebarConfig = {
  drawerWidthClosed: number;
  drawerWidthOpen: number;
  defaultOpenDelayMs: number;
  defaultCloseDelayMs: number;
  defaultFadeDuration: number;
  logoHeight: number;
  iconContainerWidth: number;
  iconSize: number;
  iconPadding: number;
  selectedIndicatorWidth: number;
  userBadgePadding: number;
  userBadgeDiameter: number;
  mobileSidebarHeight: number;
};

export const sidebarConfig = {
  drawerWidthClosed,
  drawerWidthOpen: 224,
  // As per NN/g's guidance on timing for exposing hidden content
  // See https://www.nngroup.com/articles/timing-exposing-content/
  defaultOpenDelayMs: 100,
  defaultCloseDelayMs: 0,
  defaultFadeDuration: 200,
  logoHeight: 32,
  iconContainerWidth: drawerWidthClosed,
  iconSize: drawerWidthClosed - iconPadding * 2,
  iconPadding,
  selectedIndicatorWidth: 3,
  userBadgePadding,
  userBadgeDiameter: drawerWidthClosed - userBadgePadding * 2,
  mobileSidebarHeight: 56,
};

export const makeSidebarConfig = (
  customSidebarConfig: Partial<SidebarOptions>,
) => ({
  ...sidebarConfig,
  ...customSidebarConfig,
  iconContainerWidth: sidebarConfig.drawerWidthClosed,
  iconSize: sidebarConfig.drawerWidthClosed - sidebarConfig.iconPadding * 2,
  userBadgeDiameter:
    sidebarConfig.drawerWidthClosed - sidebarConfig.userBadgePadding * 2,
});

/** @internal **/
export type SubmenuConfig = {
  drawerWidthClosed: number;
  drawerWidthOpen: number;
  defaultOpenDelayMs: number;
};

export const submenuConfig = {
  drawerWidthClosed: 0,
  drawerWidthOpen: 202,
  defaultOpenDelayMs: sidebarConfig.defaultOpenDelayMs + 200,
};

export const makeSidebarSubmenuConfig = (
  customSubmenuConfig: Partial<SubmenuOptions>,
) => ({
  ...submenuConfig,
  ...customSubmenuConfig,
});

export const SIDEBAR_INTRO_LOCAL_STORAGE =
  '@backstage/core/sidebar-intro-dismissed';

export type SidebarConfigContextType = {
  sidebarConfig: SidebarConfig;
  submenuConfig: SubmenuConfig;
};

export const SidebarConfigContext = createContext<SidebarConfigContextType>({
  sidebarConfig,
  submenuConfig,
});

export type SidebarItemWithSubmenuContextType = {
  isHoveredOn: boolean;
  setIsHoveredOn: Dispatch<SetStateAction<boolean>>;
};

export const SidebarItemWithSubmenuContext =
  createContext<SidebarItemWithSubmenuContextType>({
    isHoveredOn: false,
    setIsHoveredOn: () => {},
  });
