import React from 'react';

export const frontmatter = {
  pageType: 'custom',
};

const CommunityPage = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '1.5rem' }}>Backstage Community</h1>
      <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '3rem', lineHeight: '1.6' }}>
        Join the vibrant Backstage community. Connect with other users, contributors, and the core team.
      </p>

      <div style={{ display: 'grid', gap: '2rem' }}>
        <section>
          <h2 style={{ fontSize: '32px', marginBottom: '1rem' }}>Get Involved</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '0.5rem', color: '#36baa2' }}>
                <a
                  href="https://discord.gg/backstage-687207715902193673"
                  style={{ color: '#36baa2', textDecoration: 'none' }}
                >
                  Discord
                </a>
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Join our Discord server to chat with the community, ask questions, and share your experiences.
              </p>
            </div>

            <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '0.5rem', color: '#36baa2' }}>
                <a
                  href="https://github.com/backstage/backstage"
                  style={{ color: '#36baa2', textDecoration: 'none' }}
                >
                  GitHub
                </a>
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Contribute to Backstage development, report issues, and browse the source code on GitHub.
              </p>
            </div>

            <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '0.5rem', color: '#36baa2' }}>
                <a
                  href="https://info.backstage.spotify.com/office-hours"
                  style={{ color: '#36baa2', textDecoration: 'none' }}
                >
                  Office Hours
                </a>
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Join our weekly office hours to get help, discuss features, and connect with maintainers.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '32px', marginBottom: '1rem' }}>Contributing</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Backstage is an open source project and we welcome contributions from everyone. Learn how
            you can get involved.
          </p>
          <a
            href="/contribute/index"
            style={{
              padding: '12px 24px',
              backgroundColor: '#36baa2',
              color: 'white',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-block',
            }}
          >
            Contribution Guide
          </a>
        </section>
      </div>
    </div>
  );
};

export default CommunityPage;
