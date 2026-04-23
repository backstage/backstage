import{j as n,r as y,p as j}from"./iframe-izSSIzTR.js";import{B as i}from"./ButtonIcon-BYMJLASR.js";import{T as e}from"./index-DGFCpqz_.js";import{F as r}from"./Flex-BmgJK1W7.js";import{T as t}from"./Text-DdqvwTvZ.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-CxBdRGKu.js";import"./utils-Cl9gINrl.js";import"./useObjectRef-DA7QflCc.js";import"./Label-DiQKndYJ.js";import"./Hidden-Z1-_rzje.js";import"./useGlobalListeners-CynQJlR4.js";import"./openLink-BZ37FDEF.js";import"./useLabel-C1C1CBQ9.js";import"./useLabels-DlA16iH6.js";import"./number-CfXc65k1.js";import"./I18nProvider-Dt5oCbl9.js";import"./useButton-cd_LBPNR.js";import"./usePress-BYzppgbW.js";import"./textSelection-DP5PjHic.js";import"./useHover-Dn05tM4n.js";const s=j.meta({title:"Backstage UI/ButtonIcon",component:i,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),a=s.story({render:()=>n.jsx(i,{icon:n.jsx(e,{})})}),o=s.story({render:()=>n.jsxs(r,{align:"center",gap:"2",children:[n.jsx(i,{icon:n.jsx(e,{}),variant:"primary"}),n.jsx(i,{icon:n.jsx(e,{}),variant:"secondary"}),n.jsx(i,{icon:n.jsx(e,{}),variant:"tertiary"})]})}),c=s.story({render:()=>n.jsxs(r,{align:"center",gap:"2",children:[n.jsx(i,{icon:n.jsx(e,{}),size:"small"}),n.jsx(i,{icon:n.jsx(e,{}),size:"medium"})]})}),d=s.story({render:()=>n.jsxs(r,{direction:"row",gap:"2",children:[n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"primary"}),n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"secondary"}),n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"tertiary"})]})}),m=s.story({args:{variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}},render:p=>n.jsx(i,{...p,icon:n.jsx(e,{})})}),u=s.story({render:()=>{const[p,x]=y.useState(!1),g=()=>{x(!0),setTimeout(()=>{x(!1)},3e3)};return n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),isPending:p,onPress:g})}}),l=s.story({render:()=>n.jsxs(r,{direction:"column",gap:"4",children:[n.jsx(t,{children:"Primary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"primary",size:"small",icon:n.jsx(e,{}),isPending:!0}),n.jsx(i,{variant:"primary",size:"medium",icon:n.jsx(e,{}),isPending:!0})]}),n.jsx(t,{children:"Secondary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"secondary",size:"small",icon:n.jsx(e,{}),isPending:!0}),n.jsx(i,{variant:"secondary",size:"medium",icon:n.jsx(e,{}),isPending:!0})]}),n.jsx(t,{children:"Tertiary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"tertiary",size:"small",icon:n.jsx(e,{}),isPending:!0}),n.jsx(i,{variant:"tertiary",size:"medium",icon:n.jsx(e,{}),isPending:!0})]}),n.jsx(t,{children:"Pending vs Disabled"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),isPending:!0}),n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),isDisabled:!0}),n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),isPending:!0,isDisabled:!0})]})]})});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <ButtonIcon icon={<RiCloudLine />} />
})`,...a.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} variant="primary" />
      <ButtonIcon icon={<RiCloudLine />} variant="secondary" />
      <ButtonIcon icon={<RiCloudLine />} variant="tertiary" />
    </Flex>
})`,...o.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => {
    const [isPending, setIsPending] = useState(false);
    const handleClick = () => {
      setIsPending(true);
      setTimeout(() => {
        setIsPending(false);
      }, 3000);
    };
    return <ButtonIcon variant="primary" icon={<RiCloudLine />} isPending={isPending} onPress={handleClick} />;
  }
})`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Text>Primary</Text>
      <Flex align="center" gap="4">
        <ButtonIcon variant="primary" size="small" icon={<RiCloudLine />} isPending />
        <ButtonIcon variant="primary" size="medium" icon={<RiCloudLine />} isPending />
      </Flex>

      <Text>Secondary</Text>
      <Flex align="center" gap="4">
        <ButtonIcon variant="secondary" size="small" icon={<RiCloudLine />} isPending />
        <ButtonIcon variant="secondary" size="medium" icon={<RiCloudLine />} isPending />
      </Flex>

      <Text>Tertiary</Text>
      <Flex align="center" gap="4">
        <ButtonIcon variant="tertiary" size="small" icon={<RiCloudLine />} isPending />
        <ButtonIcon variant="tertiary" size="medium" icon={<RiCloudLine />} isPending />
      </Flex>

      <Text>Pending vs Disabled</Text>
      <Flex align="center" gap="4">
        <ButtonIcon variant="primary" icon={<RiCloudLine />} isPending />
        <ButtonIcon variant="primary" icon={<RiCloudLine />} isDisabled />
        <ButtonIcon variant="primary" icon={<RiCloudLine />} isPending isDisabled />
      </Flex>
    </Flex>
})`,...l.input.parameters?.docs?.source}}};const U=["Default","Variants","Sizes","Disabled","Responsive","Pending","PendingVariants"];export{a as Default,d as Disabled,u as Pending,l as PendingVariants,m as Responsive,c as Sizes,o as Variants,U as __namedExportsOrder};
