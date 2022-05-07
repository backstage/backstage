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
import React, { PropsWithChildren, FunctionComponent } from 'react';
import { Grid, Box } from '@material-ui/core';

type Props = {
  fullscreen: boolean;
};

const Wrapper: FunctionComponent<Props> = (props: PropsWithChildren<Props>) => {
  const { children, fullscreen } = props;

  return (
    <Grid item xs>
      <Box maxHeight={fullscreen ? '100vh' : '50vh'} overflow="auto">
        {children}
      </Box>
    </Grid>
  );
};

export default Wrapper;
