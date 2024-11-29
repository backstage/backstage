import { Redirect } from '@docusaurus/router';
import React from 'react';

const redirects = {
  'bind-routes':
    '/docs/plugins/composability#binding-external-routes-in-the-app',
  'scm-auth': '/docs/auth/#scaffolder-configuration-software-templates',
  'backend-system': '/docs/plugins/new-backend-system',
};
const fallback = '/docs';
let target = fallback;
if (global.window) {
  target = redirects[global.window.location.search.slice(1)] || fallback;
}

export default function Link() {
  return <Redirect to={target} />;
}
