import Link from '@docusaurus/Link';
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
  <div className="card">
    <div className="card__header">
      <img src={iconUrl || defaultIconUrl} alt={title} />

      <h3>{title}</h3>

      <p className="PluginCardAuthor">
        by <a href={authorUrl}>{author}</a>
      </p>

      <span className="button button--sm button--outline button--primary">
        {category}
      </span>
    </div>

    <div className="card__body">
      <p>{description}</p>
    </div>

    <div className="card__footer">
      <Link
        to={documentation}
        className="button button--outline button--primary button--block"
      >
        Explore
      </Link>
    </div>
  </div>
);
