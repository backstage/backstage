import{a3 as y,j as n,r as j}from"./iframe-BY8lR-L8.js";import{B as i}from"./ButtonIcon-Y52QppUa.js";import{T as r}from"./index-BNUW6RWV.js";import{F as e}from"./Flex-evfLyDkg.js";import{T as t}from"./Text-DFii9vrK.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./Button-DZR8lu4n.js";import"./utils-Bfoe0K7S.js";import"./useObjectRef-BqHG6lM5.js";import"./Label-g_-FIzgL.js";import"./Hidden-BOGSyjem.js";import"./useFocusable-C9C81vz2.js";import"./useLabel-C6JDtQl3.js";import"./useLabels-BYtztTEe.js";import"./context-BawLJTMw.js";import"./usePress-BOtSC_Hg.js";import"./useFocusRing-BEbWKVlK.js";import"./useStyles-DPxfsz7Y.js";import"./Button.module-BPzqtDAO.js";const a=y.meta({title:"Backstage UI/ButtonIcon",component:i,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),o=a.story({render:()=>n.jsx(i,{icon:n.jsx(r,{})})}),s=a.story({render:()=>n.jsxs(e,{align:"center",gap:"2",children:[n.jsx(i,{icon:n.jsx(r,{}),variant:"primary"}),n.jsx(i,{icon:n.jsx(r,{}),variant:"secondary"}),n.jsx(i,{icon:n.jsx(r,{}),variant:"tertiary"})]})}),c=a.story({render:()=>n.jsxs(e,{align:"center",gap:"2",children:[n.jsx(i,{icon:n.jsx(r,{}),size:"small"}),n.jsx(i,{icon:n.jsx(r,{}),size:"medium"})]})}),d=a.story({render:()=>n.jsxs(e,{direction:"row",gap:"2",children:[n.jsx(i,{isDisabled:!0,icon:n.jsx(r,{}),variant:"primary"}),n.jsx(i,{isDisabled:!0,icon:n.jsx(r,{}),variant:"secondary"}),n.jsx(i,{isDisabled:!0,icon:n.jsx(r,{}),variant:"tertiary"})]})}),l=a.story({args:{variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}},render:p=>n.jsx(i,{...p,icon:n.jsx(r,{})})}),u=a.story({render:()=>{const[p,x]=j.useState(!1),g=()=>{x(!0),setTimeout(()=>{x(!1)},3e3)};return n.jsx(i,{variant:"primary",icon:n.jsx(r,{}),loading:p,onPress:g})}}),m=a.story({render:()=>n.jsxs(e,{direction:"column",gap:"4",children:[n.jsx(t,{children:"Primary"}),n.jsxs(e,{align:"center",gap:"4",children:[n.jsx(i,{variant:"primary",size:"small",icon:n.jsx(r,{}),loading:!0}),n.jsx(i,{variant:"primary",size:"medium",icon:n.jsx(r,{}),loading:!0})]}),n.jsx(t,{children:"Secondary"}),n.jsxs(e,{align:"center",gap:"4",children:[n.jsx(i,{variant:"secondary",size:"small",icon:n.jsx(r,{}),loading:!0}),n.jsx(i,{variant:"secondary",size:"medium",icon:n.jsx(r,{}),loading:!0})]}),n.jsx(t,{children:"Tertiary"}),n.jsxs(e,{align:"center",gap:"4",children:[n.jsx(i,{variant:"tertiary",size:"small",icon:n.jsx(r,{}),loading:!0}),n.jsx(i,{variant:"tertiary",size:"medium",icon:n.jsx(r,{}),loading:!0})]}),n.jsx(t,{children:"Loading vs Disabled"}),n.jsxs(e,{align:"center",gap:"4",children:[n.jsx(i,{variant:"primary",icon:n.jsx(r,{}),loading:!0}),n.jsx(i,{variant:"primary",icon:n.jsx(r,{}),isDisabled:!0}),n.jsx(i,{variant:"primary",icon:n.jsx(r,{}),loading:!0,isDisabled:!0})]})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <ButtonIcon icon={<RiCloudLine />} />
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} variant="primary" />
      <ButtonIcon icon={<RiCloudLine />} variant="secondary" />
      <ButtonIcon icon={<RiCloudLine />} variant="tertiary" />
    </Flex>
})`,...s.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} size="small" />
      <ButtonIcon icon={<RiCloudLine />} size="medium" />
    </Flex>
})`,...c.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="row" gap="2">
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="primary" />
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="secondary" />
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="tertiary" />
    </Flex>
})`,...d.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...l.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};const O=["Default","Variants","Sizes","Disabled","Responsive","Loading","LoadingVariants"];export{o as Default,d as Disabled,u as Loading,m as LoadingVariants,l as Responsive,c as Sizes,s as Variants,O as __namedExportsOrder};
