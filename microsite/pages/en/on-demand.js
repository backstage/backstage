/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const fs = require('fs');
const yaml = require('js-yaml');
const React = require('react');
const Components = require(`${process.cwd()}/core/Components.js`);
const {
  Block: { Container },
  BulletLine,
} = Components;

const ondemandDirectory = require('path').join(process.cwd(), 'data/on-demand');
const ondemandMetadata = fs
  .readdirSync(ondemandDirectory)
  .sort()
  .reverse()
  .map(file => yaml.load(fs.readFileSync(`./data/on-demand/${file}`, 'utf8')));
const truncate = text =>
  text.length > 170 ? text.substr(0, 170) + '...' : text;

const addVideoDocsLink = '/docs/overview/support';
const defaultIconUrl = 'img/logo-gradient-on-dark.svg';

const Ondemand = () => (
  <main className="MainContent">
    <div className="VideoPageLayout">
      <div className="VideoPageHeader">
        <h2>Upcoming live events</h2>
        <p>Upcoming Backstage events</p>
        <span>
          <a className="VideoAddNewButton ButtonFilled" href={addVideoDocsLink}>
            <b>Add an event or recording</b>
          </a>
        </span>
      </div>
      <Container wrapped className="VideoGrid">
        {ondemandMetadata
          .filter(video => video.category === 'Upcoming')
          .map(
            ({
              title,
              description,
              category,
              date,
              youtubeUrl,
              youtubeImgUrl,
              rsvpUrl,
              eventUrl,
            }) => (
              <div className="VideoCard">
                <div className="VideoCardHeader">
                  <div className="VideoCardInfo">
                    <h3 className="VideoCardTitle">{title}</h3>
                    <p className="VideoCardDate">on {date}</p>

                    <span className="VideoCardChipOutlined">{category}</span>
                    <p>
                      <br />
                      <img src={youtubeImgUrl} alt={title} />
                    </p>
                  </div>
                </div>
                <div className="VideoCardBody">
                  <p>{truncate(description)}</p>
                </div>
                <div className="VideoCardFooter">
                  <a className="VideoButtonFilled" href={eventUrl}>
                    Event page
                  </a>
                  <a className="VideoButtonFilled" href={rsvpUrl}>
                    Remind me
                  </a>
                </div>
              </div>
            ),
          )}
      </Container>
      <BulletLine style={{ width: '100%' }} />
      <div className="VideoPageHeader">
        <h2>Community on demand</h2>
      </div>
      <Container wrapped className="VideoGrid">
        {ondemandMetadata
          .filter(video => video.category !== 'Upcoming')
          .map(
            ({
              title,
              description,
              category,
              date,
              youtubeUrl,
              youtubeImgUrl,
            }) => (
              <div className="VideoCard">
                <div className="VideoCardHeader">
                  <div className="VideoCardInfo">
                    <h3 className="VideoCardTitle">{title}</h3>
                    <p className="VideoCardDate">on {date}</p>

                    <span className="VideoCardChipOutlined">{category}</span>
                    <p>
                      <br />
                      <img src={youtubeImgUrl} alt={title} />
                    </p>
                  </div>
                </div>
                <div className="VideoCardBody">
                  <p>{truncate(description)}</p>
                </div>
                <div className="VideoCardFooter">
                  <a className="VideoButtonFilled" href={youtubeUrl}>
                    Watch on YouTube
                  </a>
                </div>
              </div>
            ),
          )}
        <div className="VideoCard" id="add-video-card">
          <div className="VideoCardBody">
            <p>Do you have a recording of a meetup to include on this page?</p>
            <p
              style={{
                marginTop: '20px',
                textAlign: 'center',
              }}
            >
              <a className="VideoButtonFilled" href={addVideoDocsLink}>
                <b>Add to the On-demand page</b>
              </a>
            </p>
          </div>
          <Container className="VideoCardFooter">
            <p>
              Help us create a go-to place for hours of Backstage related
              content.
            </p>
          </Container>
        </div>
      </Container>
    </div>
  </main>
);

module.exports = Ondemand;
