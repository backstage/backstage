import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { clsx } from 'clsx';
import React from 'react';

import homeStyles from './home.module.scss';

export function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout>
      <section className={homeStyles.homePage}>
        <div className="container">
          <div className="row padding-vert--lg">
            <div className="col">
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
            </div>
          </div>

          <div className={clsx('row', homeStyles.openPlatformBanner)}>
            <div className="col padding-bottom--lg">
              <h1>An open platform for building developer portals</h1>

              <p>
                Powered by a centralized software catalog, Backstage restores
                order to your infrastructure and enables your product teams to
                ship high-quality code quickly — without compromising autonomy.
              </p>

              <div className="buttonsContainer">
                <Link
                  to="https://github.com/backstage/backstage#getting-started"
                  className="button button--primary"
                >
                  GITHUB
                </Link>
                <Link
                  to="https://info.backstage.spotify.com/office-hours"
                  className="button button--primary"
                >
                  OFFICE HOURS
                </Link>
              </div>
            </div>

            <div className="col padding-bottom--lg svgContainer">
              <img
                className="laptopSvg"
                src={`${siteConfig.baseUrl}img/laptop.svg`}
              />
              <img
                className="laptopScreenGif"
                src={`${siteConfig.baseUrl}animations/backstage-logos-hero-8.gif`}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
