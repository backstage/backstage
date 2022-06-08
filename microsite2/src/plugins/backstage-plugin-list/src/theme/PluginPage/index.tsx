import React from 'react';
import Layout from '@theme/Layout';
import { PageMetadata } from '@docusaurus/theme-common';
import './style.css';
export type Plugin = {
  iconUrl: string;
  title: string;
  description: string;
  author: string;
  authorUrl: string;
  documentation: string;
  category: string;
  order: number;
  npmPackageName: string;
};
export type Props = {
  plugins: Plugin[];
};
//const Components = require(`${process.cwd()}/core/Components.js`);
// const {
//   Block: { Container },
//   BulletLine,
// } = Components;

import { BulletLine, Block as Container } from '../../../../../core/Components';

const addPluginDocsLink = '/docs/plugins/add-to-marketplace';
const defaultIconUrl = 'img/logo-gradient-on-dark.svg';

const truncate = text =>
  text.length > 170 ? text.substr(0, 170) + '...' : text;

export default function PluginPage({ plugins }: Props): JSX.Element {
  return (
    <Layout>
      <PageMetadata
        title="Plugin Marketplace"
        description="Open source plugins that you can add to your Backstage deployment. Learn how to build a plugin."
      />
      <main className="MainContent">
        <div className="PluginPageLayout">
          <div className="PluginPageHeader">
            <h2>Plugin Marketplace</h2>
            <p>
              Open source plugins that you can add to your Backstage deployment.
              Learn how to build a <a href="/docs/plugins">plugin</a>.
            </p>
            <span>
              <a
                className="PluginAddNewButton ButtonFilled"
                href={addPluginDocsLink}
              >
                <b>Add to Marketplace</b>
              </a>
            </span>
          </div>
          <BulletLine style={{ width: '100% ' }} />
          <div className="PluginPageHeader">
            <h2>Core Features</h2>
          </div>
          <Container wrapped className="PluginGrid">
            {plugins
              .filter(plugin => plugin.category === 'Core Feature')
              .sort((a, b) => a.order - b.order)
              .map(
                ({
                  iconUrl,
                  title,
                  description,
                  author,
                  authorUrl,
                  documentation,
                  category,
                  npmPackageName,
                }) => (
                  <div className="PluginCard" key={npmPackageName}>
                    <div className="PluginCardHeader">
                      <div className="PluginCardImage">
                        <img src={iconUrl || defaultIconUrl} alt={title} />
                      </div>
                      <div className="PluginCardInfo">
                        <h3 className="PluginCardTitle">{title}</h3>
                        <p className="PluginCardAuthor">
                          by <a href={authorUrl}>{author}</a>
                        </p>
                        <span className="PluginCardChipOutlined">
                          {category}
                        </span>
                      </div>
                    </div>
                    <div className="PluginCardBody">
                      <p>{truncate(description)}</p>
                    </div>
                    <div className="PluginCardFooter">
                      <a className="ButtonFilled" href={documentation}>
                        Explore
                      </a>
                    </div>
                  </div>
                ),
              )}
          </Container>
          <div className="PluginPageHeader">
            <h2>All Plugins</h2>
          </div>
          <Container wrapped className="PluginGrid">
            {plugins
              .filter(plugin => plugin.category !== 'Core Feature')
              .map(
                ({
                  iconUrl,
                  title,
                  description,
                  author,
                  authorUrl,
                  documentation,
                  category,
                  npmPackageName,
                }) => (
                  <div className="PluginCard" key={npmPackageName}>
                    <div className="PluginCardHeader">
                      <div className="PluginCardImage">
                        <img src={iconUrl || defaultIconUrl} alt={title} />
                      </div>
                      <div className="PluginCardInfo">
                        <h3 className="PluginCardTitle">{title}</h3>
                        <p className="PluginCardAuthor">
                          by <a href={authorUrl}>{author}</a>
                        </p>
                        <span className="PluginCardChipOutlined">
                          {category}
                        </span>
                      </div>
                    </div>
                    <div className="PluginCardBody">
                      <p>{truncate(description)}</p>
                    </div>
                    <div className="PluginCardFooter">
                      <a className="ButtonFilled" href={documentation}>
                        Explore
                      </a>
                    </div>
                  </div>
                ),
              )}
            <div className="PluginCard" id="add-plugin-card">
              <div className="PluginCardBody">
                <p>
                  Do you have an existing plugin that you want to add to the
                  Marketplace?
                </p>
                <p
                  style={{
                    marginTop: '20px',
                    textAlign: 'center',
                  }}
                >
                  <a className="ButtonFilled" href={addPluginDocsLink}>
                    <b>Add to Marketplace</b>
                  </a>
                </p>
              </div>
              <Container className="PluginCardFooter">
                <p>
                  See what plugins are already
                  <a href="https://github.com/backstage/backstage/issues?q=is%3Aissue+is%3Aopen+label%3Aplugin+sort%3Areactions-%2B1-desc">
                    in progress
                  </a>
                  and 👍. Missing a plugin for your favorite tool? Please
                  <a href="https://github.com/backstage/backstage/issues/new?labels=plugin&template=plugin_template.md&title=%5BPlugin%5D+THE+PLUGIN+NAME">
                    suggest
                  </a>
                  a new one.
                </p>
              </Container>
            </div>
          </Container>
        </div>
      </main>
    </Layout>
  );
}
