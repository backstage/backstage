/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const FooterCol = ({ children }) => (
  <div className="col footer__col">{children}</div>
);

const FooterTitle = ({ children }) => (
  <h4 className="footer__title">{children}</h4>
);

const FooterItems = ({ children }) => (
  <ul className="footer__items">{children}</ul>
);

const FooterItem = ({ children }) => (
  <li className="footer__item">{children}</li>
);

const FooterLinkItem = ({ children, ...rest }) => (
  <a className="footer__link-item" {...rest}>
    {children}
  </a>
);

const Footer = () => (
  <footer className="footer" id="footer">
    <div className="container">
      <div className="row footer__links">
        <FooterCol>
          <FooterTitle>
            <a className="footer__link-item" href={useBaseUrl('/')}>
              <img
                className="footer__logo"
                src={useBaseUrl('/static/img/logo.svg')}
                alt="Backstage"
              />
            </a>
          </FooterTitle>
        </FooterCol>
        <FooterCol>
          <FooterTitle>Docs</FooterTitle>
          <FooterItems>
            <FooterItem>
              <FooterLinkItem href="/docs/overview/what-is-backstage">
                What is Backstage?
              </FooterLinkItem>
            </FooterItem>
            <FooterItem>
              <FooterLinkItem href="/docs/getting-started/index">
                Getting started
              </FooterLinkItem>
            </FooterItem>
            <FooterItem>
              <FooterLinkItem href="/docs/features/software-catalog/software-catalog-overview">
                Service Catalog
              </FooterLinkItem>
            </FooterItem>
            <FooterItem>
              <FooterLinkItem href="/docs/plugins/create-a-plugin">
                Create a Plugin
              </FooterLinkItem>
            </FooterItem>
            <FooterItem>
              <FooterLinkItem href="/docs/dls/design">
                Designing for Backstage
              </FooterLinkItem>
            </FooterItem>
          </FooterItems>
        </FooterCol>
        <FooterCol>
          <FooterTitle>Community</FooterTitle>
          <FooterItems>
            <FooterItem>
              <FooterLinkItem href="https://discord.gg/MUpMjP2">
                Support chatroom
              </FooterLinkItem>
            </FooterItem>
            <FooterItem>
              <FooterLinkItem href="https://github.com/spotify/backstage/blob/master/CONTRIBUTING.md">
                Contributing
              </FooterLinkItem>
            </FooterItem>
            <FooterItem>
              <FooterLinkItem href="https://mailchi.mp/spotify/backstage-community">
                Subscribe to our newsletter
              </FooterLinkItem>
            </FooterItem>
            <FooterItem>
              <FooterLinkItem href="https://www.cncf.io/sandbox-projects/">
                CNCF Sandbox
              </FooterLinkItem>
            </FooterItem>
          </FooterItems>
        </FooterCol>
        <FooterCol>
          <FooterTitle>More</FooterTitle>
          <FooterItems>
            <FooterItem>
              <FooterLinkItem href="https://spotify.github.io/">
                Open Source @Spotify
              </FooterLinkItem>
            </FooterItem>
            <FooterItem>
              <FooterLinkItem href="https://github.com/spotify/backstage">
                GitHub
              </FooterLinkItem>
            </FooterItem>
            <FooterItem>
              <FooterLinkItem>
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=spotify&repo=backstage&type=star&count=true"
                  frameborder="0"
                  scrolling="0"
                  width="150"
                  height="20"
                  title="GitHub"
                ></iframe>
              </FooterLinkItem>
            </FooterItem>
            <FooterItem>
              <FooterLinkItem>
                <a
                  href="https://twitter.com/SpotifyEng?ref_src=twsrc%5Etfw"
                  class="twitter-follow-button"
                  data-show-count="true"
                >
                  Follow @SpotifyEng
                </a>
              </FooterLinkItem>
            </FooterItem>
          </FooterItems>
        </FooterCol>
      </div>

      <p className="footer__copyright">
        Copyright © ${new Date().getFullYear()} Backstage Project Authors. All
        rights reserved. The Linux Foundation has registered trademarks and uses
        trademarks. For a list of trademarks of The Linux Foundation, please see
        our Trademark Usage page:
        https://www.linuxfoundation.org/trademark-usage
      </p>
    </div>
  </footer>
);

export default Footer;
