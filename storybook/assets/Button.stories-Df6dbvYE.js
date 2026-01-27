import{a5 as j,j as n,r as f}from"./iframe-DEXNC9RX.js";import{B as t}from"./Button-D5chsfEf.js";import{T as e,r as y}from"./index-BdXQ8KNR.js";import{F as r}from"./Flex-xmCcxFTE.js";import{B as S}from"./Box-CPBxi1en.js";import{T as i}from"./Text-BYDBMmGU.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-BvnngkZL.js";import"./utils-D2s8_aAJ.js";import"./useObjectRef-o4sY1jkT.js";import"./clsx-B-dksMZM.js";import"./Label-DyK2mE5k.js";import"./Hidden-BGcqtIUS.js";import"./useFocusable-DbzfLgOG.js";import"./useLabel-B7_zZ6f1.js";import"./useLabels-DPWYYtq_.js";import"./context-tSwZuYBl.js";import"./useButton-DZ8FMGK4.js";import"./usePress-BUDeIQXb.js";import"./useFocusRing-GcFdPQvN.js";import"./defineComponent-DZFTZYi_.js";import"./useStyles-D-F9OntJ.js";import"./useSurface-DSizYiYz.js";const a=j.meta({title:"Backstage UI/Button",component:t,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),s=a.story({args:{children:"Button"}}),u=a.story({args:{children:"Button"},parameters:{argTypes:{variant:{control:!1}}},render:()=>n.jsxs(r,{direction:"column",gap:"4",children:[n.jsxs(r,{direction:"column",gap:"4",children:[n.jsx(i,{children:"Default"}),n.jsxs(r,{align:"center",p:"4",children:[n.jsx(t,{iconStart:n.jsx(e,{}),variant:"primary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(e,{}),variant:"secondary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(e,{}),variant:"tertiary",children:"Button"})]})]}),n.jsxs(r,{direction:"column",gap:"4",children:[n.jsx(i,{children:"On Surface 0"}),n.jsxs(r,{align:"center",surface:"0",p:"4",children:[n.jsx(t,{iconStart:n.jsx(e,{}),variant:"primary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(e,{}),variant:"secondary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(e,{}),variant:"tertiary",children:"Button"})]})]}),n.jsxs(r,{direction:"column",gap:"4",children:[n.jsx(i,{children:"On Surface 1"}),n.jsxs(r,{align:"center",surface:"1",p:"4",children:[n.jsx(t,{iconStart:n.jsx(e,{}),variant:"primary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(e,{}),variant:"secondary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(e,{}),variant:"tertiary",children:"Button"})]})]}),n.jsxs(r,{direction:"column",gap:"4",children:[n.jsx(i,{children:"On Surface 2"}),n.jsxs(r,{align:"center",surface:"2",p:"4",children:[n.jsx(t,{iconStart:n.jsx(e,{}),variant:"primary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(e,{}),variant:"secondary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(e,{}),variant:"tertiary",children:"Button"})]})]}),n.jsxs(r,{direction:"column",gap:"4",children:[n.jsx(i,{children:"On Surface 3"}),n.jsxs(r,{align:"center",surface:"3",p:"4",children:[n.jsx(t,{iconStart:n.jsx(e,{}),variant:"primary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(e,{}),variant:"secondary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(e,{}),variant:"tertiary",children:"Button"})]})]})]})}),c=a.story({args:{children:"Button"},render:()=>n.jsxs(r,{align:"center",children:[n.jsx(t,{size:"small",iconStart:n.jsx(e,{}),children:"Small"}),n.jsx(t,{size:"medium",iconStart:n.jsx(e,{}),children:"Medium"})]})}),l=a.story({args:{children:"Button"},render:o=>n.jsxs(r,{align:"center",children:[n.jsx(t,{...o,iconStart:n.jsx(e,{})}),n.jsx(t,{...o,iconEnd:n.jsx(y,{})}),n.jsx(t,{...o,iconStart:n.jsx(e,{}),iconEnd:n.jsx(y,{})})]})}),d=a.story({args:{children:"Button"},render:o=>n.jsxs(r,{direction:"column",gap:"4",style:{width:"300px"},children:[n.jsx(t,{...o,iconStart:n.jsx(e,{})}),n.jsx(t,{...o,iconEnd:n.jsx(y,{})}),n.jsx(t,{...o,iconStart:n.jsx(e,{}),iconEnd:n.jsx(y,{})})]})}),p=a.story({render:()=>n.jsxs(r,{direction:"row",gap:"4",children:[n.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),n.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),n.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})}),m=a.story({args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}}),x=a.story({render:()=>{const[o,h]=f.useState(!1),v=()=>{h(!0),setTimeout(()=>{h(!1)},3e3)};return n.jsx(t,{variant:"primary",loading:o,onPress:v,children:"Load more items"})}}),B=a.story({render:()=>n.jsxs(r,{direction:"column",gap:"4",children:[n.jsx(i,{children:"Primary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(t,{variant:"primary",size:"small",loading:!0,children:"Small Loading"}),n.jsx(t,{variant:"primary",size:"medium",loading:!0,children:"Medium Loading"}),n.jsx(t,{variant:"primary",loading:!0,iconStart:n.jsx(e,{}),children:"With Icon"})]}),n.jsx(i,{children:"Secondary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(t,{variant:"secondary",size:"small",loading:!0,children:"Small Loading"}),n.jsx(t,{variant:"secondary",size:"medium",loading:!0,children:"Medium Loading"}),n.jsx(t,{variant:"secondary",loading:!0,iconStart:n.jsx(e,{}),children:"With Icon"})]}),n.jsx(i,{children:"Tertiary"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(t,{variant:"tertiary",size:"small",loading:!0,children:"Small Loading"}),n.jsx(t,{variant:"tertiary",size:"medium",loading:!0,children:"Medium Loading"}),n.jsx(t,{variant:"tertiary",loading:!0,iconStart:n.jsx(e,{}),children:"With Icon"})]}),n.jsx(i,{children:"Loading vs Disabled"}),n.jsxs(r,{align:"center",gap:"4",children:[n.jsx(t,{variant:"primary",loading:!0,children:"Loading"}),n.jsx(t,{variant:"primary",isDisabled:!0,children:"Disabled"}),n.jsx(t,{variant:"primary",loading:!0,isDisabled:!0,children:"Both (Disabled Wins)"})]})]})}),g=a.story({render:()=>n.jsxs(r,{direction:"column",gap:"4",children:[n.jsx("div",{style:{maxWidth:"600px"},children:`Using onSurface="auto" on buttons inherits their container's surface level, making them reusable. This is equivalent to not specifying onSurface. To override, use explicit surface values like onSurface="0" or onSurface="2".`}),n.jsxs(S,{surface:"0",p:"4",children:[n.jsx(i,{children:"Surface 0 container"}),n.jsxs(r,{gap:"2",mt:"2",children:[n.jsx(t,{variant:"secondary",children:"Default (inherits 0)"}),n.jsx(t,{variant:"secondary",onSurface:"auto",children:"Auto (inherits 0)"}),n.jsx(t,{variant:"secondary",onSurface:"1",children:"Explicit 1"})]})]}),n.jsxs(S,{surface:"1",p:"4",children:[n.jsx(i,{children:"Surface 1 container"}),n.jsxs(r,{gap:"2",mt:"2",children:[n.jsx(t,{variant:"secondary",children:"Default (inherits 1)"}),n.jsx(t,{variant:"secondary",onSurface:"auto",children:"Auto (inherits 1)"}),n.jsx(t,{variant:"secondary",onSurface:"2",children:"Explicit 2"})]})]}),n.jsxs(S,{surface:"2",p:"4",children:[n.jsx(i,{children:"Surface 2 container"}),n.jsxs(r,{gap:"2",mt:"2",children:[n.jsx(t,{variant:"secondary",children:"Default (inherits 2)"}),n.jsx(t,{variant:"secondary",onSurface:"auto",children:"Auto (inherits 2)"}),n.jsx(t,{variant:"secondary",onSurface:"3",children:"Explicit 3"})]})]})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => <Button>Button</Button>;
`,...s.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const Variants = () => (
  <Flex direction="column" gap="4">
    <Flex direction="column" gap="4">
      <Text>Default</Text>
      <Flex align="center" p="4">
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
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Surface 0</Text>
      <Flex align="center" surface="0" p="4">
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
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Surface 1</Text>
      <Flex align="center" surface="1" p="4">
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
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Surface 2</Text>
      <Flex align="center" surface="2" p="4">
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
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Surface 3</Text>
      <Flex align="center" surface="3" p="4">
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
    </Flex>
  </Flex>
);
`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex align="center">
    <Button size="small" iconStart={<RiCloudLine />}>
      Small
    </Button>
    <Button size="medium" iconStart={<RiCloudLine />}>
      Medium
    </Button>
  </Flex>
);
`,...c.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const WithIcons = () => (
  <Flex align="center">
    <Button iconStart={<RiCloudLine />}>Button</Button>
    <Button iconEnd={<RiArrowRightSLine />}>Button</Button>
    <Button iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />}>
      Button
    </Button>
  </Flex>
);
`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const FullWidth = () => (
  <Flex direction="column" gap="4" style={{ width: "300px" }}>
    <Button iconStart={<RiCloudLine />}>Button</Button>
    <Button iconEnd={<RiArrowRightSLine />}>Button</Button>
    <Button iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />}>
      Button
    </Button>
  </Flex>
);
`,...d.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const Disabled = () => (
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
);
`,...p.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const Responsive = () => (
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
`,...m.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const Loading = () => {
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
`,...x.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{code:`const LoadingVariants = () => (
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
`,...B.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const OnSurfaceAuto = () => (
  <Flex direction="column" gap="4">
    <div style={{ maxWidth: "600px" }}>
      Using onSurface="auto" on buttons inherits their container's surface
      level, making them reusable. This is equivalent to not specifying
      onSurface. To override, use explicit surface values like onSurface="0" or
      onSurface="2".
    </div>
    <Box surface="0" p="4">
      <Text>Surface 0 container</Text>
      <Flex gap="2" mt="2">
        <Button variant="secondary">Default (inherits 0)</Button>
        <Button variant="secondary" onSurface="auto">
          Auto (inherits 0)
        </Button>
        <Button variant="secondary" onSurface="1">
          Explicit 1
        </Button>
      </Flex>
    </Box>
    <Box surface="1" p="4">
      <Text>Surface 1 container</Text>
      <Flex gap="2" mt="2">
        <Button variant="secondary">Default (inherits 1)</Button>
        <Button variant="secondary" onSurface="auto">
          Auto (inherits 1)
        </Button>
        <Button variant="secondary" onSurface="2">
          Explicit 2
        </Button>
      </Flex>
    </Box>
    <Box surface="2" p="4">
      <Text>Surface 2 container</Text>
      <Flex gap="2" mt="2">
        <Button variant="secondary">Default (inherits 2)</Button>
        <Button variant="secondary" onSurface="auto">
          Auto (inherits 2)
        </Button>
        <Button variant="secondary" onSurface="3">
          Explicit 3
        </Button>
      </Flex>
    </Box>
  </Flex>
);
`,...g.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
    }
  },
  render: () => <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Text>Default</Text>
        <Flex align="center" p="4">
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
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 0</Text>
        <Flex align="center" surface="0" p="4">
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
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 1</Text>
        <Flex align="center" surface="1" p="4">
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
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 2</Text>
        <Flex align="center" surface="2" p="4">
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
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 3</Text>
        <Flex align="center" surface="3" p="4">
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
      </Flex>
    </Flex>
})`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <Button {...args} iconStart={<RiCloudLine />} />
      <Button {...args} iconEnd={<RiArrowRightSLine />} />
      <Button {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
})`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="row" gap="4">
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
})`,...p.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...x.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...B.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <div style={{
      maxWidth: '600px'
    }}>
        Using onSurface="auto" on buttons inherits their container's surface
        level, making them reusable. This is equivalent to not specifying
        onSurface. To override, use explicit surface values like onSurface="0"
        or onSurface="2".
      </div>
      <Box surface="0" p="4">
        <Text>Surface 0 container</Text>
        <Flex gap="2" mt="2">
          <Button variant="secondary">Default (inherits 0)</Button>
          <Button variant="secondary" onSurface="auto">
            Auto (inherits 0)
          </Button>
          <Button variant="secondary" onSurface="1">
            Explicit 1
          </Button>
        </Flex>
      </Box>
      <Box surface="1" p="4">
        <Text>Surface 1 container</Text>
        <Flex gap="2" mt="2">
          <Button variant="secondary">Default (inherits 1)</Button>
          <Button variant="secondary" onSurface="auto">
            Auto (inherits 1)
          </Button>
          <Button variant="secondary" onSurface="2">
            Explicit 2
          </Button>
        </Flex>
      </Box>
      <Box surface="2" p="4">
        <Text>Surface 2 container</Text>
        <Flex gap="2" mt="2">
          <Button variant="secondary">Default (inherits 2)</Button>
          <Button variant="secondary" onSurface="auto">
            Auto (inherits 2)
          </Button>
          <Button variant="secondary" onSurface="3">
            Explicit 3
          </Button>
        </Flex>
      </Box>
    </Flex>
})`,...g.input.parameters?.docs?.source}}};const J=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive","Loading","LoadingVariants","OnSurfaceAuto"];export{s as Default,p as Disabled,d as FullWidth,x as Loading,B as LoadingVariants,g as OnSurfaceAuto,m as Responsive,c as Sizes,u as Variants,l as WithIcons,J as __namedExportsOrder};
