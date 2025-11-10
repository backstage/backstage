import{j as r}from"./iframe-Dg7jNfgV.js";import{B as e}from"./ButtonIcon-ean9JqOJ.js";import{T as n}from"./index-BQGsxAyO.js";import{F as c}from"./Flex-CPbcRrPB.js";import"./preload-helper-D9Z9MdNV.js";import"./clsx-B-dksMZM.js";import"./Button-DMfefpCO.js";import"./utils-DlhuadZk.js";import"./Hidden-HB7QdOxe.js";import"./useFocusRing-Qh6jG-2Q.js";import"./usePress-DCHo0S64.js";import"./useStyles-CF8dTXWk.js";import"./Button.module-BHYJStbY.js";const D={title:"Backstage UI/ButtonIcon",component:e,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}},s={render:()=>r.jsx(e,{icon:r.jsx(n,{})})},i={render:()=>r.jsxs(c,{align:"center",gap:"2",children:[r.jsx(e,{icon:r.jsx(n,{}),variant:"primary"}),r.jsx(e,{icon:r.jsx(n,{}),variant:"secondary"}),r.jsx(e,{icon:r.jsx(n,{}),variant:"tertiary"})]})},a={render:()=>r.jsxs(c,{align:"center",gap:"2",children:[r.jsx(e,{icon:r.jsx(n,{}),size:"small"}),r.jsx(e,{icon:r.jsx(n,{}),size:"medium"})]})},o={render:()=>r.jsxs(c,{direction:"row",gap:"2",children:[r.jsx(e,{isDisabled:!0,icon:r.jsx(n,{}),variant:"primary"}),r.jsx(e,{isDisabled:!0,icon:r.jsx(n,{}),variant:"secondary"}),r.jsx(e,{isDisabled:!0,icon:r.jsx(n,{}),variant:"tertiary"})]})},t={args:{variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}},render:m=>r.jsx(e,{...m,icon:r.jsx(n,{})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <ButtonIcon icon={<RiCloudLine />} />
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} variant="primary" />
      <ButtonIcon icon={<RiCloudLine />} variant="secondary" />
      <ButtonIcon icon={<RiCloudLine />} variant="tertiary" />
    </Flex>
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} size="small" />
      <ButtonIcon icon={<RiCloudLine />} size="medium" />
    </Flex>
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Flex direction="row" gap="2">
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="primary" />
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="secondary" />
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="tertiary" />
    </Flex>
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: {
      initial: 'primary',
      sm: 'secondary'
    },
    size: {
      xs: 'small',
      sm: 'medium'
    }
  },
  render: args => <ButtonIcon {...args} icon={<RiCloudLine />} />
}`,...t.parameters?.docs?.source}}};const L=["Default","Variants","Sizes","Disabled","Responsive"];export{s as Default,o as Disabled,t as Responsive,a as Sizes,i as Variants,L as __namedExportsOrder,D as default};
