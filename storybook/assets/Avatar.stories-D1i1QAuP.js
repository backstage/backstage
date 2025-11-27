import{j as e}from"./iframe-B6vHPHUS.js";import{A as r}from"./Avatar-D87cSv3F.js";import{F as s}from"./Flex-CUF93du8.js";import{T as t}from"./Text-B-LjbfPX.js";import"./preload-helper-D9Z9MdNV.js";import"./clsx-B-dksMZM.js";import"./useStyles-C-y3xpyB.js";const v={title:"Backstage UI/Avatar",component:r},n={args:{src:"https://avatars.githubusercontent.com/u/1540635?v=4",name:"Charles de Dreuille"}},i={args:{...n.args,src:"https://avatars.githubusercontent.com/u/15406AAAAAAAAA"}},o={args:{...n.args},render:a=>e.jsxs(s,{direction:"column",gap:"6",children:[e.jsxs(s,{children:[e.jsx(r,{...a,size:"x-small"}),e.jsx(r,{...a,size:"small"}),e.jsx(r,{...a,size:"medium"}),e.jsx(r,{...a,size:"large"}),e.jsx(r,{...a,size:"x-large"})]}),e.jsxs(s,{children:[e.jsx(r,{...a,size:"x-small",src:""}),e.jsx(r,{...a,size:"small",src:""}),e.jsx(r,{...a,size:"medium",src:""}),e.jsx(r,{...a,size:"large",src:""}),e.jsx(r,{...a,size:"x-large",src:""})]})]})},c={args:{...n.args},render:a=>e.jsxs(s,{direction:"column",gap:"4",children:[e.jsxs(s,{direction:"column",gap:"1",children:[e.jsx(t,{variant:"title-x-small",children:"Informative (default)"}),e.jsxs(t,{variant:"body-medium",children:['Use when avatar appears alone. Announced as "',a.name,'" to screen readers:']}),e.jsx(s,{gap:"2",align:"center",children:e.jsx(r,{...a,purpose:"informative"})})]}),e.jsxs(s,{direction:"column",gap:"1",children:[e.jsx(t,{variant:"title-x-small",children:"Decoration"}),e.jsx(t,{variant:"body-medium",children:"Use when name appears adjacent to avatar. Hidden from screen readers to avoid redundancy:"}),e.jsxs(s,{gap:"2",align:"center",children:[e.jsx(r,{...a,purpose:"decoration"}),e.jsx(t,{children:a.name})]})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://avatars.githubusercontent.com/u/1540635?v=4',
    name: 'Charles de Dreuille'
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    src: 'https://avatars.githubusercontent.com/u/15406AAAAAAAAA'
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
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
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
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
}`,...c.parameters?.docs?.source}}};const A=["Default","Fallback","Sizes","Purpose"];export{n as Default,i as Fallback,c as Purpose,o as Sizes,A as __namedExportsOrder,v as default};
