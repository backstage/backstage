import clsx from 'clsx';
import React, { PropsWithChildren, ReactNode } from 'react';

import bannerColumnStyles from './banner-section-columns.module.scss';

export type IBannerSectionColumnsProps = PropsWithChildren<{
  header?: ReactNode;
  // children: ReactNode | ReactNode[];
}>;

export const BannerSectionColumns = ({
  header,
  children,
}: IBannerSectionColumnsProps) => (
  <>
    {header && (
      <div className="row padding-vert--lg">
        <div className="col">{header}</div>
      </div>
    )}

    {Array.isArray(children) ? (
      <div className="row">
        {children.map((child, index) => (
          <div key={index} className="col padding-bottom--lg">
            {child}
          </div>
        ))}
      </div>
    ) : (
      children
    )}
  </>
);
