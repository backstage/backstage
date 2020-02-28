import React, { FC } from 'react';
import { getMessage } from 'compile-test-lib';

const ExampleComponent: FC<{}> = () => {
  return (
    <div>
      <h2>This is the ExampleComponent</h2>
      <p>{getMessage()}</p>
    </div>
  );
};

export default ExampleComponent;
