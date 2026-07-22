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
import { Grid, GridProps, styled } from '@material-ui/core';

export const GridContainerFullHeight = styled(props => (
  <Grid container {...props} />
))({
  height: '100%',
});

export const RightSideGridItem = styled((props: GridProps) => (
  <Grid item xs={10} {...props} />
))({
  display: 'flex',
  flexDirection: 'column',
});

export const RightSideGridContainer = styled(GridContainerFullHeight)({
  flex: 1,
  flexDirection: 'column',
  flexWrap: 'nowrap',
});

export const ContentCardContainer = styled(props => <Grid item {...props} />)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});
