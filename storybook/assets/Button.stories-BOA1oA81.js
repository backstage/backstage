import{p as L,j as t,a as j,r as D,B as y}from"./iframe-D342WmTn.js";import{B as n}from"./Button-BRU05vwM.js";import{T as r,r as h}from"./index-DI6kkxs9.js";import{F as e}from"./Flex-DxaxjefX.js";import{T as i}from"./Text-C4dwJP9A.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-L7sar6VY.js";import"./utils-XSUCBZLI.js";import"./useObjectRef-CO_ku4B-.js";import"./Label-CpkSgoMS.js";import"./Hidden-ElRkXuRf.js";import"./useFocusable-CfcKZPNt.js";import"./useLabel-DBAkngFl.js";import"./useLabels-bzBF2DeD.js";import"./context-BmHtVijJ.js";import"./useButton-DWKAwkZK.js";import"./usePress-BCsbNTsB.js";import"./useFocusRing-WEy0uZc6.js";import"./useStyles-DHWGe5B5.js";const a=L.meta({title:"Backstage UI/Button",component:n,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary","tertiary"]},destructive:{control:"boolean"}}}),s=a.story({args:{children:"Button"}}),u=a.story({args:{children:"Button"},parameters:{argTypes:{variant:{control:!1}},chromatic:{modes:{"light spotify neutral-1":j["light spotify neutral-1"],"light spotify neutral-2":j["light spotify neutral-2"],"light spotify neutral-3":j["light spotify neutral-3"]}}},render:()=>t.jsxs(e,{direction:"column",gap:"4",children:[t.jsxs(e,{align:"center",children:[t.jsx(n,{iconStart:t.jsx(r,{}),variant:"primary",children:"Button"}),t.jsx(n,{iconStart:t.jsx(r,{}),variant:"secondary",children:"Button"}),t.jsx(n,{iconStart:t.jsx(r,{}),variant:"tertiary",children:"Button"})]}),t.jsxs(e,{align:"center",children:[t.jsx(n,{iconStart:t.jsx(r,{}),variant:"primary",destructive:!0,children:"Button"}),t.jsx(n,{iconStart:t.jsx(r,{}),variant:"secondary",destructive:!0,children:"Button"}),t.jsx(n,{iconStart:t.jsx(r,{}),variant:"tertiary",destructive:!0,children:"Button"})]})]})}),l=a.story({render:()=>t.jsxs(e,{direction:"column",gap:"4",children:[t.jsxs(e,{direction:"column",gap:"4",children:[t.jsx(i,{children:"Primary Destructive"}),t.jsxs(e,{align:"center",p:"4",gap:"4",children:[t.jsx(n,{variant:"primary",destructive:!0,children:"Delete"}),t.jsx(n,{variant:"primary",destructive:!0,iconStart:t.jsx(r,{}),children:"Delete"}),t.jsx(n,{variant:"primary",destructive:!0,isDisabled:!0,children:"Disabled"}),t.jsx(n,{variant:"primary",destructive:!0,loading:!0,children:"Loading"})]})]}),t.jsxs(e,{direction:"column",gap:"4",children:[t.jsx(i,{children:"Secondary Destructive"}),t.jsxs(e,{align:"center",p:"4",gap:"4",children:[t.jsx(n,{variant:"secondary",destructive:!0,children:"Delete"}),t.jsx(n,{variant:"secondary",destructive:!0,iconStart:t.jsx(r,{}),children:"Delete"}),t.jsx(n,{variant:"secondary",destructive:!0,isDisabled:!0,children:"Disabled"}),t.jsx(n,{variant:"secondary",destructive:!0,loading:!0,children:"Loading"})]})]}),t.jsxs(e,{direction:"column",gap:"4",children:[t.jsx(i,{children:"Tertiary Destructive"}),t.jsxs(e,{align:"center",p:"4",gap:"4",children:[t.jsx(n,{variant:"tertiary",destructive:!0,children:"Delete"}),t.jsx(n,{variant:"tertiary",destructive:!0,iconStart:t.jsx(r,{}),children:"Delete"}),t.jsx(n,{variant:"tertiary",destructive:!0,isDisabled:!0,children:"Disabled"}),t.jsx(n,{variant:"tertiary",destructive:!0,loading:!0,children:"Loading"})]})]}),t.jsxs(e,{direction:"column",gap:"4",children:[t.jsx(i,{children:"Sizes"}),t.jsxs(e,{align:"center",p:"4",gap:"4",children:[t.jsx(n,{variant:"primary",destructive:!0,size:"small",children:"Small"}),t.jsx(n,{variant:"primary",destructive:!0,size:"medium",children:"Medium"})]})]})]})}),d=a.story({args:{children:"Button"},render:()=>t.jsxs(e,{align:"center",children:[t.jsx(n,{size:"small",iconStart:t.jsx(r,{}),children:"Small"}),t.jsx(n,{size:"medium",iconStart:t.jsx(r,{}),children:"Medium"})]})}),c=a.story({args:{children:"Button"},render:o=>t.jsxs(e,{align:"center",children:[t.jsx(n,{...o,iconStart:t.jsx(r,{})}),t.jsx(n,{...o,iconEnd:t.jsx(h,{})}),t.jsx(n,{...o,iconStart:t.jsx(r,{}),iconEnd:t.jsx(h,{})})]})}),p=a.story({args:{children:"Button"},render:o=>t.jsxs(e,{direction:"column",gap:"4",style:{width:"300px"},children:[t.jsx(n,{...o,iconStart:t.jsx(r,{})}),t.jsx(n,{...o,iconEnd:t.jsx(h,{})}),t.jsx(n,{...o,iconStart:t.jsx(r,{}),iconEnd:t.jsx(h,{})})]})}),m=a.story({render:()=>t.jsxs(e,{direction:"column",gap:"4",children:[t.jsxs(e,{direction:"row",gap:"4",children:[t.jsx(n,{variant:"primary",isDisabled:!0,children:"Primary"}),t.jsx(n,{variant:"secondary",isDisabled:!0,children:"Secondary"}),t.jsx(n,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]}),t.jsxs(e,{direction:"row",gap:"4",children:[t.jsx(n,{variant:"primary",destructive:!0,isDisabled:!0,children:"Primary Destructive"}),t.jsx(n,{variant:"secondary",destructive:!0,isDisabled:!0,children:"Secondary Destructive"}),t.jsx(n,{variant:"tertiary",destructive:!0,isDisabled:!0,children:"Tertiary Destructive"})]})]})}),x=a.story({args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}}),B=a.story({render:()=>{const[o,F]=D.useState(!1),S=()=>{F(!0),setTimeout(()=>{F(!1)},3e3)};return t.jsx(n,{variant:"primary",loading:o,onPress:S,children:"Load more items"})}}),g=a.story({render:()=>t.jsxs(e,{direction:"column",gap:"4",children:[t.jsx(i,{children:"Primary"}),t.jsxs(e,{align:"center",gap:"4",children:[t.jsx(n,{variant:"primary",size:"small",loading:!0,children:"Small Loading"}),t.jsx(n,{variant:"primary",size:"medium",loading:!0,children:"Medium Loading"}),t.jsx(n,{variant:"primary",loading:!0,iconStart:t.jsx(r,{}),children:"With Icon"})]}),t.jsx(i,{children:"Secondary"}),t.jsxs(e,{align:"center",gap:"4",children:[t.jsx(n,{variant:"secondary",size:"small",loading:!0,children:"Small Loading"}),t.jsx(n,{variant:"secondary",size:"medium",loading:!0,children:"Medium Loading"}),t.jsx(n,{variant:"secondary",loading:!0,iconStart:t.jsx(r,{}),children:"With Icon"})]}),t.jsx(i,{children:"Tertiary"}),t.jsxs(e,{align:"center",gap:"4",children:[t.jsx(n,{variant:"tertiary",size:"small",loading:!0,children:"Small Loading"}),t.jsx(n,{variant:"tertiary",size:"medium",loading:!0,children:"Medium Loading"}),t.jsx(n,{variant:"tertiary",loading:!0,iconStart:t.jsx(r,{}),children:"With Icon"})]}),t.jsx(i,{children:"Primary Destructive"}),t.jsxs(e,{align:"center",gap:"4",children:[t.jsx(n,{variant:"primary",destructive:!0,size:"small",loading:!0,children:"Small Loading"}),t.jsx(n,{variant:"primary",destructive:!0,size:"medium",loading:!0,children:"Medium Loading"}),t.jsx(n,{variant:"primary",destructive:!0,loading:!0,iconStart:t.jsx(r,{}),children:"With Icon"})]}),t.jsx(i,{children:"Loading vs Disabled"}),t.jsxs(e,{align:"center",gap:"4",children:[t.jsx(n,{variant:"primary",loading:!0,children:"Loading"}),t.jsx(n,{variant:"primary",isDisabled:!0,children:"Disabled"}),t.jsx(n,{variant:"primary",loading:!0,isDisabled:!0,children:"Both (Disabled Wins)"})]})]})}),v=a.story({render:()=>t.jsxs(e,{direction:"column",gap:"4",children:[t.jsx("div",{style:{maxWidth:"600px"},children:"Buttons automatically detect their parent bg context and increment the neutral level by 1. No prop is needed on the button -- it's fully automatic."}),t.jsxs(y,{bg:"neutral",p:"4",children:[t.jsx(i,{children:"Neutral 1 container"}),t.jsxs(e,{gap:"2",mt:"2",children:[t.jsx(n,{variant:"secondary",children:"Auto (neutral-2)"}),t.jsx(n,{variant:"tertiary",children:"Auto (neutral-2)"})]})]}),t.jsx(y,{bg:"neutral",children:t.jsxs(y,{bg:"neutral",p:"4",children:[t.jsx(i,{children:"Neutral 2 container"}),t.jsxs(e,{gap:"2",mt:"2",children:[t.jsx(n,{variant:"secondary",children:"Auto (neutral-3)"}),t.jsx(n,{variant:"tertiary",children:"Auto (neutral-3)"})]})]})}),t.jsx(y,{bg:"neutral",children:t.jsx(y,{bg:"neutral",children:t.jsxs(y,{bg:"neutral",p:"4",children:[t.jsx(i,{children:"Neutral 3 container"}),t.jsxs(e,{gap:"2",mt:"2",children:[t.jsx(n,{variant:"secondary",children:"Auto (neutral-4)"}),t.jsx(n,{variant:"tertiary",children:"Auto (neutral-4)"})]})]})})})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => <Button>Button</Button>;
`,...s.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const Variants = () => (
  <Flex direction="column" gap="4">
    <Flex align="center">
      <Button iconStart={<RiCloudLine />} variant="primary">
        Button
      </Button>
      <Button iconStart={<RiCloudLine />} variant="secondary">
        Button
      </Button>
      <Button iconStart={<RiCloudLine />} variant="tertiary">
        Button
      </Button>
    </Flex>
    <Flex align="center">
      <Button iconStart={<RiCloudLine />} variant="primary" destructive>
        Button
      </Button>
      <Button iconStart={<RiCloudLine />} variant="secondary" destructive>
        Button
      </Button>
      <Button iconStart={<RiCloudLine />} variant="tertiary" destructive>
        Button
      </Button>
    </Flex>
  </Flex>
);
`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const Destructive = () => (
  <Flex direction="column" gap="4">
    <Flex direction="column" gap="4">
      <Text>Primary Destructive</Text>
      <Flex align="center" p="4" gap="4">
        <Button variant="primary" destructive>
          Delete
        </Button>
        <Button variant="primary" destructive iconStart={<RiCloudLine />}>
          Delete
        </Button>
        <Button variant="primary" destructive isDisabled>
          Disabled
        </Button>
        <Button variant="primary" destructive loading>
          Loading
        </Button>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>Secondary Destructive</Text>
      <Flex align="center" p="4" gap="4">
        <Button variant="secondary" destructive>
          Delete
        </Button>
        <Button variant="secondary" destructive iconStart={<RiCloudLine />}>
          Delete
        </Button>
        <Button variant="secondary" destructive isDisabled>
          Disabled
        </Button>
        <Button variant="secondary" destructive loading>
          Loading
        </Button>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>Tertiary Destructive</Text>
      <Flex align="center" p="4" gap="4">
        <Button variant="tertiary" destructive>
          Delete
        </Button>
        <Button variant="tertiary" destructive iconStart={<RiCloudLine />}>
          Delete
        </Button>
        <Button variant="tertiary" destructive isDisabled>
          Disabled
        </Button>
        <Button variant="tertiary" destructive loading>
          Loading
        </Button>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>Sizes</Text>
      <Flex align="center" p="4" gap="4">
        <Button variant="primary" destructive size="small">
          Small
        </Button>
        <Button variant="primary" destructive size="medium">
          Medium
        </Button>
      </Flex>
    </Flex>
  </Flex>
);
`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex align="center">
    <Button size="small" iconStart={<RiCloudLine />}>
      Small
    </Button>
    <Button size="medium" iconStart={<RiCloudLine />}>
      Medium
    </Button>
  </Flex>
);
`,...d.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const WithIcons = () => (
  <Flex align="center">
    <Button iconStart={<RiCloudLine />}>Button</Button>
    <Button iconEnd={<RiArrowRightSLine />}>Button</Button>
    <Button iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />}>
      Button
    </Button>
  </Flex>
);
`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const FullWidth = () => (
  <Flex direction="column" gap="4" style={{ width: "300px" }}>
    <Button iconStart={<RiCloudLine />}>Button</Button>
    <Button iconEnd={<RiArrowRightSLine />}>Button</Button>
    <Button iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />}>
      Button
    </Button>
  </Flex>
);
`,...p.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const Disabled = () => (
  <Flex direction="column" gap="4">
    <Flex direction="row" gap="4">
      <Button variant="primary" isDisabled>
        Primary
      </Button>
      <Button variant="secondary" isDisabled>
        Secondary
      </Button>
      <Button variant="tertiary" isDisabled>
        Tertiary
      </Button>
    </Flex>
    <Flex direction="row" gap="4">
      <Button variant="primary" destructive isDisabled>
        Primary Destructive
      </Button>
      <Button variant="secondary" destructive isDisabled>
        Secondary Destructive
      </Button>
      <Button variant="tertiary" destructive isDisabled>
        Tertiary Destructive
      </Button>
    </Flex>
  </Flex>
);
`,...m.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const Responsive = () => (
  <Button
    variant={{
      initial: "primary",
      sm: "secondary",
    }}
    size={{
      xs: "small",
      sm: "medium",
    }}
  >
    Button
  </Button>
);
`,...x.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{code:`const Loading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <Button variant="primary" loading={isLoading} onPress={handleClick}>
      Load more items
    </Button>
  );
};
`,...B.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const LoadingVariants = () => (
  <Flex direction="column" gap="4">
    <Text>Primary</Text>
    <Flex align="center" gap="4">
      <Button variant="primary" size="small" loading>
        Small Loading
      </Button>
      <Button variant="primary" size="medium" loading>
        Medium Loading
      </Button>
      <Button variant="primary" loading iconStart={<RiCloudLine />}>
        With Icon
      </Button>
    </Flex>

    <Text>Secondary</Text>
    <Flex align="center" gap="4">
      <Button variant="secondary" size="small" loading>
        Small Loading
      </Button>
      <Button variant="secondary" size="medium" loading>
        Medium Loading
      </Button>
      <Button variant="secondary" loading iconStart={<RiCloudLine />}>
        With Icon
      </Button>
    </Flex>

    <Text>Tertiary</Text>
    <Flex align="center" gap="4">
      <Button variant="tertiary" size="small" loading>
        Small Loading
      </Button>
      <Button variant="tertiary" size="medium" loading>
        Medium Loading
      </Button>
      <Button variant="tertiary" loading iconStart={<RiCloudLine />}>
        With Icon
      </Button>
    </Flex>

    <Text>Primary Destructive</Text>
    <Flex align="center" gap="4">
      <Button variant="primary" destructive size="small" loading>
        Small Loading
      </Button>
      <Button variant="primary" destructive size="medium" loading>
        Medium Loading
      </Button>
      <Button variant="primary" destructive loading iconStart={<RiCloudLine />}>
        With Icon
      </Button>
    </Flex>

    <Text>Loading vs Disabled</Text>
    <Flex align="center" gap="4">
      <Button variant="primary" loading>
        Loading
      </Button>
      <Button variant="primary" isDisabled>
        Disabled
      </Button>
      <Button variant="primary" loading isDisabled>
        Both (Disabled Wins)
      </Button>
    </Flex>
  </Flex>
);
`,...g.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{code:`const AutoBg = () => (
  <Flex direction="column" gap="4">
    <div style={{ maxWidth: "600px" }}>
      Buttons automatically detect their parent bg context and increment the
      neutral level by 1. No prop is needed on the button -- it's fully
      automatic.
    </div>
    <Box bg="neutral" p="4">
      <Text>Neutral 1 container</Text>
      <Flex gap="2" mt="2">
        <Button variant="secondary">Auto (neutral-2)</Button>
        <Button variant="tertiary">Auto (neutral-2)</Button>
      </Flex>
    </Box>
    <Box bg="neutral">
      <Box bg="neutral" p="4">
        <Text>Neutral 2 container</Text>
        <Flex gap="2" mt="2">
          <Button variant="secondary">Auto (neutral-3)</Button>
          <Button variant="tertiary">Auto (neutral-3)</Button>
        </Flex>
      </Box>
    </Box>
    <Box bg="neutral">
      <Box bg="neutral">
        <Box bg="neutral" p="4">
          <Text>Neutral 3 container</Text>
          <Flex gap="2" mt="2">
            <Button variant="secondary">Auto (neutral-4)</Button>
            <Button variant="tertiary">Auto (neutral-4)</Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  </Flex>
);
`,...v.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  }
})`,...s.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  parameters: {
    argTypes: {
      variant: {
        control: false
      }
    },
    chromatic: {
      modes: {
        'light spotify neutral-1': allModes['light spotify neutral-1'],
        'light spotify neutral-2': allModes['light spotify neutral-2'],
        'light spotify neutral-3': allModes['light spotify neutral-3']
      }
    }
  },
  render: () => <Flex direction="column" gap="4">
      <Flex align="center">
        <Button iconStart={<RiCloudLine />} variant="primary">
          Button
        </Button>
        <Button iconStart={<RiCloudLine />} variant="secondary">
          Button
        </Button>
        <Button iconStart={<RiCloudLine />} variant="tertiary">
          Button
        </Button>
      </Flex>
      <Flex align="center">
        <Button iconStart={<RiCloudLine />} variant="primary" destructive>
          Button
        </Button>
        <Button iconStart={<RiCloudLine />} variant="secondary" destructive>
          Button
        </Button>
        <Button iconStart={<RiCloudLine />} variant="tertiary" destructive>
          Button
        </Button>
      </Flex>
    </Flex>
})`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Text>Primary Destructive</Text>
        <Flex align="center" p="4" gap="4">
          <Button variant="primary" destructive>
            Delete
          </Button>
          <Button variant="primary" destructive iconStart={<RiCloudLine />}>
            Delete
          </Button>
          <Button variant="primary" destructive isDisabled>
            Disabled
          </Button>
          <Button variant="primary" destructive loading>
            Loading
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>Secondary Destructive</Text>
        <Flex align="center" p="4" gap="4">
          <Button variant="secondary" destructive>
            Delete
          </Button>
          <Button variant="secondary" destructive iconStart={<RiCloudLine />}>
            Delete
          </Button>
          <Button variant="secondary" destructive isDisabled>
            Disabled
          </Button>
          <Button variant="secondary" destructive loading>
            Loading
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>Tertiary Destructive</Text>
        <Flex align="center" p="4" gap="4">
          <Button variant="tertiary" destructive>
            Delete
          </Button>
          <Button variant="tertiary" destructive iconStart={<RiCloudLine />}>
            Delete
          </Button>
          <Button variant="tertiary" destructive isDisabled>
            Disabled
          </Button>
          <Button variant="tertiary" destructive loading>
            Loading
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>Sizes</Text>
        <Flex align="center" p="4" gap="4">
          <Button variant="primary" destructive size="small">
            Small
          </Button>
          <Button variant="primary" destructive size="medium">
            Medium
          </Button>
        </Flex>
      </Flex>
    </Flex>
})`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  render: () => <Flex align="center">
      <Button size="small" iconStart={<RiCloudLine />}>
        Small
      </Button>
      <Button size="medium" iconStart={<RiCloudLine />}>
        Medium
      </Button>
    </Flex>
})`,...d.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <Button {...args} iconStart={<RiCloudLine />} />
      <Button {...args} iconEnd={<RiArrowRightSLine />} />
      <Button {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
})`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  render: args => <Flex direction="column" gap="4" style={{
    width: '300px'
  }}>
      <Button {...args} iconStart={<RiCloudLine />} />
      <Button {...args} iconEnd={<RiArrowRightSLine />} />
      <Button {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
})`,...p.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Flex direction="row" gap="4">
        <Button variant="primary" isDisabled>
          Primary
        </Button>
        <Button variant="secondary" isDisabled>
          Secondary
        </Button>
        <Button variant="tertiary" isDisabled>
          Tertiary
        </Button>
      </Flex>
      <Flex direction="row" gap="4">
        <Button variant="primary" destructive isDisabled>
          Primary Destructive
        </Button>
        <Button variant="secondary" destructive isDisabled>
          Secondary Destructive
        </Button>
        <Button variant="tertiary" destructive isDisabled>
          Tertiary Destructive
        </Button>
      </Flex>
    </Flex>
})`,...m.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button',
    variant: {
      initial: 'primary',
      sm: 'secondary'
    },
    size: {
      xs: 'small',
      sm: 'medium'
    }
  }
})`,...x.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };
    return <Button variant="primary" loading={isLoading} onPress={handleClick}>
        Load more items
      </Button>;
  }
})`,...B.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Text>Primary</Text>
      <Flex align="center" gap="4">
        <Button variant="primary" size="small" loading>
          Small Loading
        </Button>
        <Button variant="primary" size="medium" loading>
          Medium Loading
        </Button>
        <Button variant="primary" loading iconStart={<RiCloudLine />}>
          With Icon
        </Button>
      </Flex>

      <Text>Secondary</Text>
      <Flex align="center" gap="4">
        <Button variant="secondary" size="small" loading>
          Small Loading
        </Button>
        <Button variant="secondary" size="medium" loading>
          Medium Loading
        </Button>
        <Button variant="secondary" loading iconStart={<RiCloudLine />}>
          With Icon
        </Button>
      </Flex>

      <Text>Tertiary</Text>
      <Flex align="center" gap="4">
        <Button variant="tertiary" size="small" loading>
          Small Loading
        </Button>
        <Button variant="tertiary" size="medium" loading>
          Medium Loading
        </Button>
        <Button variant="tertiary" loading iconStart={<RiCloudLine />}>
          With Icon
        </Button>
      </Flex>

      <Text>Primary Destructive</Text>
      <Flex align="center" gap="4">
        <Button variant="primary" destructive size="small" loading>
          Small Loading
        </Button>
        <Button variant="primary" destructive size="medium" loading>
          Medium Loading
        </Button>
        <Button variant="primary" destructive loading iconStart={<RiCloudLine />}>
          With Icon
        </Button>
      </Flex>

      <Text>Loading vs Disabled</Text>
      <Flex align="center" gap="4">
        <Button variant="primary" loading>
          Loading
        </Button>
        <Button variant="primary" isDisabled>
          Disabled
        </Button>
        <Button variant="primary" loading isDisabled>
          Both (Disabled Wins)
        </Button>
      </Flex>
    </Flex>
})`,...g.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <div style={{
      maxWidth: '600px'
    }}>
        Buttons automatically detect their parent bg context and increment the
        neutral level by 1. No prop is needed on the button -- it's fully
        automatic.
      </div>
      <Box bg="neutral" p="4">
        <Text>Neutral 1 container</Text>
        <Flex gap="2" mt="2">
          <Button variant="secondary">Auto (neutral-2)</Button>
          <Button variant="tertiary">Auto (neutral-2)</Button>
        </Flex>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral" p="4">
          <Text>Neutral 2 container</Text>
          <Flex gap="2" mt="2">
            <Button variant="secondary">Auto (neutral-3)</Button>
            <Button variant="tertiary">Auto (neutral-3)</Button>
          </Flex>
        </Box>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral">
          <Box bg="neutral" p="4">
            <Text>Neutral 3 container</Text>
            <Flex gap="2" mt="2">
              <Button variant="secondary">Auto (neutral-4)</Button>
              <Button variant="tertiary">Auto (neutral-4)</Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
})`,...v.input.parameters?.docs?.source}}};const q=["Default","Variants","Destructive","Sizes","WithIcons","FullWidth","Disabled","Responsive","Loading","LoadingVariants","AutoBg"];export{v as AutoBg,s as Default,l as Destructive,m as Disabled,p as FullWidth,B as Loading,g as LoadingVariants,x as Responsive,d as Sizes,u as Variants,c as WithIcons,q as __namedExportsOrder};
