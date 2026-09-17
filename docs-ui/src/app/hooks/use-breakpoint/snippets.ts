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
