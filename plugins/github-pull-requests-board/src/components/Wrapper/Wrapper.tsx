import React, { PropsWithChildren } from 'react';
import { Grid, Box } from '@material-ui/core';

type Props = {
  fullscreen: boolean;
}

const Wrapper = (props: PropsWithChildren<Props>) => {
  const { children, fullscreen } = props;

  return (
    <Grid item xs>
      <Box maxHeight={fullscreen ? '100vh' : '50vh'} overflow='auto'>
        {children}
      </Box>
    </Grid>
  )
};

export default Wrapper;
