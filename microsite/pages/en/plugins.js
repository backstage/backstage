/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const fs = require('fs')
const yaml = require('js-yaml');
const React = require('react');
const Components = require(`${process.cwd()}/core/Components.js`);
const { Block: { Container }, BulletLine } = Components;

const pluginsDirectory = require('path').join(process.cwd(), 'data/plugins');
const pluginMetadata = fs.readdirSync(pluginsDirectory)
  .map((file) => yaml.safeLoad(fs.readFileSync(`./data/plugins/${file}`, 'utf8')));
const truncate = (text) => (text.length > 170 ? text.substr(0, 170) + '...' : text);

const addPluginDocsLink = 'https://github.com/spotify/backstage/blob/master/microsite/README.md#adding-a-plugin-to-the-plugins-page';
const defaultIconPath = 'img/logo-gradient-on-dark.svg';

const Plugins = () => (
    <main className="MainContent">
      <div className="PluginPageLayout">
        <div className="PluginPageHeader">
          <h2>Plugins</h2>
          <span>
            <a className="PluginAddNewButton" href={addPluginDocsLink}>
              <b>Add Plugin</b>
            </a>
          </span>
        </div>
        <BulletLine style={{ width: '100% '}}/>
          <Container wrapped className="grid">
            {pluginMetadata.map(({ iconPath, title, description, author, documentation }) => (
              <div className="PluginCard">
                <div className="PluginCardHeader">
                  <img src={iconPath || defaultIconPath} alt={title} />
                  <h2 className="PluginCardTitle">{title}</h2>
                  <p>by {author}</p>
                </div>
                <div className="PluginCardBody">
                  <p>{truncate(description)}</p>
                </div>
                <Container className="PluginCardFooter">
                  <span>
                    <a className="PluginCardLink" href={documentation}>docs</a>
                  </span>
                </Container>
              </div>
            ))}
          </Container>
      </div>
    </main>
  );

module.exports = Plugins;
