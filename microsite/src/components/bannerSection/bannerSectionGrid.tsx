import clsx from 'clsx';
import React, { PropsWithChildren, ReactNode } from 'react';

import bannerGridStyles from './bannerSectionGrid.module.scss';

export type IBannerSectionColumnsProps = PropsWithChildren<{
  header?: ReactNode;
  className?: string;
}>;

export const BannerSectionGrid = ({
  header,
  children,
  className,
}: IBannerSectionColumnsProps) => {
  return (
    <div className={clsx(bannerGridStyles.sectionGridContainer, className)}>
      {header && <div className="gridHeader">{header}</div>}

      <div className={bannerGridStyles.gridContainer}>
        {Array.isArray(children)
          ? children.map((child, index) =>
              React.cloneElement(child, {
                key: index,
                className: clsx(child.props.className),
              }),
            )
          : children}
      </div>
    </div>
  );
};
