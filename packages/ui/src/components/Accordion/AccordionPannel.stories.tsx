import preview from "../../../../../.storybook/preview";
import { Content } from "../../../../core-components/src/layout";
import { Accordion, AccordionPanel, AccordionTrigger } from "./Accordion";

const meta = preview.meta({
  title: "Backstage UI/Accordion",
  component: Accordion,
});

export const NestedAccordion = meta.story({
  render: () => (
    <Accordion>
      <AccordionTrigger title="Outer Panel" />
      <AccordionPanel>
        <Accordion>
          <AccordionTrigger title="Inner Panel" />
          <AccordionPanel>
            <Content />
          </AccordionPanel>
        </Accordion>
      </AccordionPanel>
    </Accordion>
  ),
});

// NOTE:
// Nested Accordions are not fully supported.
// Due to React Aria disclosure behavior, inner Accordions may
// appear expanded when mounted. The Accordion component does
// not currently expose an `onChange` callback for controlled usage.
