import{r as p,j as e}from"./iframe-BJLAQiny.js";import{$ as b}from"./Checkbox-DfcFFcBE.js";import{u as h}from"./useStyles-Cq4rdwmL.js";import{c as t}from"./clsx-B-dksMZM.js";import{s as x}from"./index-Y0knUjSL.js";import{F as u}from"./Flex-sw6mSLlp.js";import"./preload-helper-D9Z9MdNV.js";import"./RSPContexts-BaaQd_bd.js";import"./utils-DMIk-kXr.js";import"./Form-CY__xqzq.js";import"./useFocusRing-DLhPmeXV.js";import"./usePress-WXC8WE--.js";import"./useToggleState-Cx5SM3wA.js";import"./useFormReset-CGp7k0CT.js";import"./useControlledState-XES5qZD6.js";import"./VisuallyHidden-Bl2yNMPs.js";const k={classNames:{root:"bui-Checkbox",indicator:"bui-CheckboxIndicator"},dataAttributes:{selected:[!0,!1]}},i={"bui-Checkbox":"_bui-Checkbox_1t2md_20","bui-CheckboxIndicator":"_bui-CheckboxIndicator_1t2md_38"},s=p.forwardRef((a,n)=>{const{classNames:o}=h(k),{className:d,children:l,...m}=a;return e.jsxs(b,{ref:n,className:t(o.root,i[o.root],d),...m,children:[e.jsx("div",{className:t(o.indicator,i[o.indicator]),children:e.jsx(x,{size:12})}),l]})});s.__docgenInfo={description:"@public",methods:[],displayName:"Checkbox",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["RACheckboxProps"]};const w={title:"Backstage UI/Checkbox",component:s},r={args:{children:"Accept terms and conditions"}},c={...r,render:()=>e.jsxs(u,{direction:"column",gap:"2",children:[e.jsx(s,{children:"Unchecked"}),e.jsx(s,{isSelected:!0,children:"Checked"}),e.jsx(s,{isDisabled:!0,children:"Disabled"}),e.jsx(s,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Accept terms and conditions'
  }
}`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  ...Default,
  render: () => <Flex direction="column" gap="2">
      <Checkbox>Unchecked</Checkbox>
      <Checkbox isSelected>Checked</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isSelected isDisabled>
        Checked & Disabled
      </Checkbox>
    </Flex>
}`,...c.parameters?.docs?.source}}};const V=["Default","AllVariants"];export{c as AllVariants,r as Default,V as __namedExportsOrder,w as default};
