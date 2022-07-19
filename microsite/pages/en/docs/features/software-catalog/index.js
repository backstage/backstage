const React = require('react');
const Redirect = require('../../../../../core/Redirect.js');

const siteConfig = require(process.cwd() + '/siteConfig.js');

function Docs() {
  return (
    <Redirect
      redirect="/docs/features/software-catalog/software-catalog-overview"
      config={siteConfig}
    />
  );
}

module.exports = Docs;
