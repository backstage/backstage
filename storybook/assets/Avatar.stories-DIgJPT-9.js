import{a3 as m,j as e}from"./iframe-nUyzSU_S.js";import{A as r}from"./Avatar-C2vWLINH.js";import{F as s}from"./Flex-CfeLptgI.js";import{T as t}from"./Text-C33e8qJr.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./useStyles-CGc-3N3i.js";const l=m.meta({title:"Backstage UI/Avatar",component:r}),n=l.story({args:{src:"https://avatars.githubusercontent.com/u/1540635?v=4",name:"Charles de Dreuille"}}),i=l.story({args:{...n.input.args,src:"https://avatars.githubusercontent.com/u/15406AAAAAAAAA"}}),o=l.story({args:{...n.input.args},render:a=>e.jsxs(s,{direction:"column",gap:"6",children:[e.jsxs(s,{children:[e.jsx(r,{...a,size:"x-small"}),e.jsx(r,{...a,size:"small"}),e.jsx(r,{...a,size:"medium"}),e.jsx(r,{...a,size:"large"}),e.jsx(r,{...a,size:"x-large"})]}),e.jsxs(s,{children:[e.jsx(r,{...a,size:"x-small",src:""}),e.jsx(r,{...a,size:"small",src:""}),e.jsx(r,{...a,size:"medium",src:""}),e.jsx(r,{...a,size:"large",src:""}),e.jsx(r,{...a,size:"x-large",src:""})]})]})}),c=l.story({args:{...n.input.args},render:a=>e.jsxs(s,{direction:"column",gap:"4",children:[e.jsxs(s,{direction:"column",gap:"1",children:[e.jsx(t,{variant:"title-x-small",children:"Informative (default)"}),e.jsxs(t,{variant:"body-medium",children:['Use when avatar appears alone. Announced as "',a.name,'" to screen readers:']}),e.jsx(s,{gap:"2",align:"center",children:e.jsx(r,{...a,purpose:"informative"})})]}),e.jsxs(s,{direction:"column",gap:"1",children:[e.jsx(t,{variant:"title-x-small",children:"Decoration"}),e.jsx(t,{variant:"body-medium",children:"Use when name appears adjacent to avatar. Hidden from screen readers to avoid redundancy:"}),e.jsxs(s,{gap:"2",align:"center",children:[e.jsx(r,{...a,purpose:"decoration"}),e.jsx(t,{children:a.name})]})]})]})});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    src: 'https://avatars.githubusercontent.com/u/1540635?v=4',
    name: 'Charles de Dreuille'
  }
})`,...n.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    src: 'https://avatars.githubusercontent.com/u/15406AAAAAAAAA'
  }
})`,...i.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};const j=["Default","Fallback","Sizes","Purpose"];export{n as Default,i as Fallback,c as Purpose,o as Sizes,j as __namedExportsOrder};
