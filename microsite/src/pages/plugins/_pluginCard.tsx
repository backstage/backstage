import Link from '@docusaurus/Link';
import { SimpleCard } from '@site/src/components/simpleCard/simpleCard';
import React from 'react';

export interface IPluginData {
  author: string;
  authorUrl: string;
  category: string;
  description: string;
  documentation: string;
  iconUrl: string;
  title: string;
  order?: number;
}

const defaultIconUrl = 'img/logo-gradient-on-dark.svg';

export const PluginCard = ({
  author,
  authorUrl,
  category,
  description,
  documentation,
  iconUrl,
  title,
}: IPluginData) => (
  <SimpleCard
    header={
      <>
        <img src={iconUrl || defaultIconUrl} alt={title} />

        <h3>{title}</h3>

        <p className="PluginCardAuthor">
          by <a href={authorUrl}>{author}</a>
        </p>

        <span className="badge badge--secondary fit-content">
          {category}
        </span>
      </>
    }
    body={<p>{description}</p>}
    footer={
      <Link
        to={documentation}
        className="button button--outline button--primary button--block"
      >
        Explore
      </Link>
    }
  />
);
