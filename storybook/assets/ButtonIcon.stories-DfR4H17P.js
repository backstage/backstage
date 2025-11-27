import{j as n,r as g}from"./iframe-B6vHPHUS.js";import{B as i}from"./ButtonIcon-M1G2Ih3m.js";import{T as e}from"./index-CX60uPmW.js";import{F as r}from"./Flex-CUF93du8.js";import{T as a}from"./Text-B-LjbfPX.js";import"./preload-helper-D9Z9MdNV.js";import"./clsx-B-dksMZM.js";import"./Button-Bk6CObpo.js";import"./utils-Dc-c3eC3.js";import"./Label-Bwu2jGwM.js";import"./Hidden-ByRJzAKI.js";import"./useFocusRing-BPooT00c.js";import"./useLabel-BjKVVapu.js";import"./useLabels-CTSau9A7.js";import"./context-DsQFltCn.js";import"./usePress-D5zWsAX_.js";import"./useStyles-C-y3xpyB.js";import"./Button.module-BPzqtDAO.js";const V={title:"Backstage UI/ButtonIcon",component:i,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}},s={render:()=>n.jsx(i,{icon:n.jsx(e,{})})},o={render:()=>n.jsxs(r,{align:"center",gap:"2",children:[n.jsx(i,{icon:n.jsx(e,{}),variant:"primary"}),n.jsx(i,{icon:n.jsx(e,{}),variant:"secondary"}),n.jsx(i,{icon:n.jsx(e,{}),variant:"tertiary"})]})},t={render:()=>n.jsxs(r,{align:"center",gap:"2",children:[n.jsx(i,{icon:n.jsx(e,{}),size:"small"}),n.jsx(i,{icon:n.jsx(e,{}),size:"medium"})]})},c={render:()=>n.jsxs(r,{direction:"row",gap:"2",children:[n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"primary"}),n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"secondary"}),n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"tertiary"})]})},d={args:{variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}},render:u=>n.jsx(i,{...u,icon:n.jsx(e,{})})},l={render:()=>{const[u,p]=g.useState(!1),x=()=>{p(!0),setTimeout(()=>{p(!1)},3e3)};return n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),loading:u,onPress:x})}},m={render:()=>n.jsxs(r,{direction:"column",gap:"4",children:[n.jsx(a,{children:"Primary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"primary",size:"small",icon:n.jsx(e,{}),loading:!0}),n.jsx(i,{variant:"primary",size:"medium",icon:n.jsx(e,{}),loading:!0})]}),n.jsx(a,{children:"Secondary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"secondary",size:"small",icon:n.jsx(e,{}),loading:!0}),n.jsx(i,{variant:"secondary",size:"medium",icon:n.jsx(e,{}),loading:!0})]}),n.jsx(a,{children:"Tertiary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"tertiary",size:"small",icon:n.jsx(e,{}),loading:!0}),n.jsx(i,{variant:"tertiary",size:"medium",icon:n.jsx(e,{}),loading:!0})]}),n.jsx(a,{children:"Loading vs Disabled"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),loading:!0}),n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),isDisabled:!0}),n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),loading:!0,isDisabled:!0})]})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <ButtonIcon icon={<RiCloudLine />} />
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} variant="primary" />
      <ButtonIcon icon={<RiCloudLine />} variant="secondary" />
      <ButtonIcon icon={<RiCloudLine />} variant="tertiary" />
    </Flex>
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const E=["Default","Variants","Sizes","Disabled","Responsive","Loading","LoadingVariants"];export{s as Default,c as Disabled,l as Loading,m as LoadingVariants,d as Responsive,t as Sizes,o as Variants,E as __namedExportsOrder,V as default};
