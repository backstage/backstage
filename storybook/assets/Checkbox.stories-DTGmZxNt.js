import{r as p,j as e}from"./iframe-DXt6I_1q.js";import{$ as b}from"./Checkbox-BdhkdpMO.js";import{u as h}from"./useStyles-CKDOjn9p.js";import{c as t}from"./clsx-B-dksMZM.js";import{s as x}from"./index-lNkMn2dW.js";import{F as u}from"./Flex-DLAvf2oa.js";import"./preload-helper-D9Z9MdNV.js";import"./RSPContexts-8_cBbO_q.js";import"./utils-LcmEw3G_.js";import"./Form-CNN8kECL.js";import"./useFocusRing-Yf5GNPk5.js";import"./usePress-DQRChKQT.js";import"./useToggleState-Bf-e-UK-.js";import"./useFormReset-BBg88K2L.js";import"./useControlledState-BY6XzekM.js";import"./VisuallyHidden-CGxqwenU.js";const k={classNames:{root:"bui-Checkbox",indicator:"bui-CheckboxIndicator"},dataAttributes:{selected:[!0,!1]}},i={"bui-Checkbox":"_bui-Checkbox_1t2md_20","bui-CheckboxIndicator":"_bui-CheckboxIndicator_1t2md_38"},s=p.forwardRef((a,n)=>{const{classNames:o}=h(k),{className:d,children:l,...m}=a;return e.jsxs(b,{ref:n,className:t(o.root,i[o.root],d),...m,children:[e.jsx("div",{className:t(o.indicator,i[o.indicator]),children:e.jsx(x,{size:12})}),l]})});s.__docgenInfo={description:"@public",methods:[],displayName:"Checkbox",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["RACheckboxProps"]};const w={title:"Backstage UI/Checkbox",component:s},r={args:{children:"Accept terms and conditions"}},c={...r,render:()=>e.jsxs(u,{direction:"column",gap:"2",children:[e.jsx(s,{children:"Unchecked"}),e.jsx(s,{isSelected:!0,children:"Checked"}),e.jsx(s,{isDisabled:!0,children:"Disabled"}),e.jsx(s,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
