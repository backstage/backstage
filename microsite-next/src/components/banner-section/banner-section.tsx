import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import bannerStyles from './banner-section.module.scss';

export type IBannerSectionProps = PropsWithChildren<{
  greyBackground?: boolean;
  greenGradientBackground?: boolean;
  greenBottomGradientBackground?: boolean;
}>;

export const BannerSection = ({
  children,
  greyBackground = false,
  greenGradientBackground = false,
  greenBottomGradientBackground = false,
}: IBannerSectionProps) => (
  <section
    className={clsx(bannerStyles.bannerSection, {
      greyBackground,
      greenGradientBackground,
      greenBottomGradientBackground,
    })}
  >
    <div className="container">{children}</div>
  </section>
);
