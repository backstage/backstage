import{bR as e,c7 as o}from"./iframe-DogXi1kP.js";import{V as a}from"./VisuallyHidden-CMhaGwvP.js";import{F as n}from"./Flex-Bi-SKTgz.js";import{T as s}from"./Text-BbRcKCRf.js";import"./preload-helper-PPVm8Dsz.js";const i=o.meta({title:"Backstage UI/VisuallyHidden",component:a,parameters:{docs:{description:{component:"Visually hides content while keeping it accessible to screen readers. Commonly used for descriptive labels, and other screen-reader-only content."}}}}),r=i.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(s,{as:"p",children:"This text is followed by a paragraph that is visually hidden but accessible to screen readers. Try using a screen reader to hear it, or inspect the DOM to see it's there."}),e.jsx(a,{children:"This content is visually hidden but accessible to screen readers"})]})}),t=i.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(a,{children:e.jsx(s,{as:"h2",children:"Footer links"})}),e.jsx(s,{as:"p",children:e.jsx("a",{href:"#",children:"About us"})}),e.jsx(s,{as:"p",children:e.jsx("a",{href:"#",children:"Jobs"})}),e.jsx(s,{as:"p",children:e.jsx("a",{href:"#",children:"Terms and Conditions"})}),e.jsx(s,{as:"p",variant:"body-small",color:"secondary",children:'(Screen readers hear: "Footer links" followed by the list of links)'})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...r.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...t.input.parameters?.docs?.source}}};const u=["Default","ExampleUsage"];export{r as Default,t as ExampleUsage,u as __namedExportsOrder};
