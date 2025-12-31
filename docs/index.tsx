import React from 'react';
import './theme/styles/home.css';

// Simple components matching original Docusaurus structure

interface ContentBlockProps {
  title?: React.ReactNode;
  topImgSrc?: string;
  hasBulletLine?: boolean;
  actionButtons?: Array<{ link: string; label: string }>;
  children?: React.ReactNode;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  title,
  topImgSrc,
  hasBulletLine,
  actionButtons,
  children,
}) => (
  <div className="content-block">
    {topImgSrc && <img src={topImgSrc} alt="" className="content-block-top-img" />}

    <div className="content-block-title">
      {hasBulletLine && <div className="bullet-line" />}
      {title && (typeof title === 'string' ? <h2>{title}</h2> : title)}
    </div>

    {children && (
      <div className="content-block-content">
        {typeof children === 'string' ? <p>{children}</p> : children}
      </div>
    )}

    {actionButtons && (
      <div className="action-buttons">
        {actionButtons.map(({ link, label }, index) => (
          <a key={index} className="button button--primary button--lg" href={link}>
            {label}
          </a>
        ))}
      </div>
    )}
  </div>
);

interface BannerSectionProps {
  children: React.ReactNode;
  diagonalBorder?: boolean;
  diagonalBottomBorder?: boolean;
  greyBackground?: boolean;
  greenGradientBackground?: boolean;
  greenBottomGradientBackground?: boolean;
  greenCtaGradientBackground?: boolean;
}

const BannerSection: React.FC<BannerSectionProps> = ({
  children,
  diagonalBorder,
  diagonalBottomBorder,
  greyBackground,
  greenGradientBackground,
  greenBottomGradientBackground,
  greenCtaGradientBackground,
}) => {
  const classNames = ['banner-section'];
  if (diagonalBorder) classNames.push('diagonal-border');
  if (diagonalBottomBorder) classNames.push('diagonal-bottom-border');
  if (greyBackground) classNames.push('grey-background');
  if (greenGradientBackground) classNames.push('green-gradient-background');
  if (greenBottomGradientBackground) classNames.push('green-bottom-gradient-background');
  if (greenCtaGradientBackground) classNames.push('green-cta-gradient-background');

  return (
    <section className={classNames.join(' ')}>
      <div className="container">{children}</div>
    </section>
  );
};

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <BannerSection diagonalBottomBorder greyBackground>
        <div className="section-grid-container">
          <div className="grid-container">
            <ContentBlock
              title={<h1>An open source framework for building developer portals</h1>}
              actionButtons={[
                { link: 'https://github.com/backstage/backstage#getting-started', label: 'GITHUB' },
                { link: 'https://info.backstage.spotify.com/office-hours', label: 'OFFICE HOURS' },
              ]}
            >
              Powered by a centralized software catalog, Backstage restores order to your
              infrastructure and enables your product teams to ship high-quality code quickly —
              without compromising autonomy.
            </ContentBlock>

            <div className="svg-container">
              <img
                className="laptop-svg"
                src="/img/laptop.svg"
                alt="Illustration of a laptop"
              />
              <img
                className="laptop-screen-gif"
                src="/animations/backstage-logos-hero-8.gif"
                alt="Animated Backstage Logo"
              />
            </div>
          </div>
        </div>
      </BannerSection>

      {/* Speed & Standards Paradox */}
      <BannerSection diagonalBorder>
        <div className="section-grid-container">
          <div className="grid-container">
            <ContentBlock
              title="The Speed Paradox"
              topImgSrc="/animations/backstage-speed-paradox-7.gif"
            >
              At Spotify, we've always believed in the speed and ingenuity that comes from having
              autonomous development teams. But as we learned firsthand, the faster you grow, the
              more fragmented and complex your software ecosystem becomes. And then everything slows
              down again.
            </ContentBlock>

            <ContentBlock
              title="The Standards Paradox"
              topImgSrc="/animations/backstage-standards-paradox-4.gif"
            >
              By centralizing services and standardizing your tooling, Backstage streamlines your
              development environment from end to end. Instead of restricting autonomy,
              standardization frees your engineers from infrastructure complexity. So you can return
              to building and scaling, quickly and safely.
            </ContentBlock>
          </div>
        </div>
      </BannerSection>

      {/* Software Catalog */}
      <BannerSection diagonalBorder greenGradientBackground>
        <div className="catalog-container">
          <div className="catalog-title">
            <img
              src="/animations/backstage-software-catalog-icon-1.gif"
              alt="Software Catalog Planet GIF"
            />
            <h2>Backstage Software Catalog</h2>
            <h1>Build an ecosystem, not a wilderness</h1>
          </div>

          <picture className="catalog-img">
            <source
              srcSet="/img/components-with-filter.png"
              media="(min-width: 997px)"
            />
            <img
              src="/img/components-with-filter.png"
              alt="Software Catalog Filter Sidebar"
            />
          </picture>

          <ContentBlock title="Manage all your software, all in one place" hasBulletLine>
            Backstage makes it easy for one team to manage 10 services — and makes it possible for
            your company to manage thousands of them
          </ContentBlock>

          <ContentBlock title="A uniform overview" hasBulletLine>
            Every team can see all the services they own and related resources (deployments, data
            pipelines, pull request status, etc.)
          </ContentBlock>

          <ContentBlock title="Metadata on tap" hasBulletLine>
            All that information can be shared with plugins inside Backstage to enable other
            management features, like resource monitoring and testing
          </ContentBlock>

          <ContentBlock title="Not just services" hasBulletLine>
            Libraries, websites, ML models — you name it, Backstage knows all about it, including
            who owns it, dependencies, and more
          </ContentBlock>

          <ContentBlock title="Discoverability & accountability" hasBulletLine>
            No more orphan software hiding in the dark corners of your tech stack
          </ContentBlock>
        </div>
      </BannerSection>

      {/* Catalog CTA */}
      <BannerSection diagonalBorder greenCtaGradientBackground>
        <div className="cta-section">
          <h1>Learn more about the software catalog</h1>
          <a href="/docs/features/software-catalog/" className="button button--secondary">
            READ
          </a>
        </div>
      </BannerSection>

      {/* Software Templates */}
      <BannerSection diagonalBorder greenBottomGradientBackground>
        <div className="software-templates-container">
          <div className="software-templates-title">
            <img
              src="/animations/backstage-software-templates-icon-5.gif"
              alt="Software Templates Rocket GIF"
            />
            <h2>Backstage Software Templates</h2>
            <h1>Standards can set you free</h1>
          </div>

          <picture className="software-templates-img">
            <source srcSet="/img/cards.png" media="(min-width: 997px)" />
            <img src="/img/service-cards.png" alt="Software Templates Cards" />
          </picture>

          <ContentBlock title="Like automated getting started guides" hasBulletLine>
            Using templates, engineers can spin up a new microservice with your organization's best
            practices built-in, right from the start
          </ContentBlock>

          <ContentBlock title="Push-button deployment" hasBulletLine>
            Click a button to create a Spring Boot project with your repo automatically configured
            on GitHub and your CI already running the first build
          </ContentBlock>

          <ContentBlock title="Built to your standards" hasBulletLine>
            Go instead of Java? CircleCI instead of Jenkins? Serverless instead of Kubernetes? GCP
            instead of AWS? Customize your recipes with your best practices baked-in
          </ContentBlock>

          <ContentBlock title="Golden Paths pave the way" hasBulletLine>
            When the right way is also the easiest way, engineers get up and running faster — and
            more safely
          </ContentBlock>
        </div>
      </BannerSection>

      {/* Templates CTA */}
      <BannerSection diagonalBorder greenCtaGradientBackground>
        <div className="cta-section">
          <h1>Build your own software templates</h1>
          <a href="/docs/features/software-templates/" className="button button--secondary">
            CONTRIBUTE
          </a>
        </div>
      </BannerSection>

      {/* TechDocs */}
      <BannerSection diagonalBorder greenBottomGradientBackground>
        <div className="software-templates-container">
          <div className="software-templates-title">
            <img
              src="/animations/backstage-techdocs-icon-1.gif"
              alt="Backstage TechDocs File Copy GIF"
            />
            <h2>Backstage TechDocs</h2>
            <h1>Docs like code</h1>
          </div>

          <picture className="software-templates-img">
            <source srcSet="/img/techdocs2.gif" media="(min-width: 997px)" />
            <img src="/img/techdocs2.gif" alt="Backstage TechDocs Markdown to HTML" />
          </picture>

          <ContentBlock title="Free documentation" hasBulletLine>
            Whenever you use a Backstage Software Template, your project automatically gets a
            TechDocs site, for free
          </ContentBlock>

          <ContentBlock title="Easy to write" hasBulletLine>
            With our docs-like-code approach, engineers write their documentation in Markdown files
            right alongside their code
          </ContentBlock>

          <ContentBlock title="Easy to maintain" hasBulletLine>
            Updating code? Update your documentation while you're there — with docs and code in the
            same place, it becomes a natural part of your workstream
          </ContentBlock>

          <ContentBlock title="Easy to find and use" hasBulletLine>
            Since all your documentation is in Backstage, finding any TechDoc is just a search
            query away
          </ContentBlock>
        </div>
      </BannerSection>

      {/* TechDocs CTA */}
      <BannerSection diagonalBorder greenCtaGradientBackground>
        <div className="cta-section">
          <h1>Learn more about TechDocs</h1>
          <a href="/docs/features/techdocs/" className="button button--secondary">
            DOCS
          </a>
        </div>
      </BannerSection>

      {/* Search Platform */}
      <BannerSection diagonalBorder greenGradientBackground>
        <div className="software-templates-container">
          <div className="software-templates-title">
            <img
              src="/animations/backstage-search-platform-icon-1.gif"
              alt="Search Platform Telescope GIF"
            />
            <h2>Backstage Search Platform</h2>
            <h1>A search platform made just for you</h1>
          </div>

          <picture className="software-templates-img">
            <source srcSet="/img/search-platform-overview.png" media="(min-width: 997px)" />
            <img src="/img/search-platform-overview.png" alt="Search Platform Search Bar" />
          </picture>

          <ContentBlock title="Way more than a text box" hasBulletLine>
            Backstage Search more than just a box you type questions into — it's an entire platform
            all by itself, which you can customize to fit your organization's needs
          </ContentBlock>

          <ContentBlock title="Search the way you want" hasBulletLine>
            Bring your own search engine, create a customized search page experience, or edit the
            look and feel of each search result
          </ContentBlock>

          <ContentBlock title="Index everything, find anything" hasBulletLine>
            With an extensible backend, you can search beyond the Software Catalog and index any
            source you'd like — whether it's TechDocs or Confluence and Stack Overflow
          </ContentBlock>

          <ContentBlock title="Discoverability unlocked" hasBulletLine>
            New hires and seasoned employees alike can easily search your infrastructure instead of
            getting lost in it
          </ContentBlock>
        </div>
      </BannerSection>

      {/* Search CTA */}
      <BannerSection diagonalBorder greenCtaGradientBackground>
        <div className="cta-section">
          <h1>Learn more about Backstage Search</h1>
          <a href="/docs/features/search/" className="button button--secondary">
            READ
          </a>
        </div>
      </BannerSection>

      {/* Kubernetes */}
      <BannerSection diagonalBorder greenBottomGradientBackground>
        <div className="section-grid-container kubernetes-section-container">
          <div className="grid-header">
            <img
              src="/animations/backstage-kubernetes-icon-1.gif"
              alt="Backstage Kubernetes Flag GIF"
            />
            <h2>Backstage Kubernetes</h2>
            <h1>Manage your services, not clusters</h1>
          </div>

          <div className="grid-container">
            <ContentBlock title="Kubernetes made just for service owners" hasBulletLine>
              Backstage features the first Kubernetes monitoring tool designed around the needs of
              service owners, not cluster admins
            </ContentBlock>

            <ContentBlock title="Your service at a glance" hasBulletLine>
              Get all your service's deployments in one, aggregated view — no more digging through
              cluster logs in a CLI, no more combing through lists of services you don't own
            </ContentBlock>

            <ContentBlock title="Pick a cloud, any cloud" hasBulletLine>
              Since Backstage uses the Kubernetes API, it's cloud agnostic — so it works no matter
              which cloud provider or managed Kubernetes service you use, and even works in
              multi-cloud orgs
            </ContentBlock>

            <ContentBlock title="Any K8s, one UI" hasBulletLine>
              Now you don't have to switch dashboards when you move from local testing to
              production, or from one cloud provider to another
            </ContentBlock>
          </div>
        </div>
      </BannerSection>

      {/* K8s CTA */}
      <BannerSection diagonalBorder greenCtaGradientBackground>
        <div className="cta-section">
          <h1>Learn more about the K8s plugin</h1>
          <a
            href="/blog/2021/01/12/new-backstage-feature-kubernetes-for-service-owners"
            className="button button--secondary"
          >
            READ
          </a>
        </div>
      </BannerSection>

      {/* Plugins */}
      <BannerSection diagonalBorder greenBottomGradientBackground>
        <div className="software-templates-container">
          <div className="software-templates-title">
            <img
              src="/animations/backstage-plugin-icon-2.gif"
              alt="Plugins Building Blocks GIF"
            />
            <h2>Customize Backstage with plugins</h2>
            <h1>An app store for your infrastructure</h1>
          </div>

          <picture className="software-templates-img">
            <source srcSet="/img/cards-plugins.png" media="(min-width: 997px)" />
            <img src="/img/cards-plugins.png" alt="Plugins Cards" />
          </picture>

          <ContentBlock title="Add functionality" hasBulletLine>
            Want scalable website testing? Add the Lighthouse plugin. Wondering about recommended
            frameworks? Add the Tech Radar plugin.
          </ContentBlock>

          <ContentBlock title="BYO Plugins" hasBulletLine>
            If you don't see the plugin you need, it's simple to build your own
          </ContentBlock>

          <ContentBlock title="Integrate your own custom tooling" hasBulletLine>
            Building internal plugins lets you tailor your version of Backstage to be a perfect fit
            for your infrastructure
          </ContentBlock>

          <ContentBlock title="Share with the community" hasBulletLine>
            Building open source plugins contributes to the entire Backstage ecosystem, which
            benefits everyone
          </ContentBlock>
        </div>
      </BannerSection>

      {/* Plugins CTA */}
      <BannerSection diagonalBorder greenCtaGradientBackground>
        <div className="cta-section">
          <h1>Build a plugin</h1>
          <a href="/docs/plugins/create-a-plugin" className="button button--secondary">
            CONTRIBUTE
          </a>
        </div>
      </BannerSection>

      {/* CNCF Section */}
      <BannerSection>
        <div className="cncf-section">
          <h2>
            Backstage is a{' '}
            <a href="https://www.cncf.io">Cloud Native Computing Foundation</a> incubation project
          </h2>
          <img src="/img/cncf-white.svg" alt="CNCF Logo" className="cncf-logo" />
        </div>
      </BannerSection>
    </div>
  );
};

export default HomePage;
