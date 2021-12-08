const React = require('react');
import {Redirect} from '@docusaurus/router';

const siteConfig = require(process.cwd() + '/siteConfig.js');

import Layout from "@theme/Layout";

function Docs() {
  return (
    <Redirect
      redirect="/docs/features/software-catalog/software-catalog-overview"
      config={siteConfig}
    />
  );
}

export default props => <Layout><Docs {...props} /></Layout>;
