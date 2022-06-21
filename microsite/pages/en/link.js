const React = require('react');

// This is an index of stable short-links to different doc sites
// for example https://backstage.io/link?bind-routes
const redirects = {
  'bind-routes':
    '/docs/plugins/composability#binding-external-routes-in-the-app',
  'scm-auth': '/docs/auth/#scaffolder-configuration-software-templates',
};
const fallback = '/docs';

function Link() {
  return (
    <html lang="en">
      <script
        dangerouslySetInnerHTML={{
          __html: `
            const redirects = ${JSON.stringify(redirects)};
            const target = redirects[window.location.search.slice(1)] || '${fallback}';
            window.location.href = target;
            `,
        }}
      />
    </html>
  );
}

module.exports = Link;
