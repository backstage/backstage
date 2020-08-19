/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <div className="footer-title">
            <a href={this.props.config.baseUrl}>
              <h2 className="footerLogo"></h2>
            </a>
          </div>
          <div>
            <h5>Docs</h5>
            <a href={`/docs/overview/what-is-backstage`}>What is Backstage?</a>
            <a href={`/docs/getting-started/`}>Getting started</a>
            <a
              href={`/docs/features/software-catalog/software-catalog-overview`}
            >
              Service Catalog
            </a>
            <a href={`/docs/plugins/create-a-plugin`}>Create a Plugin</a>
            <a href={`/docs/dls/design`}>Designing for Backstage</a>
          </div>
          <div>
            <h5>Community</h5>
            <a href="https://discord.gg/MUpMjP2">Support chatroom</a>
            <a href="https://mailchi.mp/spotify/backstage-community">
              Subscribe to our newsletter
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href={this.props.config.fossWebsite}>
              Open Source @ {this.props.config.organizationName}
            </a>
            <a href={this.props.config.repoUrl}>GitHub</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/spotify/backstage/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
            {this.props.config.twitterUsername && (
              <div className="social">
                <a
                  href={`https://twitter.com/${this.props.config.twitterUsername}`}
                  className="twitter-follow-button"
                >
                  Follow @{this.props.config.twitterUsername}
                </a>
              </div>
            )}
          </div>
        </section>

        <a
          href={this.props.config.fossWebsite}
          target="_blank"
          rel="noreferrer noopener"
          className="spotifyOpenSource"
        >
          Made with <span>❤</span> at {this.props.config.organizationName}
        </a>
        <p className="copyright">{this.props.config.copyright}</p>
      </footer>
    );
  }
}

module.exports = Footer;
