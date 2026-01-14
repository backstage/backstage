'use client';
import { useMediaQuery } from '@backstage/ui/src/hooks/useMediaQuery';

export function UseMediaQueryThemeExample() {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div>
      {isDarkMode ? 'User prefers Dark mode' : 'User prefers Light mode'}
    </div>
  );
}

export function UseMediaQueryResponsiveExample() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div>
      {isMobile && '<MobileLayout />'}
      {isTablet && '<TabletLayout />'}
      {isDesktop && '<DesktopLayout />'}
    </div>
  );
}

export function UseMediaQueryPreferencesExample() {
  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)',
  );

  return (
    <div className={prefersReducedMotion ? 'no-animations' : ''}>Content</div>
  );
}

export function UseMediaQueryOrientationExample() {
  const isPortrait = useMediaQuery('(orientation: portrait)');

  return <div>{isPortrait ? 'Portrait mode' : 'Landscape mode'}</div>;
}
