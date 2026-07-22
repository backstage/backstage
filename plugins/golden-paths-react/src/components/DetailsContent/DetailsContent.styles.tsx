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
import { Grid, styled } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';
import ListIcon from '@material-ui/icons/List';

export const StyledGridContainer = styled(props => (
  <Grid spacing={5} container {...props} />
))({
  padding: '8px 24px',
});

export const StyledGridItem = styled(props => <Grid item {...props} />)({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

export const LeftContainer = styled(StyledGridItem)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: 300,
  },
}));

export const RightContainer = styled(StyledGridItem)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    flex: 1,
  },
}));

export const RefLinksContainer = styled('div')(({ theme }) => ({
  fontSize: '1rem',

  '& [class*=MuiSvgIcon]': {
    width: '1.5rem',
    height: '1.5rem',
    fill: theme.palette.primary.main,
  },
}));

export const StyledRegionsIcon = styled(PublicIcon)(({ theme }) => ({
  height: '1.5rem',
  width: '1.5rem',
  fill: theme.palette.primary.main,
}));

export const StyledTemplatesIcon = styled(ListIcon)(({ theme }) => ({
  height: '1.5rem',
  width: '1.5rem',
  fill: theme.palette.primary.main,
}));

export const Container = styled('div')({
  display: 'flex',
  gap: 6,
  alignItems: 'center',
  '&, & *': {
    fontSize: '1rem',
  },
});
