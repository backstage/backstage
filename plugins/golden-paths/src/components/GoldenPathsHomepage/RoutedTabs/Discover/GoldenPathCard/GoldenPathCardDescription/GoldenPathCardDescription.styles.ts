/*
 * Copyright 2026 The Backstage Authors
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
import { MarkdownContent } from '@backstage/core-components';
import { styled } from '@material-ui/core';
import type { ComponentProps, ComponentType } from 'react';

export const Container = styled('div')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  '-webkit-line-clamp': 5,
  '-webkit-box-orient': 'vertical',
});

export const StyledMarkdown: ComponentType<
  ComponentProps<typeof MarkdownContent>
> = styled(MarkdownContent)({
  '& :first-child': {
    margin: 0,
  },
});
