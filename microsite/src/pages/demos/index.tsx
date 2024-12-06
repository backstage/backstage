import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { BannerSection } from '@site/src/components/bannerSection/bannerSection';
import { BannerSectionGrid } from '@site/src/components/bannerSection/bannerSectionGrid';
import { ContentBlock } from '@site/src/components/contentBlock/contentBlock';
import Layout from '@theme/Layout';
import { clsx } from 'clsx';
import { ReactNode } from 'react';

import demosStyles from './demos.module.scss';

interface IDemoItem {
  title: string;
  content: ReactNode;
  actionItemLink?: string;
  media: {
    type: 'image' | 'video';
    link: string;
  };
}

const Demos = () => {
  const { siteConfig } = useDocusaurusContext();

  //#region Collection Data
  const demoItems: IDemoItem[] = [
    {
      title: 'See us in action',
      content: (
        <>
          <p>
            Watch the videos below to get an introduction to Backstage and to
            see how we use different plugins to customize{' '}
            <Link to="https://engineering.atspotify.com/2020/04/21/how-we-use-backstage-at-spotify/">
              our internal version of Backstage at Spotify
            </Link>
          </p>
          <p>
            To see how other companies have already started using Backstage,
            watch these presentations from{' '}
            <Link to="https://youtu.be/rRphwXeq33Q?t=1508">Expedia</Link>,{' '}
            <Link to="https://youtu.be/6sg5uMCLxTA?t=153">Zalando</Link>, and{' '}
            <Link to="https://youtu.be/UZTVjv-AvZA?t=188">TELUS</Link>. For
            more, join our{' '}
            <Link to="https://github.com/backstage/community">
              Community Sessions
            </Link>
          </p>
          <p>
            To explore the UI and basic features of Backstage firsthand, go to:{' '}
            <Link to="https://demo.backstage.io">demo.backstage.io</Link>. (Tip:{' '}
            click “All” to view all the example components in the software
            catalog.)
          </p>
        </>
      ),
      media: {
        type: 'image',
        link: `${siteConfig.baseUrl}img/demo-screen.png`,
      },
    },
    {
      title: 'Introduction to Backstage',
      content:
        'Backstage is an open source framework for building developer portals. We’ve been using our homegrown version at Spotify for years — so it’s already packed with features. (We have over 120 internal plugins, built by 60 different teams.) In this live demo recording, Stefan Ålund, product manager for Backstage, tells the origin story of Backstage and gives you a tour of how we use it here at Spotify.',
      actionItemLink: 'https://www.youtube.com/watch?v=1XtJ5FAOjPk',
      media: {
        type: 'video',
        link: 'https://www.youtube.com/embed/1XtJ5FAOjPk',
      },
    },
    {
      title: 'Control cloud costs',
      content: (
        <>
          <p>
            How do you control cloud costs while maintaining the speed and
            independence of your development teams? With the{' '}
            <Link to="https://backstage.io/plugins">Cost Insights plugin</Link>{' '}
            for Backstage, managing cloud costs becomes just another part of an
            engineer’s daily development process. They get a clear view of their
            spending — and can decide for themselves how they want to optimize
            it. Learn more about the{' '}
            <Link to="https://backstage.io/blog/2020/10/22/cost-insights-plugin">
              Cost Insights plugin
            </Link>
          </p>
        </>
      ),
      actionItemLink: 'https://youtu.be/YLAd5hdXR_Q',
      media: {
        type: 'video',
        link: 'https://www.youtube.com/embed/YLAd5hdXR_Q',
      },
    },
    {
      title: 'Make documentation easy',
      content: (
        <>
          <p>
            Documentation! Everyone needs it, no one wants to create it, and no
            one can ever find it. Backstage follows a “docs like code” approach:
            you write documentation in Markdown files right alongside your code.
            This makes documentation easier to create, maintain, find — and, you
            know, actually use. This demo video showcases Spotify’s internal
            version of TechDocs. Learn more about{' '}
            <Link to="https://backstage.io/blog/2020/09/08/announcing-tech-docs">
              TechDocs
            </Link>
            .
          </p>
        </>
      ),
      actionItemLink: 'https://youtu.be/mOLCgdPw1iA',
      media: {
        type: 'video',
        link: 'https://www.youtube.com/embed/mOLCgdPw1iA',
      },
    },
    {
      title: 'Manage your tech health',
      content:
        'Instead of manually updating a spreadsheet, what if you had a beautiful dashboard that could give you an instant, interactive picture of your entire org’s tech stack? That’s how we do it at Spotify. With our Tech Insights plugin for Backstage, anyone at Spotify can see which version of which software anyone else at Spotify is using — and a whole a lot more. From managing migrations to fighting tech entropy, Backstage makes managing our tech health actually kind of pleasant.',
      actionItemLink:
        'https://www.youtube.com/watch?v=K3xz6VAbgH8&list=PLf1KFlSkDLIBtMGwRDfaVlKMqTMrjD2yO&index=6',
      media: {
        type: 'video',
        link: 'https://www.youtube.com/embed/K3xz6VAbgH8',
      },
    },
    {
      title: 'Create a microservice',
      content:
        'You’re a Spotify engineer about to build a new microservice (or any component) using Spring Boot. Where do you start? Search for a quick start guide online? Create an empty repo on GitHub? Copy and paste an old project? Nope. Just go to Backstage, and you’ll be up and running in two minutes — with a “Hello World” app, CI, and documentation all automatically set up and configured in a standardized way.',
      actionItemLink: 'https://www.youtube.com/watch?v=U1iwe3L5pzc',
      media: {
        type: 'video',
        link: 'https://www.youtube.com/embed/U1iwe3L5pzc',
      },
    },
    {
      title: 'Search all your services',
      content:
        'All of Spotify’s services are automatically indexed in Backstage. So our engineers can stop playing detective — no more spamming Slack channels asking if anyone knows who owns a particular service and where you can find its API, only to discover that the owner went on sabbatical three months ago and you have to hunt them down on a mountain in Tibet where they’re on a 12-day silent meditation retreat. At Spotify, anyone can always find anyone else’s service, inspect its APIs, and contact its current owner — all with one search.',
      actionItemLink: 'https://www.youtube.com/watch?v=vcDL9tOv7Eo',
      media: {
        type: 'video',
        link: 'https://www.youtube.com/embed/vcDL9tOv7Eo',
      },
    },
    {
      title: 'Manage data pipelines',
      content:
        'We manage a lot of data pipelines (also known as workflows) here at Spotify. So, of course, we made a great workflows plugin for our version of Backstage. All our workflow tools — including a scheduler, log inspector, data lineage graph, and configurable alerts — are integrated into one simple interface.',
      actionItemLink: 'https://www.youtube.com/watch?v=rH46MLNZIPM',
      media: {
        type: 'video',
        link: 'https://www.youtube.com/embed/rH46MLNZIPM',
      },
    },
  ];
  //#endregion

  return (
    <Layout>
      <div className={clsx(demosStyles.communityPage)}>
        {demoItems.map((demoItem, index) => (
          <BannerSection
            key={index}
            diagonalBottomBorder={index === 0}
            diagonalBorder={index > 0 && index < demoItems.length - 1}
            greyBackground={index % 2 === 0}
            className={demosStyles.banner}
          >
            <BannerSectionGrid>
              <ContentBlock
                title={<h1>{demoItem.title}</h1>}
                actionButtons={
                  demoItem.actionItemLink
                    ? [
                        {
                          link: demoItem.actionItemLink,
                          label: 'WATCH NOW',
                        },
                      ]
                    : []
                }
              >
                {demoItem.content}
              </ContentBlock>

              <div className={clsx()}>
                {demoItem.media.type === 'image' ? (
                  <img src={demoItem.media.link} alt={demoItem.title} />
                ) : (
                  <iframe
                    src={demoItem.media.link}
                    title={demoItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </BannerSectionGrid>
          </BannerSection>
        ))}
      </div>
    </Layout>
  );
};

export default Demos;
