/*
 * Copyright 2022 The Backstage Authors
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

export interface DrawerContentAsPath {
  path: string;
  component?: never;
}
export interface DrawerContentAsComponent {
  path?: never;
  component: React.ComponentType<{}>;
}
export type DrawerContent = DrawerContentAsPath | DrawerContentAsComponent;

export interface Drawer {
  title: string;
  content?: DrawerContent;
}

/** @internal */
export interface RealDrawer extends Drawer {
  key: string;
}

export interface SidebarContext {
  interactiveDrawers: RealDrawer[];
  setInteractiveDrawers: React.Dispatch<React.SetStateAction<RealDrawer[]>>;
}

export interface DrawerContext {
  drawer: RealDrawer;
  showInteractiveDrawer: (drawer: Partial<Drawer>) => void;
  hideInteractiveDrawer: () => void;
  setTitle: (title: string) => void;
}
