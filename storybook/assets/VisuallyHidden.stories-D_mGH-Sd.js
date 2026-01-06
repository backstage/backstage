import{j as e,a3 as u}from"./iframe-DgkzaRcz.js";import{u as h}from"./useStyles-CbKXL5Hp.js";import{c as m}from"./clsx-B-dksMZM.js";import{F as i}from"./Flex-B8qpB4By.js";import{T as s}from"./Text-DJpFgIDa.js";import"./preload-helper-PPVm8Dsz.js";const x={classNames:{root:"bui-VisuallyHidden"}},y={"bui-VisuallyHidden":"_bui-VisuallyHidden_115z3_20"},t=l=>{const{classNames:a,cleanedProps:c}=h(x,l),{className:d,...p}=c;return e.jsx("div",{className:m(a.root,y[a.root],d),...p})};t.__docgenInfo={description:`Visually hides content while keeping it accessible to screen readers.
Useful for descriptive labels and other screen-reader-only content.

Note: This component is for content that should ALWAYS remain visually hidden.
For skip links that become visible on focus, use a different approach.

@public`,methods:[],displayName:"VisuallyHidden",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["ComponentProps"]};const o=u.meta({title:"Backstage UI/VisuallyHidden",component:t,parameters:{docs:{description:{component:"Visually hides content while keeping it accessible to screen readers. Commonly used for descriptive labels, and other screen-reader-only content."}}}}),r=o.story({render:()=>e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(s,{as:"p",children:"This text is followed by a paragraph that is visually hidden but accessible to screen readers. Try using a screen reader to hear it, or inspect the DOM to see it's there."}),e.jsx(t,{children:"This content is visually hidden but accessible to screen readers"})]})}),n=o.story({render:()=>e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(t,{children:e.jsx(s,{as:"h2",children:"Footer links"})}),e.jsx(s,{as:"p",children:e.jsx("a",{href:"#",children:"About us"})}),e.jsx(s,{as:"p",children:e.jsx("a",{href:"#",children:"Jobs"})}),e.jsx(s,{as:"p",children:e.jsx("a",{href:"#",children:"Terms and Conditions"})}),e.jsx(s,{as:"p",variant:"body-small",color:"secondary",children:'(Screen readers hear: "Footer links" followed by the list of links)'})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...r.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};const v=["Default","ExampleUsage"];export{r as Default,n as ExampleUsage,v as __namedExportsOrder};
