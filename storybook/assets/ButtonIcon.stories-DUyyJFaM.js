import{p as y,j as n,r as L}from"./iframe-M9O-K8SB.js";import{B as i}from"./ButtonIcon-CDy8Bm8x.js";import{T as e}from"./index-BKJKY9Wv.js";import{F as a}from"./Flex-Bz2InqMs.js";import{T as p}from"./Text-RD33cT1s.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-Dkbd3KcU.js";import"./utils-BXllfVt4.js";import"./useObjectRef-BPFp5snO.js";import"./clsx-B-dksMZM.js";import"./Label-o9S_v-xF.js";import"./Hidden-DTd05gNK.js";import"./useFocusable-BwFERnd_.js";import"./useLabel-COjMvP6r.js";import"./useLabels-C3g0X61E.js";import"./context-Bv6kxITJ.js";import"./useButton-F9hepFpV.js";import"./usePress-ByOsZuB9.js";import"./useFocusRing-COnCKKka.js";import"./defineComponent-BmABoWOu.js";import"./useStyles-BRwt6BXn.js";import"./useSurface-CJaN3YoD.js";const l=y.meta({title:"Backstage UI/ButtonIcon",component:i,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),r=l.story({render:()=>n.jsx(i,{icon:n.jsx(e,{})})}),t=l.story({render:()=>n.jsxs(a,{align:"center",gap:"2",children:[n.jsx(i,{icon:n.jsx(e,{}),variant:"primary"}),n.jsx(i,{icon:n.jsx(e,{}),variant:"secondary"}),n.jsx(i,{icon:n.jsx(e,{}),variant:"tertiary"})]})}),o=l.story({render:()=>n.jsxs(a,{align:"center",gap:"2",children:[n.jsx(i,{icon:n.jsx(e,{}),size:"small"}),n.jsx(i,{icon:n.jsx(e,{}),size:"medium"})]})}),s=l.story({render:()=>n.jsxs(a,{direction:"row",gap:"2",children:[n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"primary"}),n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"secondary"}),n.jsx(i,{isDisabled:!0,icon:n.jsx(e,{}),variant:"tertiary"})]})}),c=l.story({args:{variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}},render:m=>n.jsx(i,{...m,icon:n.jsx(e,{})})}),d=l.story({render:()=>{const[m,x]=L.useState(!1),g=()=>{x(!0),setTimeout(()=>{x(!1)},3e3)};return n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),loading:m,onPress:g})}}),u=l.story({render:()=>n.jsxs(a,{direction:"column",gap:"4",children:[n.jsx(p,{children:"Primary"}),n.jsxs(a,{align:"center",gap:"4",children:[n.jsx(i,{variant:"primary",size:"small",icon:n.jsx(e,{}),loading:!0}),n.jsx(i,{variant:"primary",size:"medium",icon:n.jsx(e,{}),loading:!0})]}),n.jsx(p,{children:"Secondary"}),n.jsxs(a,{align:"center",gap:"4",children:[n.jsx(i,{variant:"secondary",size:"small",icon:n.jsx(e,{}),loading:!0}),n.jsx(i,{variant:"secondary",size:"medium",icon:n.jsx(e,{}),loading:!0})]}),n.jsx(p,{children:"Tertiary"}),n.jsxs(a,{align:"center",gap:"4",children:[n.jsx(i,{variant:"tertiary",size:"small",icon:n.jsx(e,{}),loading:!0}),n.jsx(i,{variant:"tertiary",size:"medium",icon:n.jsx(e,{}),loading:!0})]}),n.jsx(p,{children:"Loading vs Disabled"}),n.jsxs(a,{align:"center",gap:"4",children:[n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),loading:!0}),n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),isDisabled:!0}),n.jsx(i,{variant:"primary",icon:n.jsx(e,{}),loading:!0,isDisabled:!0})]})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = () => <ButtonIcon icon={<RiCloudLine />} />;
`,...r.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const Variants = () => (
  <Flex align="center" gap="2">
    <ButtonIcon icon={<RiCloudLine />} variant="primary" />
    <ButtonIcon icon={<RiCloudLine />} variant="secondary" />
    <ButtonIcon icon={<RiCloudLine />} variant="tertiary" />
  </Flex>
);
`,...t.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex align="center" gap="2">
    <ButtonIcon icon={<RiCloudLine />} size="small" />
    <ButtonIcon icon={<RiCloudLine />} size="medium" />
  </Flex>
);
`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Disabled = () => (
  <Flex direction="row" gap="2">
    <ButtonIcon isDisabled icon={<RiCloudLine />} variant="primary" />
    <ButtonIcon isDisabled icon={<RiCloudLine />} variant="secondary" />
    <ButtonIcon isDisabled icon={<RiCloudLine />} variant="tertiary" />
  </Flex>
);
`,...s.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const Responsive = () => (
  <ButtonIcon
    variant={{
      initial: "primary",
      sm: "secondary",
    }}
    size={{
      xs: "small",
      sm: "medium",
    }}
    icon={<RiCloudLine />}
  />
);
`,...c.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const Loading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <ButtonIcon
      variant="primary"
      icon={<RiCloudLine />}
      loading={isLoading}
      onPress={handleClick}
    />
  );
};
`,...d.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const LoadingVariants = () => (
  <Flex direction="column" gap="4">
    <Text>Primary</Text>
    <Flex align="center" gap="4">
      <ButtonIcon
        variant="primary"
        size="small"
        icon={<RiCloudLine />}
        loading
      />
      <ButtonIcon
        variant="primary"
        size="medium"
        icon={<RiCloudLine />}
        loading
      />
    </Flex>

    <Text>Secondary</Text>
    <Flex align="center" gap="4">
      <ButtonIcon
        variant="secondary"
        size="small"
        icon={<RiCloudLine />}
        loading
      />
      <ButtonIcon
        variant="secondary"
        size="medium"
        icon={<RiCloudLine />}
        loading
      />
    </Flex>

    <Text>Tertiary</Text>
    <Flex align="center" gap="4">
      <ButtonIcon
        variant="tertiary"
        size="small"
        icon={<RiCloudLine />}
        loading
      />
      <ButtonIcon
        variant="tertiary"
        size="medium"
        icon={<RiCloudLine />}
        loading
      />
    </Flex>

    <Text>Loading vs Disabled</Text>
    <Flex align="center" gap="4">
      <ButtonIcon variant="primary" icon={<RiCloudLine />} loading />
      <ButtonIcon variant="primary" icon={<RiCloudLine />} isDisabled />
      <ButtonIcon variant="primary" icon={<RiCloudLine />} loading isDisabled />
    </Flex>
  </Flex>
);
`,...u.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <ButtonIcon icon={<RiCloudLine />} />
})`,...r.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} variant="primary" />
      <ButtonIcon icon={<RiCloudLine />} variant="secondary" />
      <ButtonIcon icon={<RiCloudLine />} variant="tertiary" />
    </Flex>
})`,...t.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="center" gap="2">
      <ButtonIcon icon={<RiCloudLine />} size="small" />
      <ButtonIcon icon={<RiCloudLine />} size="medium" />
    </Flex>
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="row" gap="2">
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="primary" />
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="secondary" />
      <ButtonIcon isDisabled icon={<RiCloudLine />} variant="tertiary" />
    </Flex>
})`,...s.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};const q=["Default","Variants","Sizes","Disabled","Responsive","Loading","LoadingVariants"];export{r as Default,s as Disabled,d as Loading,u as LoadingVariants,c as Responsive,o as Sizes,t as Variants,q as __namedExportsOrder};
