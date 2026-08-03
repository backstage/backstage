import Link from '@docusaurus/Link';
import { SimpleCard } from '@site/src/components/simpleCard/simpleCard';
import type { PluginData } from '@site/src/pluginDirectory/manifest';
import clsx from 'clsx';
import React from 'react';

const defaultIconUrl = '/img/logo-gradient-on-dark.svg';

export const PluginCard = ({
  author,
  authorUrl,
  category,
  description,
  slug,
  iconUrl,
  isNew = false,
  title,
}: PluginData) => (
  <SimpleCard
    header={
      <>
        {isNew && <div className="newRibbon">NEW</div>}

        <img src={iconUrl || defaultIconUrl} alt={title} />

        <h3 className={clsx({ newRibbonPadding: isNew })}>{title}</h3>

        <p className="PluginCardAuthor">
          by <a href={authorUrl}>{author}</a>
        </p>

        <span className="badge badge--secondary fit-content">{category}</span>
      </>
    }
    body={<p>{description}</p>}
    footer={
      <Link
        to={`/plugins/${slug}`}
        className="button button--outline button--primary button--block"
      >
        View details
      </Link>
    }
  />
);
