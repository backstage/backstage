import React from 'react';

interface BannerSectionProps {
  children: React.ReactNode;
  diagonalBorder?: boolean;
  diagonalBottomBorder?: boolean;
  greyBackground?: boolean;
  greenGradientBackground?: boolean;
  greenBottomGradientBackground?: boolean;
  greenCallToActionGradientBackground?: boolean;
  className?: string;
}

export const BannerSection: React.FC<BannerSectionProps> = ({
  children,
  diagonalBorder,
  diagonalBottomBorder,
  greyBackground,
  greenGradientBackground,
  greenBottomGradientBackground,
  greenCallToActionGradientBackground,
  className = '',
}) => {
  const classes = [
    'banner-section',
    diagonalBorder && 'diagonal-border',
    diagonalBottomBorder && 'diagonal-bottom-border',
    greyBackground && 'grey-background',
    greenGradientBackground && 'green-gradient-background',
    greenBottomGradientBackground && 'green-bottom-gradient-background',
    greenCallToActionGradientBackground && 'green-cta-gradient-background',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <section className={classes}>{children}</section>;
};

export const BannerSectionGrid: React.FC<{
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}> = ({ children, header, className = '' }) => {
  return (
    <div className={`banner-section-grid ${className}`}>
      {header && <div className="banner-header">{header}</div>}
      {children}
    </div>
  );
};
