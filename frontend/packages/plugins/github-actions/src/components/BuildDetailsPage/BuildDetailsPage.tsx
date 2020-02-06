import React, { FC } from 'react';
import Button from '@material-ui/core/Button';

type Props = {
  buildId: string;
};

const BuildDetailsPage: FC<Props> = ({ buildId }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => window.location.reload()}
    >
      Hello! Build details for {buildId}
    </Button>
  );
};

export default BuildDetailsPage;
