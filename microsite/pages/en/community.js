/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Components = require(`${process.cwd()}/core/Components.js`);
const Block = Components.Block;

const Background = props => {
  const { config: siteConfig } = props;
  const { baseUrl } = siteConfig;
  return (
    <main className="MainContent">
      <Block small className="stripe-bottom bg-black-grey">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title>Backstage Community</Block.Title>
          </Block.TextBox>
          <Block.TextBox>
            <Block.Paragraph>
              What's the use of having fun if you can't share it? Exactly. Join
              the vibrant community around the Backstage project. Be it on
              GitHub, social media, Discord... You'll find a welcoming
              environment. To ensure this, we follow the{' '}
              <a href="https://github.com/cncf/foundation/blob/master/code-of-conduct.md">
                {' '}
                CNCF Code of Conduct
              </a>{' '}
              in everything we do.
            </Block.Paragraph>
          </Block.TextBox>
          <Block.TextBox>
            <Block.Paragraph>
              Main community channels
              <br />- Chat and get support on our{' '}
              <a href="https://discord.gg/MUpMjP2">Discord</a>
              <br />- Get into contributing with the{' '}
              <a href="https://github.com/backstage/backstage/contribute">
                Good First Issues
              </a>
              <br />- Subscribe to the{' '}
              <a href="https://mailchi.mp/spotify/backstage-community">
                Community newsletter
              </a>
              <br />- Join the{' '}
              <a href="https://twitter.com/i/communities/1494019781716062215">
                Twitter community
              </a>
              <br />
            </Block.Paragraph>
          </Block.TextBox>
        </Block.Container>
      </Block>

      <Block small className="stripe bg-black">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title>Backstage Community Sessions</Block.Title>
            <Block.Paragraph>
              Missed a meetup? Wondering when the next one is coming up? We've
              got you covered! Check out our all-new Meetups page.
            </Block.Paragraph>
            <Block.LinkButton href="/on-demand">Meetups</Block.LinkButton>
          </Block.TextBox>
          <Block.TextBox>
            <Block.Title>Adopter Community Sessions</Block.Title>
            <Block.Paragraph>
              Backstage Community Sessions is the monthly meetup where we all
              come together to listen to the latest maintainer updates, learn
              from each other about adopting, share exciting new demos or
              discuss any relevant topic like developer effectiveness, developer
              experience, developer portals, etc. Have something to share, or a
              burning question? Add it to the{' '}
              <a href="https://github.com/backstage/community/issues">issue</a>.
            </Block.Paragraph>
          </Block.TextBox>
          <Block.TextBox>
            <Block.Title>Contributor Community Sessions</Block.Title>
            <Block.Paragraph>
              Discuss all things contributing, diving deep under the hood of
              Backstage (Backstage of Backstage? Backerstage?). An open
              discussion with maintainers and contributors of Backstage. If you
              like Backstage, this is your favorite Zoom meeting of the month,
              guaranteed! Have something to share, or a burning question? Add it
              to the{' '}
              <a href="https://github.com/backstage/community/issues">issue</a>.
            </Block.Paragraph>
          </Block.TextBox>
        </Block.Container>
      </Block>

      <Block small className="stripe bg-black-grey">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title>Backstage official Newsletter</Block.Title>
          </Block.TextBox>
          <Block.TextBox>
            <Block.Paragraph>
              The official monthly Backstage newsletter. Containing the latest
              news from your favorite project.
            </Block.Paragraph>
            <Block.LinkButton href="https://mailchi.mp/spotify/backstage-community">
              Subscribe
            </Block.LinkButton>
          </Block.TextBox>
        </Block.Container>
      </Block>

      <Block className="stripe bg-black">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title>Spotlight</Block.Title>
            <Block.Paragraph>
              A recognition for valuable community work, the{' '}
              <b>Contributor Spotlight</b>. Nominate contributing members for
              their efforts! We'll put them in the spotlight ❤️.
              <br />
            </Block.Paragraph>
            <Block.LinkButton href="nominate ">Nominate now</Block.LinkButton>
          </Block.TextBox>
          <Block.TextBox>
            <Block.Title>Open Mic Meetup</Block.Title>
            <Block.Paragraph>
              A monthly casual get together of Backstage users sharing their
              experiences and helping each other. Hosted by{' '}
              <a href="https://roadie.io/">Roadie.io</a> and{' '}
              <a href="https://frontside.com/">Frontside Software</a>.
              <br />
            </Block.Paragraph>
            <Block.LinkButton href="https://backstage-openmic.com/">
              Learn more
            </Block.LinkButton>
          </Block.TextBox>
          <Block.TextBox>
            <Block.Title>Backstage Weekly</Block.Title>
            <Block.Paragraph>
              A weekly newsletter with news, updates and things community from
              your friends at <a href="https://roadie.io/">Roadie.io</a>.
            </Block.Paragraph>
            <Block.LinkButton href="https://roadie.io/backstage-weekly/">
              Learn more
            </Block.LinkButton>
          </Block.TextBox>
        </Block.Container>
      </Block>
    </main>
  );
};

module.exports = Background;
