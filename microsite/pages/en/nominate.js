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
          <Block.Title>Contributor Spotlight nomination</Block.Title>
          <Block.TextBox>
            <Block.Paragraph></Block.Paragraph>
          </Block.TextBox>
        </Block.Container>
      </Block>

      <Block className="stripe bg-black">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdiZ28O7vwHo6NrwirEzGSbuVyBANSv7ItHqRlgVvSz3Z5xqQ/viewform?embedded=true"
            width="800"
            height="1262"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
          >
            Loading…
          </iframe>
        </Block.Container>
      </Block>
    </main>
  );
};

module.exports = Background;
