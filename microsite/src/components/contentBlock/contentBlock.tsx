import Link from '@docusaurus/Link';
import clsx from 'clsx';
import React, { PropsWithChildren, ReactNode } from 'react';

import contentBlockStyles from './contentBlock.module.scss';

export interface ContentBlockActionButtonProps {
  label: string;
  link: string;
}

export type IContentBlockProps = PropsWithChildren<{
  title?: ReactNode;
  className?: string;
  topImgSrc?: string;
  hasBulletLine?: boolean;
  actionButtons?: ContentBlockActionButtonProps[];
}>;

export const ContentBlock = ({
  children,
  title,
  className,
  topImgSrc,
  hasBulletLine,
  actionButtons,
}: IContentBlockProps) => (
  <div className={clsx(className, contentBlockStyles.contentBlock)}>
    {topImgSrc && <img src={topImgSrc} alt={topImgSrc} />}

    <div className="contentBlockTitle">
      {hasBulletLine && <div className="bulletLine" />}

      {title && React.isValidElement(title) ? title : <h2>{title}</h2>}
    </div>

    {children && React.isValidElement(children) ? children : <p>{children}</p>}

    {actionButtons && (
      <div className="actionButtons">
        {actionButtons.map(({ link, label }, index) => (
          <Link
            key={index}
            className="button button--primary button--lg"
            to={link}
          >
            {label}
          </Link>
        ))}
      </div>
    )}
  </div>
);
