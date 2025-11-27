import{j as e}from"./iframe-B6vHPHUS.js";import{u as p}from"./useStyles-C-y3xpyB.js";import{c as h}from"./clsx-B-dksMZM.js";import{F as o}from"./Flex-CUF93du8.js";import{T as s}from"./Text-B-LjbfPX.js";import"./preload-helper-D9Z9MdNV.js";const u={classNames:{root:"bui-VisuallyHidden"}},m={"bui-VisuallyHidden":"_bui-VisuallyHidden_115z3_20"},a=i=>{const{classNames:t,cleanedProps:l}=p(u,i),{className:d,...c}=l;return e.jsx("div",{className:h(t.root,m[t.root],d),...c})};a.__docgenInfo={description:`Visually hides content while keeping it accessible to screen readers.
Useful for descriptive labels and other screen-reader-only content.

Note: This component is for content that should ALWAYS remain visually hidden.
For skip links that become visible on focus, use a different approach.

@public`,methods:[],displayName:"VisuallyHidden",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["ComponentProps"]};const j={title:"Backstage UI/VisuallyHidden",component:a,parameters:{docs:{description:{component:"Visually hides content while keeping it accessible to screen readers. Commonly used for descriptive labels, and other screen-reader-only content."}}}},r={render:()=>e.jsxs(o,{direction:"column",gap:"4",children:[e.jsx(s,{as:"p",children:"This text is followed by a paragraph that is visually hidden but accessible to screen readers. Try using a screen reader to hear it, or inspect the DOM to see it's there."}),e.jsx(a,{children:"This content is visually hidden but accessible to screen readers"})]})},n={render:()=>e.jsxs(o,{direction:"column",gap:"4",children:[e.jsx(a,{children:e.jsx(s,{as:"h2",children:"Footer links"})}),e.jsx(s,{as:"p",children:e.jsx("a",{href:"#",children:"About us"})}),e.jsx(s,{as:"p",children:e.jsx("a",{href:"#",children:"Jobs"})}),e.jsx(s,{as:"p",children:e.jsx("a",{href:"#",children:"Terms and Conditions"})}),e.jsx(s,{as:"p",variant:"body-small",color:"secondary",children:'(Screen readers hear: "Footer links" followed by the list of links)'})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};const V=["Default","ExampleUsage"];export{r as Default,n as ExampleUsage,V as __namedExportsOrder,j as default};
