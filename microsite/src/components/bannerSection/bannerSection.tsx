import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import bannerStyles from './bannerSection.module.scss';

export type IBannerSectionProps = PropsWithChildren<{
  className?: string;
  greyBackground?: boolean;
  diagonalBorder?: boolean;
  diagonalBottomBorder?: boolean;
  greenGradientBackground?: boolean;
  greenBottomGradientBackground?: boolean;
  greenCallToActionGradientBackground?: boolean;
}>;

export const BannerSection = ({
  children,
  className,
  greyBackground = false,
  diagonalBorder = false,
  diagonalBottomBorder = false,
  greenGradientBackground = false,
  greenBottomGradientBackground = false,
  greenCallToActionGradientBackground = false,
}: IBannerSectionProps) => (
  <section
    className={clsx(bannerStyles.bannerSection, className, {
      greyBackground,
      diagonalBorder,
      diagonalBottomBorder,
      greenGradientBackground,
      greenBottomGradientBackground,
      greenCallToActionGradientBackground,
    })}
  >
    <div className="container padding-horiz--lg padding-vert--xl">
      {children}
    </div>
  </section>
);
