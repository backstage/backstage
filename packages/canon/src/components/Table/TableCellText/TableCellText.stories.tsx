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
import preview from '../../../../.storybook/preview';
import { TableCellText } from './TableCellText';

const meta = preview.meta({
  title: 'Components/Table/TableCellText',
  component: TableCellText,
});

export const Default = meta.story({
  args: {
    title: 'Hello world',
  },
});

export const WithDescription = meta.story({
  args: {
    ...Default.input.args,
    description: 'This is a description',
  },
});
