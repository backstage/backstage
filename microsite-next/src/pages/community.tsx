import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { clsx } from 'clsx';
import React from 'react';

import communityStyles from './community.module.scss';

interface ICollectionItem {
  title?: string;
  content: React.ReactNode;
  label: string;
  link: string;
}

export default function Community() {
  const { siteConfig } = useDocusaurusContext();

  const communityListItems: ICollectionItem[] = [
    {
      content: 'Chat and get support on our',
      label: 'Discord',
      link: 'https://discord.gg/MUpMjP2',
    },
    {
      content: 'Get into contributing with the',
      label: 'Good First Issues',
      link: 'https://github.com/backstage/backstage/contribute',
    },
    {
      content: 'Subscribe to the',
      label: 'Community newsletter',
      link: 'https://info.backstage.spotify.com/newsletter_subscribe',
    },
    {
      content: 'Join the',
      label: 'Twitter community',
      link: 'https://twitter.com/i/communities/1494019781716062215',
    },
  ];

  const officialInitiatives: ICollectionItem[] = [
    {
      title: 'Community sessions',
      content:
        'Maintainers and adopters meet monthly to share updates, demos, and ideas. Yep, all sessions are recorded!',
      link: '/on-demand',
      label: 'Join a session',
    },
    {
      title: 'Newsletter',
      content:
        "The official monthly Backstage newsletter. Don't miss the latest news from your favorite project!",
      link: 'https://info.backstage.spotify.com/newsletter_subscribe',
      label: 'Subscribe',
    },
    {
      title: 'Contributor Spotlight',
      content:
        "A recognition for valuable community work. Nominate contributing members for their efforts! We'll put them in the spotlight ❤️",
      link: '/nominate',
      label: 'Nominate now',
    },
  ];

  const communityInitiatives: ICollectionItem[] = [
    {
      title: 'Open Mic Meetup',
      content: (
        <>
          A casual get together of Backstage users sharing their experiences and
          helping each other. Hosted by{' '}
          <Link to="https://roadie.io/">Roadie.io</Link> and{' '}
          <Link to="https://frontside.com/">Frontside Software</Link>.
        </>
      ),
      link: 'https://backstage-openmic.com/',
      label: 'Learn more',
    },
    {
      title: 'Backstage Weekly Newsletter',
      content: (
        <>
          A weekly newsletter with news, updates and things community from your
          friends at <Link to="https://roadie.io/">Roadie.io</Link>.
        </>
      ),
      link: 'https://roadie.io/backstage-weekly/',
      label: 'Learn more',
    },
  ];

  const trainingNCertifications: ICollectionItem[] = [
    {
      title: 'Open Mic Meetup',
      content:
        'This is a course produced and curated by the Linux Foundation. This course introduces you to Backstage and how to get started with the project.',
      link: 'https://training.linuxfoundation.org/training/introduction-to-backstage-developer-portals-made-easy-lfs142x/',
      label: 'Learn more',
    },
  ];

  const partners: { name: string; url: string; logo: string }[] = [
    {
      name: 'Frontside Software',
      url: 'https://frontside.com/backstage/',
      logo: 'img/partner-logo-frontside.png',
    },
    {
      name: 'Roadie',
      url: 'https://roadie.io/',
      logo: 'img/partner-logo-roadie.png',
    },
    {
      name: 'ThoughtWorks',
      url: 'https://www.thoughtworks.com',
      logo: 'img/partner-logo-thoughtworks.png',
    },
    {
      name: 'VMWare',
      url: 'https://www.vmware.com',
      logo: 'img/partner-logo-vmware.png',
    },
  ];

  return (
    <Layout>
      <div className={clsx(communityStyles.communityPage)}>
        <section className={communityStyles.banner}>
          <div className={clsx('container')}>
            <div className="row">
              <div
                className={clsx('col', 'padding-vert--xl padding-right--xl')}
              >
                <h1 className={clsx('margin-bottom--lg')}>
                  Backstage Community
                </h1>

                <p>
                  Join the vibrant community around Backstage through social
                  media and different meetups. To ensure that you have a
                  welcoming environment, we follow the
                  <a href="https://github.com/cncf/foundation/blob/master/code-of-conduct.md">
                    {' '}
                    CNCF Code of Conduct{' '}
                  </a>
                  in everything we do.
                </p>
              </div>

              <div className={clsx('col', 'padding-vert--xl padding-left--xl')}>
                <h2 className={clsx('margin-bottom--lg')}>
                  Get started in our community!
                </h2>

                <ul>
                  {communityListItems.map(
                    ({ content: text, link, label }, index) => (
                      <li key={index}>
                        <p className="margin-bottom--none">
                          {text} <a href={link}>{label}</a>
                        </p>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className={communityStyles.officialInitiatives}>
          <div className={clsx('container', 'padding-vert--xl')}>
            <div className="padding-bottom--xl">
              <h2 className="text--primary">Offical Backstage initiatives</h2>

              <h1>Stay tuned to the latest developments</h1>
            </div>

            <div className="row">
              {officialInitiatives.map(
                ({ title, content, link, label }, index) => (
                  <div className={clsx('col')} key={index}>
                    <div className="bulletLine"></div>

                    <h2>{title}</h2>

                    <p className="padding-bottom--lg">{content}</p>

                    <Link
                      className="button button--primary button--lg"
                      to={link}
                    >
                      {label}
                    </Link>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className={communityStyles.communityInitiatives}>
          <div className={clsx('container', 'padding-vert--xl')}>
            <div className="padding-bottom--xl">
              <h2 className="text--primary">Community initiatives</h2>
            </div>

            <div className="row">
              {communityInitiatives.map(
                ({ title, content, link, label }, index) => (
                  <div className={clsx('col')} key={index}>
                    <div className="bulletLine"></div>

                    <h2>{title}</h2>

                    <p className="padding-bottom--lg">{content}</p>

                    <Link
                      className="button button--primary button--lg"
                      to={link}
                    >
                      {label}
                    </Link>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className={communityStyles.trainingNCertifications}>
          <div className={clsx('container', 'padding-vert--xl')}>
            <div className="padding-bottom--xl">
              <h2 className="text--primary">Trainings and Certifications</h2>
            </div>

            <div className="row">
              {trainingNCertifications.map(
                ({ title, content, link, label }, index) => (
                  <div className={clsx('col')} key={index}>
                    <div className="bulletLine"></div>

                    <h2>{title}</h2>

                    <p className="padding-bottom--lg">{content}</p>

                    <Link
                      className="button button--primary button--lg"
                      to={link}
                    >
                      {label}
                    </Link>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className={communityStyles.commercialPartners}>
          <div className={clsx('container', 'padding-vert--xl')}>
            <div className="padding-bottom--xl">
              <h2 className="text--primary">Commercial Partners</h2>
            </div>

            <div className="row">
              {partners.map(({ name, url, logo }, index) => (
                <div className={clsx('col')} key={index}>
                  <Link to={url}>
                    <img src={`${siteConfig.baseUrl}${logo}`} alt={name} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
