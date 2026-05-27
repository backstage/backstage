export const useIsTruncatedExampleSnippet = `import { useIsTruncated } from '@backstage/ui';
import { TooltipTrigger, Tooltip } from '@backstage/ui';

function TruncatedLabel({ text }: { text: string }) {
  const { ref, truncated, checkTruncation } = useIsTruncated();

  return (
    <TooltipTrigger isDisabled={!truncated}>
      <span
        ref={ref}
        onMouseEnter={checkTruncation}
        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}
      >
        {text}
      </span>
      <Tooltip>{text}</Tooltip>
    </TooltipTrigger>
  );
}`;
