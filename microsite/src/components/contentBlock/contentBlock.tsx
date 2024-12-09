import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { isValidElement, PropsWithChildren, ReactNode } from 'react';

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

      {title && isValidElement(title) ? title : <h2>{title}</h2>}
    </div>

    {children && isValidElement(children) ? children : <p>{children}</p>}

    {actionButtons && (
      <div
        className="actionButtons"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '15px',
        }}
      >
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
