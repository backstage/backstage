import{r as p,j as e}from"./iframe-BpNetfkk.js";import{$ as h}from"./Checkbox-DV3gwazQ.js";import{u as x}from"./useStyles-BttWgO7T.js";import{c as t}from"./clsx-B-dksMZM.js";import{s as b}from"./index-sU5OPU0A.js";import{F as u}from"./Flex-D5x7W4ym.js";import"./preload-helper-D9Z9MdNV.js";import"./RSPContexts-__62g8ge.js";import"./utils-rpcJFcam.js";import"./Form-FUYRYxpg.js";import"./useFocusRing-DM3aheLR.js";import"./usePress-BOhlT-jr.js";import"./useToggleState-dTLYZbmv.js";import"./useFormReset-Cs6m0Qle.js";import"./useControlledState-Cbz270cx.js";import"./VisuallyHidden-C3su4P0r.js";const i={"bui-Checkbox":"_bui-Checkbox_1t2md_20","bui-CheckboxIndicator":"_bui-CheckboxIndicator_1t2md_38"},r=p.forwardRef((a,d)=>{const{classNames:o}=x("Checkbox"),{className:n,children:l,...m}=a;return e.jsxs(h,{ref:d,className:t(o.root,i[o.root],n),...m,children:[e.jsx("div",{className:t(o.indicator,i[o.indicator]),children:e.jsx(b,{size:12})}),l]})});r.__docgenInfo={description:"@public",methods:[],displayName:"Checkbox",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}},composes:["RACheckboxProps"]};const U={title:"Backstage UI/Checkbox",component:r},s={args:{children:"Accept terms and conditions"}},c={...s,render:()=>e.jsxs(u,{direction:"column",gap:"2",children:[e.jsx(r,{children:"Unchecked"}),e.jsx(r,{isSelected:!0,children:"Checked"}),e.jsx(r,{isDisabled:!0,children:"Disabled"}),e.jsx(r,{isSelected:!0,isDisabled:!0,children:"Checked & Disabled"})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
