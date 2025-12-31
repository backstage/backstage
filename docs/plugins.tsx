import React from 'react';

export const frontmatter = {
  pageType: 'custom',
};

const PluginsPage = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '1.5rem' }}>Backstage Plugins</h1>
      <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '3rem', lineHeight: '1.6' }}>
        Discover and explore the growing ecosystem of Backstage plugins. Extend your Backstage
        instance with powerful integrations and features.
      </p>

      <div style={{ display: 'grid', gap: '3rem' }}>
        <section>
          <h2 style={{ fontSize: '32px', marginBottom: '1rem' }}>Featured Plugins</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '0.5rem', color: '#36baa2' }}>TechDocs</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Documentation as code for your software. Keep your docs close to your code.
              </p>
            </div>

            <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '0.5rem', color: '#36baa2' }}>Kubernetes</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                View and manage your Kubernetes resources directly from Backstage.
              </p>
            </div>

            <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '0.5rem', color: '#36baa2' }}>Scaffolder</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Create new projects from templates with the Software Templates feature.
              </p>
            </div>

            <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '0.5rem', color: '#36baa2' }}>Catalog</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Manage and discover all your software components in one place.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '32px', marginBottom: '1rem' }}>Explore More</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Browse the full plugin directory to find integrations for your favorite tools and services.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a
              href="/plugins/index"
              style={{
                padding: '12px 24px',
                backgroundColor: '#36baa2',
                color: 'white',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Browse All Plugins
            </a>
            <a
              href="/plugins/create-a-plugin"
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#36baa2',
                border: '2px solid #36baa2',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Create Your Own
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PluginsPage;
