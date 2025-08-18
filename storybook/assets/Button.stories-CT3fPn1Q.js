import{j as n}from"./jsx-runtime-hv06LKfz.js";import{B as t}from"./Button-DuK7rGK8.js";import{F as a}from"./Flex-C_LlPGvM.js";import{T as x}from"./Text-C2hFegYR.js";import{I as r}from"./provider-C6Ma5UVL.js";import"./index-D8-PC79C.js";import"./clsx-B-dksMZM.js";import"./Button-U0_f04OL.js";import"./utils-SVxEJA3c.js";import"./Hidden-Bl3CD3Sw.js";import"./useFocusRing-CSBfGNH9.js";import"./usePress-BiO5y4q0.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useStyles-Dc-DqJ_c.js";import"./spacing.props-m9PQeFPu.js";const k={title:"Backstage UI/Button",component:t,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}},i={args:{children:"Button"}},s={args:{children:"Button"},parameters:{argTypes:{variant:{control:!1}}},render:()=>n.jsxs(a,{align:"center",children:[n.jsx(t,{iconStart:n.jsx(r,{name:"cloud"}),variant:"primary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{name:"cloud"}),variant:"secondary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{name:"cloud"}),variant:"tertiary",children:"Button"})]})},c={args:{children:"Button"},render:()=>n.jsxs(a,{align:"center",children:[n.jsx(t,{size:"small",iconStart:n.jsx(r,{name:"cloud"}),children:"Small"}),n.jsx(t,{size:"medium",iconStart:n.jsx(r,{name:"cloud"}),children:"Medium"})]})},d={args:{children:"Button"},render:e=>n.jsxs(a,{align:"center",children:[n.jsx(t,{...e,iconStart:n.jsx(r,{name:"cloud"})}),n.jsx(t,{...e,iconEnd:n.jsx(r,{name:"chevron-right"})}),n.jsx(t,{...e,iconStart:n.jsx(r,{name:"cloud"}),iconEnd:n.jsx(r,{name:"chevron-right"})})]})},l={args:{children:"Button"},render:e=>n.jsxs(a,{direction:"column",gap:"4",style:{width:"300px"},children:[n.jsx(t,{...e,iconStart:n.jsx(r,{name:"cloud"})}),n.jsx(t,{...e,iconEnd:n.jsx(r,{name:"chevron-right"})}),n.jsx(t,{...e,iconStart:n.jsx(r,{name:"cloud"}),iconEnd:n.jsx(r,{name:"chevron-right"})})]})},u={render:()=>n.jsxs(a,{direction:"row",gap:"4",children:[n.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),n.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),n.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})},m={args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}},h=["primary","secondary"],B=["small","medium"],p={args:{children:"Button"},render:()=>n.jsx(a,{direction:"column",children:h.map(e=>n.jsxs(a,{direction:"column",children:[n.jsx(x,{children:e}),B.map(o=>n.jsxs(a,{align:"center",children:[n.jsx(t,{variant:e,size:o,children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{name:"cloud"}),variant:e,size:o,children:"Button"}),n.jsx(t,{iconEnd:n.jsx(r,{name:"chevron-right"}),variant:e,size:o,children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{name:"cloud"}),iconEnd:n.jsx(r,{name:"chevron-right"}),style:{width:"200px"},variant:e,size:o,children:"Button"}),n.jsx(t,{variant:e,size:o,isDisabled:!0,children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{name:"cloud"}),variant:e,size:o,isDisabled:!0,children:"Button"}),n.jsx(t,{iconEnd:n.jsx(r,{name:"chevron-right"}),variant:e,size:o,isDisabled:!0,children:"Button"})]},o))]},e))})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  }
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
  render: () => <Flex align="center">
      <Button iconStart={<Icon name="cloud" />} variant="primary">
        Button
      </Button>
      <Button iconStart={<Icon name="cloud" />} variant="secondary">
        Button
      </Button>
      <Button iconStart={<Icon name="cloud" />} variant="tertiary">
        Button
      </Button>
    </Flex>
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: () => <Flex align="center">
      <Button size="small" iconStart={<Icon name="cloud" />}>
        Small
      </Button>
      <Button size="medium" iconStart={<Icon name="cloud" />}>
        Medium
      </Button>
    </Flex>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <Button {...args} iconStart={<Icon name="cloud" />} />
      <Button {...args} iconEnd={<Icon name="chevron-right" />} />
      <Button {...args} iconStart={<Icon name="cloud" />} iconEnd={<Icon name="chevron-right" />} />
    </Flex>
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: args => <Flex direction="column" gap="4" style={{
    width: '300px'
  }}>
      <Button {...args} iconStart={<Icon name="cloud" />} />
      <Button {...args} iconEnd={<Icon name="chevron-right" />} />
      <Button {...args} iconStart={<Icon name="cloud" />} iconEnd={<Icon name="chevron-right" />} />
    </Flex>
}`,...l.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: () => <Flex direction="column">
      {variants.map(variant => <Flex direction="column" key={variant}>
          <Text>{variant}</Text>
          {sizes.map(size => <Flex align="center" key={size}>
              <Button variant={variant} size={size}>
                Button
              </Button>
              <Button iconStart={<Icon name="cloud" />} variant={variant} size={size}>
                Button
              </Button>
              <Button iconEnd={<Icon name="chevron-right" />} variant={variant} size={size}>
                Button
              </Button>
              <Button iconStart={<Icon name="cloud" />} iconEnd={<Icon name="chevron-right" />} style={{
          width: '200px'
        }} variant={variant} size={size}>
                Button
              </Button>
              <Button variant={variant} size={size} isDisabled>
                Button
              </Button>
              <Button iconStart={<Icon name="cloud" />} variant={variant} size={size} isDisabled>
                Button
              </Button>
              <Button iconEnd={<Icon name="chevron-right" />} variant={variant} size={size} isDisabled>
                Button
              </Button>
            </Flex>)}
        </Flex>)}
    </Flex>
}`,...p.parameters?.docs?.source}}};const R=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive","Playground"];export{i as Default,u as Disabled,l as FullWidth,p as Playground,m as Responsive,c as Sizes,s as Variants,d as WithIcons,R as __namedExportsOrder,k as default};
