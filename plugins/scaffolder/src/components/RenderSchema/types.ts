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
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

export type Expanded = { [key: string]: boolean };

export type SchemaRenderContext = {
  parent?: SchemaRenderContext;
  parentId: string;
  classes: ClassNameMap;
  expanded: [Expanded, React.Dispatch<React.SetStateAction<Expanded>>];
  headings: [React.JSX.Element, ...React.JSX.Element[]];
};

export type SchemaRenderStrategy = 'root' | 'properties';
