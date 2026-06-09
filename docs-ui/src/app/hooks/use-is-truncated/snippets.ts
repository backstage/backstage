export const useIsTruncatedExampleSnippet = `import { useIsTruncated } from '@backstage/ui';
import { TooltipTrigger, Tooltip } from '@backstage/ui';

function TruncatedLabel({ text }: { text: string }) {
  const { ref, truncated } = useIsTruncated();

  return (
    <TooltipTrigger isDisabled={!truncated}>
      <span
        ref={ref}
        style={{ display: 'block' overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}
      >
        {text}
      </span>
      <Tooltip>{text}</Tooltip>
    </TooltipTrigger>
  );
}`;
