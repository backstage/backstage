export const useStylesUsageSnippet = `import { useStyles } from '@backstage/ui';
import type {
  ComponentDefinition,
  SpaceProps,
  UtilityProps,
} from '@backstage/ui';

// Define your component's styling configuration
const buttonDefinition: ComponentDefinition = {
  classNames: {
    root: 'bui-button',
    icon: 'bui-button-icon',
  },
  dataAttributes: {
    variant: ['primary', 'secondary', 'ghost'] as const,
    size: ['small', 'medium', 'large'] as const,
    'is-disabled': [true, false] as const,
  },
  utilityProps: ['gap', 'mb', 'mt', 'ml', 'mr'],
} as const satisfies ComponentDefinition;

// type the component props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  gap?: UtilityProps['gap'];
  mb?: SpaceProps['mb'];
  mt?: SpaceProps['mt'];
  ml?: SpaceProps['ml'];
  mr?: SpaceProps['mr'];
  icon?: React.ReactElement;
  children?: React.ReactNode;
}

// Use the useStyles hook in your component
export function Button({
  variant = 'primary',
  size = 'medium',
  isDisabled,
  ...props
}: Readonly<ButtonProps>) {
  const { classNames, dataAttributes, utilityClasses, cleanedProps } =
    useStyles(buttonDefinition, {
      variant,
      size,
      'is-disabled': isDisabled,
      ...props,
    });

  return (
    <button
      className={\`\${classNames.root} \${utilityClasses}\`}
      {...dataAttributes}
      {...cleanedProps}
    >
      {props.icon && <span className={classNames.icon}>{props.icon}</span>}
      {props.children}
    </button>
  );
}`;

export const useStylesDefsSnippet = `const componentDefinition = {
  // CSS class names for component parts
  classNames: {
    root: 'bui-button',
    icon: 'bui-button-icon',
  },

  // Props that become data attributes for CSS targeting
  // data-attribute must be kebab-case to respect HTML standards
  // And casing matters here, lowercase only:
  // 'variant' not 'Variant', 'is-disabled' not 'isDisabled'..
  dataAttributes: {
    variant: ['primary', 'secondary'] as const,
    size: ['small', 'large'] as const,
    'is-disabled': [true, false] as const,
  },

  // Props that become utility classes (spacing, layout, etc.)
  utilityProps: ['m', 'mb', 'mt', 'ml', 'mr'],
};`;

export const useStylesAttributesSnippet = `/* Component CSS can use data attributes for variants */
.bui-button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}

/* Variant styles */
.bui-button[data-variant="primary"] {
  background: blue;
  color: white;
}

.bui-button[data-variant="secondary"] {
  background: gray;
  color: black;
}

/* State styles */
.bui-button[data-is-disabled="true"] {
  opacity: 0.5;
  pointer-events: none;
}`;
