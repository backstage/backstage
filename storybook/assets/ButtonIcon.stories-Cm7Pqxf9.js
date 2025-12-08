import{j as n,r as g}from"./iframe-CA0Xqitl.js";import{B as i}from"./ButtonIcon-eB96E9Ni.js";import{T as e}from"./index-Uz4cXNx-.js";import{F as r}from"./Flex-UeRHtQGJ.js";import{T as a}from"./Text-BE_v3cq4.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./Button-CjoOUm65.js";import"./utils-CxRSQOHD.js";import"./useObjectRef-galIu8y9.js";import"./Label-9E4Aif6g.js";import"./Hidden-DiEvt5li.js";import"./useFocusable-B_K0Toxg.js";import"./useLabel-CJ64sIWi.js";import"./useLabels-DoeKqma6.js";import"./context-C_kA5pZC.js";import"./usePress-Cm_6NlmW.js";import"./useFocusRing-XSvWfqXQ.js";import"./useStyles-DWCTEpsL.js";import"./Button.module-BPzqtDAO.js";const w={title:"Backstage UI/ButtonIcon",component:i,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}},o={render:()=>n.jsx(i,{icon:n.jsx(e,{})})},s={render:()=>n.jsxs(r,{align:"center",gap:"2",children:[n.jsx(i,{icon:n.jsx(e,{}),variant:"primary"}),n.jsx(i,{icon:n.jsx(e,{}),variant:"secondary"}),n.jsx(i,{icon:n.jsx(e,{}),variant:"tertiary"})]})},t={render:()=>n.jsxs(r,{align:"center",gap:"2",children:[n.jsx(i,{icon:n.jsx(e,{}),size:"small"}),n.jsx(i,{icon:n.jsx(e,{}),size:"medium"})]})},c={render:()=>n.jsxs(r,{direction:"row",gap:"2",children:[n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"primary"}),n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"secondary"}),n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"tertiary"})]})},d={args:{variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}},render:u=>n.jsx(i,{...u,icon:n.jsx(e,{})})},l={render:()=>{const[u,p]=g.useState(!1),x=()=>{p(!0),setTimeout(()=>{p(!1)},3e3)};return n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),loading:u,onPress:x})}},m={render:()=>n.jsxs(r,{direction:"column",gap:"4",children:[n.jsx(a,{children:"Primary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"primary",size:"small",icon:n.jsx(e,{}),loading:!0}),n.jsx(i,{variant:"primary",size:"medium",icon:n.jsx(e,{}),loading:!0})]}),n.jsx(a,{children:"Secondary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"secondary",size:"small",icon:n.jsx(e,{}),loading:!0}),n.jsx(i,{variant:"secondary",size:"medium",icon:n.jsx(e,{}),loading:!0})]}),n.jsx(a,{children:"Tertiary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"tertiary",size:"small",icon:n.jsx(e,{}),loading:!0}),n.jsx(i,{variant:"tertiary",size:"medium",icon:n.jsx(e,{}),loading:!0})]}),n.jsx(a,{children:"Loading vs Disabled"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),loading:!0}),n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),isDisabled:!0}),n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),loading:!0,isDisabled:!0})]})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <ButtonIcon icon={<RiCloudLine />} />
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} variant="primary" />
      <ButtonIcon icon={<RiCloudLine />} variant="secondary" />
      <ButtonIcon icon={<RiCloudLine />} variant="tertiary" />
    </Flex>
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} size="small" />
      <ButtonIcon icon={<RiCloudLine />} size="medium" />
    </Flex>
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Flex direction="row" gap="2">
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="primary" />
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="secondary" />
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="tertiary" />
    </Flex>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };
    return <ButtonIcon variant="primary" icon={<RiCloudLine />} loading={isLoading} onPress={handleClick} />;
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Flex direction="column" gap="4">
      <Text>Primary</Text>
      <Flex align="center" gap="4">
        <ButtonIcon variant="primary" size="small" icon={<RiCloudLine />} loading />
        <ButtonIcon variant="primary" size="medium" icon={<RiCloudLine />} loading />
      </Flex>

      <Text>Secondary</Text>
      <Flex align="center" gap="4">
        <ButtonIcon variant="secondary" size="small" icon={<RiCloudLine />} loading />
        <ButtonIcon variant="secondary" size="medium" icon={<RiCloudLine />} loading />
      </Flex>

      <Text>Tertiary</Text>
      <Flex align="center" gap="4">
        <ButtonIcon variant="tertiary" size="small" icon={<RiCloudLine />} loading />
        <ButtonIcon variant="tertiary" size="medium" icon={<RiCloudLine />} loading />
      </Flex>

      <Text>Loading vs Disabled</Text>
      <Flex align="center" gap="4">
        <ButtonIcon variant="primary" icon={<RiCloudLine />} loading />
        <ButtonIcon variant="primary" icon={<RiCloudLine />} isDisabled />
        <ButtonIcon variant="primary" icon={<RiCloudLine />} loading isDisabled />
      </Flex>
    </Flex>
}`,...m.parameters?.docs?.source}}};const _=["Default","Variants","Sizes","Disabled","Responsive","Loading","LoadingVariants"];export{o as Default,c as Disabled,l as Loading,m as LoadingVariants,d as Responsive,t as Sizes,s as Variants,_ as __namedExportsOrder,w as default};
