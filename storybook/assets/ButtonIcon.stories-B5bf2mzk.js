import{bR as n,ca as y,c7 as j}from"./iframe-D690ZVKa.js";import{B as i}from"./ButtonIcon-D1vSayV3.js";import{T as e}from"./index-Bm8BO3VD.js";import{F as r}from"./Flex-CoAgMKgN.js";import{T as t}from"./Text-BbMH-w14.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-DsupNxvN.js";import"./utils-D1ifMOcR.js";import"./useObjectRef-BPqBfMfb.js";import"./Label-CHMEqKLB.js";import"./Hidden--Qykx-Ic.js";import"./useFocusRing-CBblcblV.js";import"./openLink-DlPHZOe9.js";import"./useLabel-Bv75J3A8.js";import"./useLabels-D2HAWa9S.js";import"./number-CGXALLEc.js";import"./I18nProvider-D9TsogMC.js";import"./useButton-D0OzxRTD.js";import"./usePress-BTPot_r7.js";import"./textSelection-30hfHS5F.js";import"./useHover-Da9hkWGW.js";const s=j.meta({title:"Backstage UI/ButtonIcon",component:i,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),a=s.story({render:()=>n.jsx(i,{icon:n.jsx(e,{})})}),o=s.story({render:()=>n.jsxs(r,{align:"center",gap:"2",children:[n.jsx(i,{icon:n.jsx(e,{}),variant:"primary"}),n.jsx(i,{icon:n.jsx(e,{}),variant:"secondary"}),n.jsx(i,{icon:n.jsx(e,{}),variant:"tertiary"})]})}),c=s.story({render:()=>n.jsxs(r,{align:"center",gap:"2",children:[n.jsx(i,{icon:n.jsx(e,{}),size:"small"}),n.jsx(i,{icon:n.jsx(e,{}),size:"medium"})]})}),d=s.story({render:()=>n.jsxs(r,{direction:"row",gap:"2",children:[n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"primary"}),n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"secondary"}),n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"tertiary"})]})}),m=s.story({args:{variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}},render:p=>n.jsx(i,{...p,icon:n.jsx(e,{})})}),u=s.story({render:()=>{const[p,x]=y.useState(!1),g=()=>{x(!0),setTimeout(()=>{x(!1)},3e3)};return n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),isPending:p,onPress:g})}}),l=s.story({render:()=>n.jsxs(r,{direction:"column",gap:"4",children:[n.jsx(t,{children:"Primary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"primary",size:"small",icon:n.jsx(e,{}),isPending:!0}),n.jsx(i,{variant:"primary",size:"medium",icon:n.jsx(e,{}),isPending:!0})]}),n.jsx(t,{children:"Secondary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"secondary",size:"small",icon:n.jsx(e,{}),isPending:!0}),n.jsx(i,{variant:"secondary",size:"medium",icon:n.jsx(e,{}),isPending:!0})]}),n.jsx(t,{children:"Tertiary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"tertiary",size:"small",icon:n.jsx(e,{}),isPending:!0}),n.jsx(i,{variant:"tertiary",size:"medium",icon:n.jsx(e,{}),isPending:!0})]}),n.jsx(t,{children:"Pending vs Disabled"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),isPending:!0}),n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),isDisabled:!0}),n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),isPending:!0,isDisabled:!0})]})]})});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
