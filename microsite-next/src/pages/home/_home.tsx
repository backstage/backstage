import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { clsx } from 'clsx';
import React from 'react';

import { BannerSection } from '../../components/banner-section/banner-section';
import homeStyles from './home.module.scss';
import { BannerSectionColumns } from '../../components/banner-section/banner-section-columns';
import { ContentBlock } from '@site/src/components/content-block/content-block';

export function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout>
      <div className={homeStyles.homePage}>
        <BannerSection greyBackground>
          <BannerSectionColumns
            header={
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
                    to="https://info.backstage.spotify.com/newsletter_subscribe"
                    className="text--secondary"
                  >
                    Newsletter
                  </Link>
                  !
                </div>

                <div className="bannerCloseButton">X</div>
              </div>
            }
          >
            <ContentBlock
              className={homeStyles.openPlatformBanner}
              title={<h1> An open platform for building developer portals</h1>}
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
              />
              <img
                className="laptopScreenGif"
                src={`${siteConfig.baseUrl}animations/backstage-logos-hero-8.gif`}
              />
            </div>
          </BannerSectionColumns>
        </BannerSection>

        <BannerSection>
          <BannerSectionColumns>
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
          </BannerSectionColumns>
        </BannerSection>

        <BannerSection greenGradientBackground>
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
                alt=""
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

        <BannerSection greenCallToActionGradientBackground>
          <div className="padding--lg text--center">
            <h1>Learn more about the software catalog</h1>

            <Link
              to="https://backstage.io/docs/features/software-catalog/software-catalog-overview"
              className="button button--secondary"
            >
              READ
            </Link>
          </div>
        </BannerSection>

        <BannerSection greenGradientBackground>
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
              <img src={`${siteConfig.baseUrl}img/service-cards.png`} alt="" />
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

        <BannerSection greenCallToActionGradientBackground>
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

        <BannerSection greenCallToActionGradientBackground>
          <div className="padding--lg text--center">
            <h1>Learn more about TechDocs</h1>

            <Link
              to="https://backstage.io/docs/features/techdocs/techdocs-overview"
              className="button button--secondary"
            >
              DOCS
            </Link>
          </div>
        </BannerSection>

        <BannerSection greenCallToActionGradientBackground>
          <div className="padding--lg text--center">
            <h1>Learn more about Backstage Search</h1>

            <Link
              to="https://backstage.io/docs/features/search/search-overview"
              className="button button--secondary"
            >
              READ
            </Link>
          </div>
        </BannerSection>

        <BannerSection greenCallToActionGradientBackground>
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

        <BannerSection greenCallToActionGradientBackground>
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
      </div>
    </Layout>
  );
}
