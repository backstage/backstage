import React from 'react';

export const TestComponent = ({
  runTimeConfig,
  codeTimeConfig,
}: {
  runTimeConfig: number;
  codeTimeConfig: string;
}) => (
  <div>
    Hello from github-actions: {runTimeConfig} {codeTimeConfig}
  </div>
);
