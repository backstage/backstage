import{p,j as e}from"./iframe-M9O-K8SB.js";import{A as r}from"./Avatar-xG2q_nzt.js";import{F as s}from"./Flex-Bz2InqMs.js";import{T as c}from"./Text-RD33cT1s.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./useStyles-BRwt6BXn.js";import"./useSurface-CJaN3YoD.js";const l=p.meta({title:"Backstage UI/Avatar",component:r}),n=l.story({args:{src:"https://avatars.githubusercontent.com/u/1540635?v=4",name:"Charles de Dreuille"}}),t=l.story({args:{...n.input.args,src:"https://avatars.githubusercontent.com/u/15406AAAAAAAAA"}}),i=l.story({args:{...n.input.args},render:a=>e.jsxs(s,{direction:"column",gap:"6",children:[e.jsxs(s,{children:[e.jsx(r,{...a,size:"x-small"}),e.jsx(r,{...a,size:"small"}),e.jsx(r,{...a,size:"medium"}),e.jsx(r,{...a,size:"large"}),e.jsx(r,{...a,size:"x-large"})]}),e.jsxs(s,{children:[e.jsx(r,{...a,size:"x-small",src:""}),e.jsx(r,{...a,size:"small",src:""}),e.jsx(r,{...a,size:"medium",src:""}),e.jsx(r,{...a,size:"large",src:""}),e.jsx(r,{...a,size:"x-large",src:""})]})]})}),o=l.story({args:{...n.input.args},render:a=>e.jsxs(s,{direction:"column",gap:"4",children:[e.jsxs(s,{direction:"column",gap:"1",children:[e.jsx(c,{variant:"title-x-small",children:"Informative (default)"}),e.jsxs(c,{variant:"body-medium",children:['Use when avatar appears alone. Announced as "',a.name,'" to screen readers:']}),e.jsx(s,{gap:"2",align:"center",children:e.jsx(r,{...a,purpose:"informative"})})]}),e.jsxs(s,{direction:"column",gap:"1",children:[e.jsx(c,{variant:"title-x-small",children:"Decoration"}),e.jsx(c,{variant:"body-medium",children:"Use when name appears adjacent to avatar. Hidden from screen readers to avoid redundancy:"}),e.jsxs(s,{gap:"2",align:"center",children:[e.jsx(r,{...a,purpose:"decoration"}),e.jsx(c,{children:a.name})]})]})]})});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const Default = () => (
  <Avatar
    src="https://avatars.githubusercontent.com/u/1540635?v=4"
    name="Charles de Dreuille"
  />
);
`,...n.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const Fallback = () => (
  <Avatar src="https://avatars.githubusercontent.com/u/15406AAAAAAAAA" />
);
`,...t.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex direction="column" gap="6">
    <Flex>
      <Avatar size="x-small" />
      <Avatar size="small" />
      <Avatar size="medium" />
      <Avatar size="large" />
      <Avatar size="x-large" />
    </Flex>
    <Flex>
      <Avatar size="x-small" src="" />
      <Avatar size="small" src="" />
      <Avatar size="medium" src="" />
      <Avatar size="large" src="" />
      <Avatar size="x-large" src="" />
    </Flex>
  </Flex>
);
`,...i.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const Purpose = () => (
  <Flex direction="column" gap="4">
    <Flex direction="column" gap="1">
      <Text variant="title-x-small">Informative (default)</Text>
      <Text variant="body-medium">
        Use when avatar appears alone. Announced as "{args.name}" to screen
        readers:
      </Text>
      <Flex gap="2" align="center">
        <Avatar purpose="informative" />
      </Flex>
    </Flex>
    <Flex direction="column" gap="1">
      <Text variant="title-x-small">Decoration</Text>
      <Text variant="body-medium">
        Use when name appears adjacent to avatar. Hidden from screen readers to
        avoid redundancy:
      </Text>
      <Flex gap="2" align="center">
        <Avatar purpose="decoration" />
        <Text>{args.name}</Text>
      </Flex>
    </Flex>
  </Flex>
);
`,...o.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    src: 'https://avatars.githubusercontent.com/u/1540635?v=4',
    name: 'Charles de Dreuille'
  }
})`,...n.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    src: 'https://avatars.githubusercontent.com/u/15406AAAAAAAAA'
  }
})`,...t.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex direction="column" gap="6">
      <Flex>
        <Avatar {...args} size="x-small" />
        <Avatar {...args} size="small" />
        <Avatar {...args} size="medium" />
        <Avatar {...args} size="large" />
        <Avatar {...args} size="x-large" />
      </Flex>
      <Flex>
        <Avatar {...args} size="x-small" src="" />
        <Avatar {...args} size="small" src="" />
        <Avatar {...args} size="medium" src="" />
        <Avatar {...args} size="large" src="" />
        <Avatar {...args} size="x-large" src="" />
      </Flex>
    </Flex>
})`,...i.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex direction="column" gap="4">
      <Flex direction="column" gap="1">
        <Text variant="title-x-small">Informative (default)</Text>
        <Text variant="body-medium">
          Use when avatar appears alone. Announced as "{args.name}" to screen
          readers:
        </Text>
        <Flex gap="2" align="center">
          <Avatar {...args} purpose="informative" />
        </Flex>
      </Flex>
      <Flex direction="column" gap="1">
        <Text variant="title-x-small">Decoration</Text>
        <Text variant="body-medium">
          Use when name appears adjacent to avatar. Hidden from screen readers
          to avoid redundancy:
        </Text>
        <Flex gap="2" align="center">
          <Avatar {...args} purpose="decoration" />
          <Text>{args.name}</Text>
        </Flex>
      </Flex>
    </Flex>
})`,...o.input.parameters?.docs?.source}}};const h=["Default","Fallback","Sizes","Purpose"];export{n as Default,t as Fallback,o as Purpose,i as Sizes,h as __namedExportsOrder};
