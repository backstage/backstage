/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Components = require(`${process.cwd()}/core/Components.js`);
const Block = Components.Block;
const Breakpoint = Components.Breakpoint;

const Background = props => {
  const { config: siteConfig } = props;
  const { baseUrl } = siteConfig;
  return (
    <div className="mainWrapper">
      <Block>
        <Block.Container column>
          <Block.TitleBox story>The Spotify Story</Block.TitleBox>
          <Block.TextBox>
            <Block.Paragraph>
              Backstage was born out of necessity at Spotify. We found that as
              we grew, our infrastructure was becoming more fragmented, our
              engineers less productive.{' '}
            </Block.Paragraph>

            <Block.Paragraph>
              Instead of building and testing code, teams were spending more
              time looking for the right information just to get started.
              “Where’s the API for that service we’re all supposed to be using?”
              “What version of that framework is everyone on?” “This service
              isn’t responding, who owns it?” “I can’t find documentation for
              anything!”{' '}
            </Block.Paragraph>
            <Breakpoint
              narrow={
                <Block small>
                  <Block.QuoteContainer>
                    <Block.Divider quote />

                    <Block.Quote>
                      One place for everything. Accessible to everyone.
                    </Block.Quote>
                  </Block.QuoteContainer>
                </Block>
              }
            ></Breakpoint>
            <Block.Paragraph>
              Context switching and cognitive overload were dragging engineers
              down, day by day. We needed to make it easier for our engineers to
              do their work without having to become an expert in every aspect
              of infrastructure tooling.
            </Block.Paragraph>

            <Block.Paragraph>
              Our idea was to centralize and simplify end-to-end software
              development with an abstraction layer that sits on top of all of
              our infrastructure and developer tooling. That’s Backstage.
            </Block.Paragraph>

            <Block.Paragraph>
              It’s a developer portal powered by a centralized service catalog —
              with a plugin architecture that makes it endlessly extensible and
              customizable.
            </Block.Paragraph>

            <Block.Paragraph>
              Manage all your services, software, tooling, and testing in
              Backstage. Start building a new microservice using an automated
              template in Backstage. Create, maintain, and find the
              documentation for all that software in Backstage.{' '}
            </Block.Paragraph>

            <Block.Paragraph>
              One place for everything. Accessible to everyone.
            </Block.Paragraph>
            <Breakpoint
              narrow={
                <Block small>
                  <Block.LinkButton stretch href={'https://backstage.io/'}>
                    Explore Features
                  </Block.LinkButton>
                </Block>
              }
            ></Breakpoint>
          </Block.TextBox>
        </Block.Container>
      </Block>
      <Breakpoint
        wide={
          <Block small>
            <Block.QuoteContainer>
              <Block.Divider quote />

              <Block.Quote>
                One place for everything. Accessible to everyone.
              </Block.Quote>
              <Block.LinkButton stretch href={'https://backstage.io/'}>
                Explore Features
              </Block.LinkButton>
            </Block.QuoteContainer>
          </Block>
        }
      ></Breakpoint>

      <div
        style={{
          zIndex: -1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient( to bottom, rgb(18, 18, 18), rgba(0, 0, 0, 0) ), url(../img/dot.svg)`,
        }}
      />
    </div>
  );
};

module.exports = Background;
