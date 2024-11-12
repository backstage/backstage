import { createElement } from 'react';
import { sprinkles, Sprinkles } from '../../theme/sprinkles.css';
import { base } from './box.css';

type HTMLProperties = Omit<
  React.AllHTMLAttributes<HTMLElement>,
  keyof Sprinkles
>;
type BoxProps = Sprinkles & HTMLProperties;

// Helper function to create box components
const createBox = (element: keyof JSX.IntrinsicElements) => {
  return ({ className, style, ...props }: BoxProps) => {
    const sprinklesProps: Record<string, unknown> = {};
    const nativeProps: Record<string, unknown> = {};

    // Split props between sprinkles and native HTML props
    Object.entries(props).forEach(([key, value]) => {
      if (value === undefined) return;

      if (sprinkles.properties.has(key as keyof Sprinkles)) {
        sprinklesProps[key] = value;
      } else {
        nativeProps[key] = value;
      }
    });

    const sprinklesClassName = sprinkles(sprinklesProps);

    return createElement(element, {
      className: [base, sprinklesClassName, className]
        .filter(Boolean)
        .join(' '),
      style,
      ...nativeProps,
    });
  };
};

// Export individual box components
export const box = {
  div: createBox('div'),
  span: createBox('span'),
  section: createBox('section'),
  article: createBox('article'),
  main: createBox('main'),
  aside: createBox('aside'),
  header: createBox('header'),
  footer: createBox('footer'),
  nav: createBox('nav'),
};
