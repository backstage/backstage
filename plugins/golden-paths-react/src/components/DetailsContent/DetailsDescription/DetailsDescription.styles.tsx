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
import { Button, styled } from '@material-ui/core';
import type { ComponentProps, ComponentType } from 'react';

export const FlexContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

export const MarkdownContainer = styled('div')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  '-webkit-box-orient': 'vertical',
});

export const StyledMarkdownContent: ComponentType<
  ComponentProps<typeof MarkdownContent>
> = styled(MarkdownContent)({
  '& p': {
    margin: 0,
  },
});

export const ExtendButton = styled(props => (
  <Button color="secondary" {...props} />
))({
  border: 'none',
  fontWeight: 'normal',
  padding: 0,
  paddingTop: '0.875rem',
  fontSize: '0.875rem',
  lineHeight: 1.43,
  verticalAlign: 'baseline',
  '&:hover': {
    border: 'none',
    textDecoration: 'underline',
  },
  '&:focus-visible': {
    outline: '-webkit-focus-ring-color auto 1px',
  },
  '& *': {
    justifyContent: 'normal',
  },
});
