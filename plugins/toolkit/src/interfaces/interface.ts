/*
 * Copyright 2023 The Backstage Authors
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

export interface IToolkit {
  id?: number;
  toolkit?: number;
  title: string;
  url: string;
  logo: string;
  type: 'public' | 'private';
  owner?: string;
  actions?: any;
}
export type Toolkits = {
  list: IToolkit[];
  error: string;
  message: string;
  loading: boolean;
  showAlert: boolean;
};
export type ToolkitAction = {
  error: string;
  message: string;
  loading: boolean;
  showAlert: boolean;
  success: boolean;
};
export interface IToolkitState {
  showModal: boolean;
  myToolkits: Toolkits;
  toolkits: Toolkits;
  create: ToolkitAction;
  add: ToolkitAction;
  delete: ToolkitAction;
  toolkit: IToolkit | {};
}
export type TToolkitMode = {
  mode: 'read' | 'write';
};
export interface ITool {
  key?: any;
  label: string;
  url: string;
  icon: React.ReactNode;
}
export type TActionButton = {
  onDeleteClick: () => void;
};
