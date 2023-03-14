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
import { Header } from '@backstage/core-components';

type PropsFrom<TComponent> = TComponent extends React.FC<infer Props>
  ? Props
  : TComponent extends React.Component<infer Props>
  ? Props
  : never;

type TemplatePageHeaderProps = Partial<PropsFrom<typeof Header>>;

export const TemplatePageHeader = (props: TemplatePageHeaderProps) => {
  return (
    <Header
      pageTitleOverride="Create a new component"
      title="Create a new component"
      subtitle="Create new software components using standard templates in your organization"
      {...props}
    />
  );
};
