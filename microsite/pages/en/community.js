/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Components = require(`${process.cwd()}/core/Components.js`);
const Block = Components.Block;
const BulletLine = Components.BulletLine;

const PARTNERS = [
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

const Background = props => {
  const { config: siteConfig } = props;
  const { baseUrl } = siteConfig;
  return (
    <main className="MainContent">
      <Block small className="stripe-bottom bg-black-grey">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title main>Backstage Community</Block.Title>
            <Block.Paragraph>
              Join the vibrant community around Backstage through social media
              and different meetups. To ensure that you have a welcoming
              environment, we follow{' '}
              <a href="https://github.com/cncf/foundation/blob/master/code-of-conduct.md">
                {' '}
                CNCF Code of Conduct
              </a>{' '}
              in everything we do.
            </Block.Paragraph>
          </Block.TextBox>
          <Block.TextBox style={{ margin: 'auto' }}>
            <Block.Paragraph>
              <Block.SmallTitle small>
                Get started in our community!
              </Block.SmallTitle>
              <ul>
                <li>
                  <Block.Paragraph style={{ marginBottom: '0' }}>
                    Chat and get support on our{' '}
                    <a href="https://discord.gg/MUpMjP2">Discord</a>
                  </Block.Paragraph>
                </li>
                <li>
                  <Block.Paragraph style={{ marginBottom: '0' }}>
                    Get into contributing with the{' '}
                    <a href="https://github.com/backstage/backstage/contribute">
                      Good First Issues
                    </a>
                  </Block.Paragraph>
                </li>
                <li>
                  <Block.Paragraph style={{ marginBottom: '0' }}>
                    Subscribe to the{' '}
                    <a href="https://info.backstage.spotify.com/newsletter_subscribe">
                      Community newsletter
                    </a>
                  </Block.Paragraph>
                </li>
                <li>
                  <Block.Paragraph style={{ marginBottom: '0' }}>
                    Join the{' '}
                    <a href="https://twitter.com/i/communities/1494019781716062215">
                      Twitter community
                    </a>
                  </Block.Paragraph>
                </li>
              </ul>
            </Block.Paragraph>
          </Block.TextBox>
        </Block.Container>
      </Block>

      <Block className="stripe-top stripe-bottom bg-teal-bottom">
        <Block.Container style={{ flexFlow: 'column nowrap' }}>
          <Block.TextBox wide>
            <Block.Subtitle>Offical Backstage initiatives</Block.Subtitle>
            <Block.Title small>
              Stay tuned to the latest developments
            </Block.Title>
          </Block.TextBox>

          <Block.Container>
            <Block.TextBox style={{ flexShrink: '1', alignSelf: 'stretch' }}>
              <Block.Container column>
                <BulletLine />
                <Block.SmallTitle small>Community sessions</Block.SmallTitle>
                <Block.Paragraph>
                  Maintainers and adopters meet monthly to share updates, demos,
                  and ideas. Yep, all sessions are recorded!
                </Block.Paragraph>
              </Block.Container>
              <Block.LinkButton href="/on-demand">
                Join a session
              </Block.LinkButton>
            </Block.TextBox>

            <Block.TextBox style={{ flexShrink: '1', alignSelf: 'stretch' }}>
              <Block.Container column>
                <BulletLine />
                <Block.SmallTitle small>Newsletter</Block.SmallTitle>
                <Block.Paragraph>
                  The official monthly Backstage newsletter. Don't miss the
                  latest news from your favorite project!
                </Block.Paragraph>
              </Block.Container>
              <Block.LinkButton href="https://info.backstage.spotify.com/newsletter_subscribe">
                Subscribe
              </Block.LinkButton>
            </Block.TextBox>

            <Block.TextBox style={{ flexShrink: '1', alignSelf: 'stretch' }}>
              <Block.Container column>
                <BulletLine />
                <Block.SmallTitle small>Contributor Spotlight</Block.SmallTitle>
                <Block.Paragraph>
                  A recognition for valuable community work. Nominate
                  contributing members for their efforts! We'll put them in the
                  spotlight ❤️
                </Block.Paragraph>
              </Block.Container>
              <Block.LinkButton href="/nominate">Nominate now</Block.LinkButton>
            </Block.TextBox>
          </Block.Container>
        </Block.Container>
      </Block>

      <Block className="stripe-bottom bg-black-grey">
        <Block.Container wrapped style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox wide>
            <Block.Subtitle>Community initiatives</Block.Subtitle>
          </Block.TextBox>
          <Block.TextBox small style={{ alignSelf: 'stretch' }}>
            <Block.Container column>
              <Block.SmallTitle>Open Mic Meetup</Block.SmallTitle>
              <Block.Paragraph>
                A casual get together of Backstage users sharing their
                experiences and helping each other. Hosted by{' '}
                <a href="https://roadie.io/">Roadie.io</a> and{' '}
                <a href="https://frontside.com/">Frontside Software</a>.
              </Block.Paragraph>
            </Block.Container>
            <Block.LinkButton href="https://backstage-openmic.com/">
              Learn more
            </Block.LinkButton>
          </Block.TextBox>
          <Block.TextBox small style={{ alignSelf: 'stretch' }}>
            <Block.Container column>
              <Block.SmallTitle>Backstage Weekly Newsletter</Block.SmallTitle>
              <Block.Paragraph>
                A weekly newsletter with news, updates and things community from
                your friends at <a href="https://roadie.io/">Roadie.io</a>.
              </Block.Paragraph>
            </Block.Container>
            <Block.LinkButton href="https://roadie.io/backstage-weekly/">
              Learn more
            </Block.LinkButton>
          </Block.TextBox>
        </Block.Container>
      </Block>

      <Block className="stripe-top stripe-bottom">
        <Block.Container style={{ flexFlow: 'column nowrap' }}>
          <Block.TextBox wide>
            <Block.Subtitle>Trainings and Certifications</Block.Subtitle>
          </Block.TextBox>
          <Block.TextBox style={{ flexShrink: '1', alignSelf: 'stretch' }}>
            <BulletLine />
            <Block.SmallTitle small>
              Introduction to Backstage: Developer Portals Made Easy (LFS142x)
            </Block.SmallTitle>
            <Block.Paragraph>
              This is a course produced and curated by the Linux Foundation.
              This course introduces you to Backstage and how to get started
              with the project.
            </Block.Paragraph>

            <Block.LinkButton href="https://training.linuxfoundation.org/training/introduction-to-backstage-developer-portals-made-easy-lfs142x/">
              Learn more
            </Block.LinkButton>
          </Block.TextBox>
        </Block.Container>
      </Block>

      <Block className="stripe-top bg-black-grey">
        <Block.Container wrapped style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox wide>
            <Block.Subtitle>Commercial Partners</Block.Subtitle>
          </Block.TextBox>
          {PARTNERS.map(partner => (
            <Block.TextBox small>
              <Block.SmallTitle>
                <a href={partner.url}>
                  <img src={`${baseUrl}${partner.logo}`} alt={partner.name} />
                </a>
              </Block.SmallTitle>
            </Block.TextBox>
          ))}
        </Block.Container>
      </Block>
    </main>
  );
};

module.exports = Background;
