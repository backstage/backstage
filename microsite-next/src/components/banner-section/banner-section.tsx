import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import bannerStyles from './banner-section.module.scss';

export type IBannerSectionProps = PropsWithChildren<{
  greyBackground?: boolean;
  greenGradientBackground?: boolean;
  greenBottomGradientBackground?: boolean;
  greenCallToActionGradientBackground?: boolean;
}>;

export const BannerSection = ({
  children,
  greyBackground = false,
  greenGradientBackground = false,
  greenBottomGradientBackground = false,
  greenCallToActionGradientBackground = false,
}: IBannerSectionProps) => (
  <section
    className={clsx(bannerStyles.bannerSection, {
      greyBackground,
      greenGradientBackground,
      greenBottomGradientBackground,
      greenCallToActionGradientBackground,
    })}
  >
    <div className="container padding-vert--lg">{children}</div>
  </section>
);
