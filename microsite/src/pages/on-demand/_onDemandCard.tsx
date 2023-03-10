import Link from '@docusaurus/Link';
import { SimpleCard } from '@site/src/components/simpleCard/simpleCard';
import React from 'react';

export interface IOnDemandData {
  title: string;
  category: string;
  description: string;
  date: string;
  youtubeUrl: string;
  youtubeImgUrl: string;
  rsvpUrl: string;
  eventUrl: string;
}

export const OnDemandCard = ({
  title,
  category,
  description,
  date,
  youtubeUrl,
  youtubeImgUrl,
  rsvpUrl,
  eventUrl,
}: IOnDemandData) => (
  <SimpleCard
    header={
      <>
        <h3>{title}</h3>

        <p className="PluginCardAuthor">on {date}</p>

        <span className="badge badge--primary">{category}</span>

        <img src={youtubeImgUrl} alt={title} />
      </>
    }
    body={<p>{description}</p>}
    footer={
      category.toLowerCase() === 'upcoming' ? (
        <>
          <Link
            to={eventUrl}
            className="button button--outline button--sm button--primary"
          >
            Event page
          </Link>

          <Link
            to={rsvpUrl}
            className="button button--outline button--sm button--primary"
          >
            Remind me
          </Link>
        </>
      ) : (
        <Link
          to={youtubeUrl}
          className="button button--outline button--primary button--block"
        >
          Watch on YouTube
        </Link>
      )
    }
  />
);
