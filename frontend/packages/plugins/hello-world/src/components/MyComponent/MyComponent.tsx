import React, { FC, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { HelloPromiseClient } from '../../proto/hello_grpc_web_pb';
import { HelloRequest } from '../../proto/hello_pb';
import { Paper, Typography } from '@material-ui/core';

const MyComponent: FC<{}> = () => {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>();

  useEffect(() => {
    const client = new HelloPromiseClient('http://localhost:8080');

    const request = new HelloRequest();
    request.setName('Spotify');

    client.hello(request).then(
      reply => {
        setMessage(reply.getMessage() ?? '');
      },
      err => {
        setError(err.message);
      },
    );
  }, []);

  return (
    <Paper square>
      <Typography variant="body1">{message}</Typography>
      <Typography variant="body1" color="error">
        {error}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.reload()}
      >
        Hello!
      </Button>
    </Paper>
  );
};

export default MyComponent;
