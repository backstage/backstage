import{j as n}from"./jsx-runtime-hv06LKfz.js";import{B as e}from"./ButtonIcon-Czjbh3pg.js";import{F as o}from"./Flex-C_LlPGvM.js";import{T as p}from"./Text-C2hFegYR.js";import{I as r}from"./provider-C6Ma5UVL.js";import"./index-D8-PC79C.js";import"./clsx-B-dksMZM.js";import"./Button-U0_f04OL.js";import"./utils-SVxEJA3c.js";import"./Hidden-Bl3CD3Sw.js";import"./useFocusRing-CSBfGNH9.js";import"./usePress-BiO5y4q0.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useStyles-Dc-DqJ_c.js";import"./spacing.props-m9PQeFPu.js";const w={title:"Backstage UI/ButtonIcon",component:e,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}},c={render:()=>n.jsx(e,{icon:n.jsx(r,{name:"cloud"})})},t={render:()=>n.jsxs(o,{align:"center",gap:"2",children:[n.jsx(e,{icon:n.jsx(r,{name:"cloud"}),variant:"primary"}),n.jsx(e,{icon:n.jsx(r,{name:"cloud"}),variant:"secondary"}),n.jsx(e,{icon:n.jsx(r,{name:"cloud"}),variant:"tertiary"})]})},m={render:()=>n.jsxs(o,{align:"center",gap:"2",children:[n.jsx(e,{icon:n.jsx(r,{name:"cloud"}),size:"small"}),n.jsx(e,{icon:n.jsx(r,{name:"cloud"}),size:"medium"})]})},l={render:()=>n.jsxs(o,{direction:"row",gap:"2",children:[n.jsx(e,{isDisabled:!0,icon:n.jsx(r,{name:"cloud"}),variant:"primary"}),n.jsx(e,{isDisabled:!0,icon:n.jsx(r,{name:"cloud"}),variant:"secondary"}),n.jsx(e,{isDisabled:!0,icon:n.jsx(r,{name:"cloud"}),variant:"tertiary"})]})},d={args:{variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}},render:a=>n.jsx(e,{...a,icon:n.jsx(r,{name:"cloud"})})},x=["primary","secondary"],g=["small","medium"],u={render:a=>n.jsx(o,{direction:"column",children:x.map(s=>n.jsxs(o,{direction:"column",children:[n.jsx(p,{children:s}),g.map(i=>n.jsxs(o,{align:"center",children:[n.jsx(e,{...a,variant:s,size:i,icon:n.jsx(r,{name:"cloud"})}),n.jsx(e,{...a,icon:n.jsx(r,{name:"chevron-right"}),"aria-label":"Chevron right icon button",variant:s,size:i}),n.jsx(e,{...a,icon:n.jsx(r,{name:"chevron-right"}),"aria-label":"Chevron right icon button",variant:s,size:i})]},i))]},s))})};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <ButtonIcon icon={<Icon name="cloud" />} />
}`,...c.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Flex align="center" gap="2">
      <ButtonIcon icon={<Icon name="cloud" />} variant="primary" />
      <ButtonIcon icon={<Icon name="cloud" />} variant="secondary" />
      <ButtonIcon icon={<Icon name="cloud" />} variant="tertiary" />
    </Flex>
}`,...t.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Flex align="center" gap="2">
      <ButtonIcon icon={<Icon name="cloud" />} size="small" />
      <ButtonIcon icon={<Icon name="cloud" />} size="medium" />
    </Flex>
}`,...m.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Flex direction="row" gap="2">
      <ButtonIcon isDisabled icon={<Icon name="cloud" />} variant="primary" />
      <ButtonIcon isDisabled icon={<Icon name="cloud" />} variant="secondary" />
      <ButtonIcon isDisabled icon={<Icon name="cloud" />} variant="tertiary" />
    </Flex>
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
  render: args => <ButtonIcon {...args} icon={<Icon name="cloud" />} />
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <Flex direction="column">
      {variants.map(variant => <Flex direction="column" key={variant}>
          <Text>{variant}</Text>
          {sizes.map(size => <Flex align="center" key={size}>
              <ButtonIcon {...args} variant={variant} size={size} icon={<Icon name="cloud" />} />
              <ButtonIcon {...args} icon={<Icon name="chevron-right" />} aria-label="Chevron right icon button" variant={variant} size={size} />
              <ButtonIcon {...args} icon={<Icon name="chevron-right" />} aria-label="Chevron right icon button" variant={variant} size={size} />
            </Flex>)}
        </Flex>)}
    </Flex>
}`,...u.parameters?.docs?.source}}};const E=["Default","Variants","Sizes","Disabled","Responsive","Playground"];export{c as Default,l as Disabled,u as Playground,d as Responsive,m as Sizes,t as Variants,E as __namedExportsOrder,w as default};
