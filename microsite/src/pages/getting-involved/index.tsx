import React from 'react';
import { Redirect } from '@docusaurus/router';

export default function GettingInvolvedRedirect(): React.ReactElement {
  // @ts-expect-error: Incompatibility between @types/react@18.3.31 and @docusaurus/router's Redirect typing
  return <Redirect to="/docs/getting-started/getting-involved" />;
}
