import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { BannerSection } from '@site/src/components/bannerSection/bannerSection';
import { BannerSectionGrid } from '@site/src/components/bannerSection/bannerSectionGrid';
import { ContentBlock } from '@site/src/components/contentBlock/contentBlock';
import Layout from '@theme/Layout';
import { clsx } from 'clsx';
import React, { useState } from 'react';
import ThemedImage from '@theme/ThemedImage';
import homeStyles from './home.module.scss';
import { HubSpotNewAdoptersForm } from './_hubSpotNewAdoptersForm';
import useBaseUrl from '@docusaurus/useBaseUrl';

const hiddenNewsletterBannerKey = 'hiddenNewsletterBanner';

const HomePage = () => {
  const { siteConfig } = useDocusaurusContext();

  const [hiddenNewsletterBanner, setHideNewsletterBanner] = useState(() => {
    return JSON.parse(localStorage.getItem(hiddenNewsletterBannerKey)) || false;
  });

  const hideNewsletterBanner = (shouldHide: boolean) => {
    localStorage.setItem(hiddenNewsletterBannerKey, JSON.stringify(shouldHide));
    setHideNewsletterBanner(shouldHide);
  };

  return (
    <Layout>
      <div className={homeStyles.homePage}>
        <BannerSection diagonalBottomBorder greyBackground>
          <BannerSectionGrid
            header={
              <>
                {!hiddenNewsletterBanner && (
                  <div
                    className={clsx(
                      'card',
                      'padding--md',
                      homeStyles.newsletterBanner,
                    )}
                  >
                    <div className="text--left bannerContent">
                      🗞️ Want to stay up to date with Backstage? Sign up for our{' '}
                      <Link
                        to="https://spoti.fi/backstagenewsletter"
                        className="text--secondary"
                      >
                        Newsletter
                      </Link>
                      !
                    </div>

                    <div
                      className={clsx(
                        'button button--link',
                        'bannerCloseButton',
                      )}
                      onClick={() => hideNewsletterBanner(true)}
                    >
                      <svg
                        className="text--secondary"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </div>
                  </div>
                )}
              </>
            }
          >
            <ContentBlock
              className={homeStyles.openPlatformBanner}
              title={
                <h1>An open source framework for building developer portals</h1>
              }
              actionButtons={[
                {
                  link: 'https://github.com/backstage/backstage#getting-started',
                  label: 'GITHUB',
                },
                {
                  link: 'https://info.backstage.spotify.com/office-hours',
                  label: 'OFFICE HOURS',
                },
              ]}
            >
              Powered by a centralized software catalog, Backstage restores
              order to your infrastructure and enables your product teams to
              ship high-quality code quickly — without compromising autonomy.
            </ContentBlock>

            <div className={homeStyles.svgContainer}>
              <img
                className="laptopSvg"
                src={`${siteConfig.baseUrl}img/laptop.svg`}
                alt="Illustration of a laptop"
              />
              <img
                className="laptopScreenGif"
                src={`${siteConfig.baseUrl}animations/backstage-logos-hero-8.gif`}
                alt="Animated Backstage Logo"
              />
            </div>
          </BannerSectionGrid>
        </BannerSection>

        <BannerSection diagonalBorder>
          <BannerSectionGrid>
            <ContentBlock
              title="The Speed Paradox"
              topImgSrc={`${siteConfig.baseUrl}animations/backstage-speed-paradox-7.gif`}
            >
              At Spotify, we've always believed in the speed and ingenuity that
              comes from having autonomous development teams. But as we learned
              firsthand, the faster you grow, the more fragmented and complex
              your software ecosystem becomes. And then everything slows down
              again.
            </ContentBlock>

            <ContentBlock
              title="The Standards Paradox"
              topImgSrc={`${siteConfig.baseUrl}animations/backstage-standards-paradox-4.gif`}
            >
              By centralizing services and standardizing your tooling, Backstage
              streamlines your development environment from end to end. Instead
              of restricting autonomy, standardization frees your engineers from
              infrastructure complexity. So you can return to building and
              scaling, quickly and safely.
            </ContentBlock>
          </BannerSectionGrid>
        </BannerSection>

        <BannerSection diagonalBorder greenGradientBackground>
          <div className={homeStyles.catalogContainer}>
            <div className="catalogTitle">
              <img
                src={`${siteConfig.baseUrl}animations/backstage-software-catalog-icon-1.gif`}
                alt="Software Catalog Planet GIF"
              />

              <h2 className="text--primary">Backstage Software Catalog</h2>

              <h1>Build an ecosystem, not a wilderness</h1>
            </div>

            <picture className="catalogImg">
              <source
                srcSet={`${siteConfig.baseUrl}img/components-with-filter.png`}
                media="(min-width: 997px)"
              />
              <img
                src={`${siteConfig.baseUrl}img/components-with-filter-small.png`}
                alt="Software Catalog Filter Sidebar"
              />
            </picture>

            <ContentBlock
              title="Manage all your software, all in one place"
              hasBulletLine
            >
              Backstage makes it easy for one team to manage 10 services — and
              makes it possible for your company to manage thousands of them
            </ContentBlock>

            <ContentBlock title="A uniform overview" hasBulletLine>
              Every team can see all the services they own and related resources
              (deployments, data pipelines, pull request status, etc.)
            </ContentBlock>

            <ContentBlock title="Metadata on tap" hasBulletLine>
              All that information can be shared with plugins inside Backstage
              to enable other management features, like resource monitoring and
              testing
            </ContentBlock>

            <ContentBlock title="Not just services" hasBulletLine>
              Libraries, websites, ML models — you name it, Backstage knows all
              about it, including who owns it, dependencies, and more
            </ContentBlock>

            <ContentBlock
              title="Discoverability & accountability"
              hasBulletLine
            >
              No more orphan software hiding in the dark corners of your tech
              stack
            </ContentBlock>
          </div>
        </BannerSection>

        <BannerSection diagonalBorder greenCallToActionGradientBackground>
          <div className="padding--lg text--center">
            <h1>Learn more about the software catalog</h1>

            <Link
              to="https://backstage.io/docs/features/software-catalog/"
              className="button button--secondary"
            >
              READ
            </Link>
          </div>
        </BannerSection>

        <BannerSection diagonalBorder greenBottomGradientBackground>
          <div className={homeStyles.softwareTemplatesContainer}>
            <div className="softwareTemplatesTitle">
              <img
                src={`${siteConfig.baseUrl}animations/backstage-software-templates-icon-5.gif`}
                alt="Software Templates Rocket GIF"
              />

              <h2 className="text--primary">Backstage Software Templates</h2>

              <h1>Standards can set you free</h1>
            </div>

            <picture className="softwareTemplatesImg">
              <source
                srcSet={`${siteConfig.baseUrl}img/cards.png`}
                media="(min-width: 997px)"
              />
              <img
                src={`${siteConfig.baseUrl}img/service-cards.png`}
                alt="Software Templates Cards"
              />
            </picture>

            <ContentBlock
              title="Like automated getting started guides"
              hasBulletLine
            >
              Using templates, engineers can spin up a new microservice with
              your organization's best practices built-in, right from the start
            </ContentBlock>

            <ContentBlock title="Push-button deployment" hasBulletLine>
              Click a button to create a Spring Boot project with your repo
              automatically configured on GitHub and your CI already running the
              first build
            </ContentBlock>

            <ContentBlock title="Built to your standards" hasBulletLine>
              Go instead of Java? CircleCI instead of Jenkins? Serverless
              instead of Kubernetes? GCP instead of AWS? Customize your recipes
              with your best practices baked-in
            </ContentBlock>

            <ContentBlock title="Golden Paths pave the way" hasBulletLine>
              When the right way is also the easiest way, engineers get up and
              running faster — and more safely
            </ContentBlock>
          </div>
        </BannerSection>

        <BannerSection diagonalBorder greenCallToActionGradientBackground>
          <div className="padding--lg text--center">
            <h1>Build your own software templates</h1>

            <Link
              to="https://backstage.io/docs/features/software-templates"
              className="button button--secondary"
            >
              CONTRIBUTE
            </Link>
          </div>
        </BannerSection>

        <BannerSection diagonalBorder greenBottomGradientBackground>
          <div className={homeStyles.softwareTemplatesContainer}>
            <div className="softwareTemplatesTitle">
              <img
                src={`${siteConfig.baseUrl}animations/backstage-techdocs-icon-1.gif`}
                alt="Backstage TechDocs File Copy GIF"
              />

              <h2 className="text--primary">Backstage TechDocs</h2>

              <h1>Docs like code</h1>
            </div>

            <picture className="softwareTemplatesImg">
              <source
                srcSet={`${siteConfig.baseUrl}img/techdocs2.gif`}
                media="(min-width: 997px)"
              />
              <img
                src={`${siteConfig.baseUrl}img/techdocs-static-mobile.png`}
                alt="Backstage TechDocs Markdown to HTML"
              />
            </picture>

            <ContentBlock title="Free documentation" hasBulletLine>
              Whenever you use a Backstage Software Template, your project
              automatically gets a TechDocs site, for free
            </ContentBlock>

            <ContentBlock title="Easy to write" hasBulletLine>
              With our docs-like-code approach, engineers write their
              documentation in Markdown files right alongside their code
            </ContentBlock>

            <ContentBlock title="Easy to maintain" hasBulletLine>
              Updating code? Update your documentation while you're there — with
              docs and code in the same place, it becomes a natural part of your
              workstream
            </ContentBlock>

            <ContentBlock title="Easy to find and use" hasBulletLine>
              Since all your documentation is in Backstage, finding any TechDoc
              is just a search query away
            </ContentBlock>
          </div>
        </BannerSection>

        <BannerSection diagonalBorder greenCallToActionGradientBackground>
          <div className="padding--lg text--center">
            <h1>Learn more about TechDocs</h1>

            <Link
              to="https://backstage.io/docs/features/techdocs/"
              className="button button--secondary"
            >
              DOCS
            </Link>
          </div>
        </BannerSection>

        <BannerSection diagonalBorder greenGradientBackground>
          <div className={homeStyles.softwareTemplatesContainer}>
            <div className="softwareTemplatesTitle">
              <img
                src={`${siteConfig.baseUrl}animations/backstage-search-platform-icon-1.gif`}
                alt="Search Platform Telescope GIF"
              />

              <h2 className="text--primary">Backstage Search Platform</h2>

              <h1>A search platform made just for you</h1>
            </div>

            <picture className="softwareTemplatesImg">
              <source
                srcSet={`${siteConfig.baseUrl}img/search-platform-overview.png`}
                media="(min-width: 997px)"
              />
              <img
                src={`${siteConfig.baseUrl}img/search-platform-overview-small.png`}
                alt="Search Platform Search Bar"
              />
            </picture>

            <ContentBlock title="Way more than a text box" hasBulletLine>
              Backstage Search more than just a box you type questions into —
              it's an entire platform all by itself, which you can customize to
              fit your organization's needs
            </ContentBlock>

            <ContentBlock title="Search the way you want" hasBulletLine>
              Bring your own search engine, create a customized search page
              experience, or edit the look and feel of each search result
            </ContentBlock>

            <ContentBlock title="Index everything, find anything" hasBulletLine>
              With an extensible backend, you can search beyond the Software
              Catalog and index any source you'd like — whether it's TechDocs or
              Confluence and Stack Overflow
            </ContentBlock>

            <ContentBlock title="Discoverability unlocked" hasBulletLine>
              New hires and seasoned employees alike can easily search your
              infrastructure instead of getting lost in it
            </ContentBlock>
          </div>
        </BannerSection>

        <BannerSection diagonalBorder greenCallToActionGradientBackground>
          <div className="padding--lg text--center">
            <h1>Learn more about Backstage Search</h1>

            <Link
              to="https://backstage.io/docs/features/search/"
              className="button button--secondary"
            >
              READ
            </Link>
          </div>
        </BannerSection>

        <BannerSection diagonalBorder greenBottomGradientBackground>
          <BannerSectionGrid
            className={homeStyles.kubernetesSectionContainer}
            header={
              <>
                <img
                  src={`${siteConfig.baseUrl}animations/backstage-kubernetes-icon-1.gif`}
                  alt="Backstage Kubernetes Flag GIF"
                />

                <h2 className="text--primary">Backstage Kubernetes</h2>

                <h1>Manage your services, not clusters</h1>
              </>
            }
          >
            <ContentBlock
              title="Kubernetes made just for service owners"
              hasBulletLine
            >
              Backstage features the first Kubernetes monitoring tool designed
              around the needs of service owners, not cluster admins
            </ContentBlock>

            <ContentBlock title="Your service at a glance" hasBulletLine>
              Get all your service's deployments in one, aggregated view — no
              more digging through cluster logs in a CLI, no more combing
              through lists of services you don't own
            </ContentBlock>

            <ContentBlock title="Pick a cloud, any cloud" hasBulletLine>
              Since Backstage uses the Kubernetes API, it's cloud agnostic — so
              it works no matter which cloud provider or managed Kubernetes
              service you use, and even works in multi-cloud orgs
            </ContentBlock>

            <ContentBlock title="Any K8s, one UI" hasBulletLine>
              Now you don't have to switch dashboards when you move from local
              testing to production, or from one cloud provider to another
            </ContentBlock>
          </BannerSectionGrid>
        </BannerSection>

        <BannerSection diagonalBorder greenCallToActionGradientBackground>
          <div className="padding--lg text--center">
            <h1>Learn more about the K8s plugin</h1>

            <Link
              to="https://backstage.io/blog/2021/01/12/new-backstage-feature-kubernetes-for-service-owners"
              className="button button--secondary"
            >
              READ
            </Link>
          </div>
        </BannerSection>

        <BannerSection diagonalBorder greenBottomGradientBackground>
          <div className={homeStyles.softwareTemplatesContainer}>
            <div className="softwareTemplatesTitle">
              <img
                src={`${siteConfig.baseUrl}animations/backstage-plugin-icon-2.gif`}
                alt="Plugins Building Blocks GIF"
              />

              <h2 className="text--primary">
                Customize Backstage with plugins
              </h2>

              <h1>An app store for your infrastructure</h1>
            </div>

            <picture className="softwareTemplatesImg">
              <source
                srcSet={`${siteConfig.baseUrl}img/cards-plugins.png`}
                media="(min-width: 997px)"
              />
              <img
                src={`${siteConfig.baseUrl}img/plugins.png`}
                alt="Plugins Cards"
              />
            </picture>

            <ContentBlock title="Add functionality" hasBulletLine>
              Want scalable website testing? Add the{' '}
              <Link to="https://backstage.io/blog/2020/04/06/lighthouse-plugin">
                Lighthouse{' '}
              </Link>
              plugin. Wondering about recommended frameworks? Add the{' '}
              <Link to="https://backstage.io/blog/2020/05/14/tech-radar-plugin">
                Tech Radar{' '}
              </Link>
              plugin.
            </ContentBlock>

            <ContentBlock title="BYO Plugins" hasBulletLine>
              If you don't see the plugin you need, it's simple to build your
              own
            </ContentBlock>

            <ContentBlock
              title="Integrate your own custom tooling"
              hasBulletLine
            >
              Building internal plugins lets you tailor your version of
              Backstage to be a perfect fit for your infrastructure
            </ContentBlock>

            <ContentBlock title="Share with the community" hasBulletLine>
              Building <Link to="/plugins">open source plugins</Link>{' '}
              contributes to the entire Backstage ecosystem, which benefits
              everyone
            </ContentBlock>
          </div>
        </BannerSection>

        <BannerSection diagonalBorder greenCallToActionGradientBackground>
          <div className="padding--lg text--center">
            <h1>Build a plugin</h1>

            <Link
              to="/docs/plugins/create-a-plugin"
              className="button button--secondary"
            >
              CONTRIBUTE
            </Link>
          </div>
        </BannerSection>

        <BannerSection>
          <div className="padding--lg text--center">
            <h2>
              Backstage is a{' '}
              <Link to="https://www.cncf.io">
                Cloud Native Computing Foundation
              </Link>{' '}
              incubation project
            </h2>

            <ThemedImage
              alt="CNCF Logo"
              height="100px"
              sources={{
                light: useBaseUrl(`${siteConfig.baseUrl}img/cncf-color.svg`),
                dark: useBaseUrl(`${siteConfig.baseUrl}img/cncf-white.svg`),
              }}
            />
          </div>
        </BannerSection>

        <HubSpotNewAdoptersForm />
      </div>
    </Layout>
  );
};

export const Home = () => {
  return <BrowserOnly>{() => <HomePage />}</BrowserOnly>;
};
