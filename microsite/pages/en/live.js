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
            <Block.Title>Community Sessions</Block.Title>
            <Block.Paragraph>
              Please be aware we follow the{' '}
              <a href="https://github.com/cncf/foundation/blob/master/code-of-conduct.md">
                {' '}
                CNCF Code of Conduct
              </a>
              .
            </Block.Paragraph>
          </Block.TextBox>
        </Block.Container>
      </Block>

      <Block className="stripe bg-black">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.Paragraph>
            <iframe
              width="1280"
              height="720"
              src="https://www.youtube.com/embed/mFi_X58igzk"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </Block.Paragraph>
          <Block.TextBox>
            <iframe
              src="https://www.youtube.com/live_chat?v=mFi_X58igzk&embed_domain=backstage.io&dark_theme=1"
              width="400px"
              height="680px"
            ></iframe>
          </Block.TextBox>
        </Block.Container>
      </Block>

      <Block className="stripe bg-black-grey">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title>Don't be a stranger</Block.Title>
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
    </main>
  );
};

module.exports = Background;
