import { type PropDef } from '@/utils/propDefs';

const Breakpoint = ['"initial"', '"xs"', '"sm"', '"md"', '"lg"', '"xl"'];

export const useBreakpointReturnDefs: Record<string, PropDef> = {
  breakpoint: {
    type: 'enum',
    values: Breakpoint,
    description: 'The current active breakpoint based on screen width',
  },
  up: {
    type: 'enum',
    values: [`(breakpoint: ${Breakpoint.join(' | ')}) => boolean`],
    description:
      'Function that takes a breakpoint and returns true if the screen width is at or above that breakpoint',
  },
  down: {
    type: 'enum',
    values: [`(breakpoint: ${Breakpoint.join(' | ')}) => boolean`],
    description:
      'Function that takes a breakpoint and returns true if the screen width is at or below that breakpoint',
  },
};

export const useBreakpointExampleSnippet = `import { useBreakpoint } from '@backstage/ui';

function ResponsiveComponent() {
  const { breakpoint, up, down } = useBreakpoint();

  return (
    <div>
      <p>Current Breakpoint: {breakpoint}</p>
      {up('md') && <p>The viewport is medium or larger.</p>}
      {down('sm') && <p>The viewport is small or smaller.</p>}
    </div>
  );
}`;
