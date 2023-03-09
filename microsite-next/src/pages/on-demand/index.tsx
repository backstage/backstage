import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';

import { IOnDemandData, OnDemandCard } from './_onDemandCard';
import pluginsStyles from './onDemand.module.scss';
import { truncateDescription } from '@site/src/util/truncateDescription';
import Link from '@docusaurus/Link';

//#region Plugin data import
const onDemandContext = require.context(
  '../../../data/on-demand',
  false,
  /\.ya?ml/,
);

const onDemandData = onDemandContext.keys().reduce(
  (acum, id) => {
    const pluginData: IOnDemandData = onDemandContext(id).default;

    acum[
      pluginData.category === 'Upcoming' ? 'upcomingEvents' : 'onDemandEvents'
    ].push(truncateDescription(pluginData));

    return acum;
  },
  {
    upcomingEvents: [] as IOnDemandData[],
    onDemandEvents: [] as IOnDemandData[],
  },
);
//#endregion

const Plugins = () => (
  <Layout>
    <div
      className={clsx('container', 'padding--lg', pluginsStyles.onDemandPage)}
    >
      <div className="marketplaceBanner">
        <div className="marketplaceContent">
          <h2>Community sessions</h2>

          <p>
            Upcoming events and recorded sessions about updates, demos and
            discussions.
          </p>
        </div>

        <Link
          to="/docs/overview/support"
          className="button button--outline button--primary"
        >
          Add an event or recording
        </Link>
      </div>

      <div className="bulletLine margin-bottom--lg"></div>

      <h2>Upcoming live events</h2>

      <div className="cardsContainer margin-bottom--lg">
        {onDemandData.upcomingEvents.map(eventData => (
          <OnDemandCard key={eventData.title} {...eventData}></OnDemandCard>
        ))}
      </div>

      <h2>Community on demand</h2>

      <div className="cardsContainer margin-bottom--lg">
        {onDemandData.onDemandEvents.map(eventData => (
          <OnDemandCard key={eventData.title} {...eventData}></OnDemandCard>
        ))}
      </div>
    </div>
  </Layout>
);

export default Plugins;
