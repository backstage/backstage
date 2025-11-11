import{r as p,j as e}from"./iframe-D1GFiJZo.js";import{$ as h}from"./Checkbox-ZZ5kKYCs.js";import{u as x}from"./useStyles-B11jByn2.js";import{c as t}from"./clsx-B-dksMZM.js";import{s as b}from"./index-AM_pMIe5.js";import{F as u}from"./Flex-BtP_5tP5.js";import"./preload-helper-D9Z9MdNV.js";import"./RSPContexts-DxYjEM2z.js";import"./utils-Ca8TvNj0.js";import"./Form-Bg6_PKsV.js";import"./useFocusRing-D3IFXkEE.js";import"./usePress-B5nQIucE.js";import"./useToggleState-Cb2I-Qk5.js";import"./useFormReset-Clc3IhnG.js";import"./useControlledState-BPTILyls.js";import"./VisuallyHidden-DluLs1vl.js";const i={"bui-Checkbox":"_bui-Checkbox_1t2md_20","bui-CheckboxIndicator":"_bui-CheckboxIndicator_1t2md_38"},r=p.forwardRef((a,d)=>{const{classNames:o}=x("Checkbox"),{className:n,children:l,...m}=a;return e.jsxs(h,{ref:d,className:t(o.root,i[o.root],n),...m,children:[e.jsx("div",{className:t(o.indicator,i[o.indicator]),children:e.jsx(b,{size:12})}),l]})});r.__docgenInfo={description:"@public",methods:[],displayName:"Checkbox",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["RACheckboxProps"]};const U={title:"Backstage UI/Checkbox",component:r},s={args:{children:"Accept terms and conditions"}},c={...s,render:()=>e.jsxs(u,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Accept terms and conditions'
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  ...Default,
  render: () => <Flex direction="column" gap="2">
      <Checkbox>Unchecked</Checkbox>
      <Checkbox isSelected>Checked</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isSelected isDisabled>
        Checked & Disabled
      </Checkbox>
    </Flex>
}`,...c.parameters?.docs?.source}}};const w=["Default","AllVariants"];export{c as AllVariants,s as Default,w as __namedExportsOrder,U as default};
