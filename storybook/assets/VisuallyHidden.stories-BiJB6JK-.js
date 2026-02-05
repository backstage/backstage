import{p as o,j as e}from"./iframe-M9O-K8SB.js";import{V as a}from"./VisuallyHidden-CNdUZnnh.js";import{F as n}from"./Flex-Bz2InqMs.js";import{T as t}from"./Text-RD33cT1s.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-BRwt6BXn.js";import"./clsx-B-dksMZM.js";import"./useSurface-CJaN3YoD.js";const i=o.meta({title:"Backstage UI/VisuallyHidden",component:a,parameters:{docs:{description:{component:"Visually hides content while keeping it accessible to screen readers. Commonly used for descriptive labels, and other screen-reader-only content."}}}}),s=i.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(t,{as:"p",children:"This text is followed by a paragraph that is visually hidden but accessible to screen readers. Try using a screen reader to hear it, or inspect the DOM to see it's there."}),e.jsx(a,{children:"This content is visually hidden but accessible to screen readers"})]})}),r=i.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(a,{children:e.jsx(t,{as:"h2",children:"Footer links"})}),e.jsx(t,{as:"p",children:e.jsx("a",{href:"#",children:"About us"})}),e.jsx(t,{as:"p",children:e.jsx("a",{href:"#",children:"Jobs"})}),e.jsx(t,{as:"p",children:e.jsx("a",{href:"#",children:"Terms and Conditions"})}),e.jsx(t,{as:"p",variant:"body-small",color:"secondary",children:'(Screen readers hear: "Footer links" followed by the list of links)'})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => (
  <Flex direction="column" gap="4">
    <Text as="p">
      This text is followed by a paragraph that is visually hidden but
      accessible to screen readers. Try using a screen reader to hear it, or
      inspect the DOM to see it's there.
    </Text>
    <VisuallyHidden>
      This content is visually hidden but accessible to screen readers
    </VisuallyHidden>
  </Flex>
);
`,...s.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const ExampleUsage = () => (
  <Flex direction="column" gap="4">
    <VisuallyHidden>
      <Text as="h2">Footer links</Text>
    </VisuallyHidden>
    <Text as="p">
      <a href="#">About us</a>
    </Text>
    <Text as="p">
      <a href="#">Jobs</a>
    </Text>
    <Text as="p">
      <a href="#">Terms and Conditions</a>
    </Text>
    <Text as="p" variant="body-small" color="secondary">
      (Screen readers hear: "Footer links" followed by the list of links)
    </Text>
  </Flex>
);
`,...r.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Text as="p">
        This text is followed by a paragraph that is visually hidden but
        accessible to screen readers. Try using a screen reader to hear it, or
        inspect the DOM to see it's there.
      </Text>
      <VisuallyHidden>
        This content is visually hidden but accessible to screen readers
      </VisuallyHidden>
    </Flex>
})`,...s.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <VisuallyHidden>
        <Text as="h2">Footer links</Text>
      </VisuallyHidden>
      <Text as="p">
        <a href="#">About us</a>
      </Text>
      <Text as="p">
        <a href="#">Jobs</a>
      </Text>
      <Text as="p">
        <a href="#">Terms and Conditions</a>
      </Text>
      <Text as="p" variant="body-small" color="secondary">
        (Screen readers hear: "Footer links" followed by the list of links)
      </Text>
    </Flex>
})`,...r.input.parameters?.docs?.source}}};const y=["Default","ExampleUsage"];export{s as Default,r as ExampleUsage,y as __namedExportsOrder};
