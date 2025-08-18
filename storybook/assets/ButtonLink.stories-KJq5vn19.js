import{j as n}from"./jsx-runtime-hv06LKfz.js";import{B as t}from"./ButtonLink-C3ySfNux.js";import{F as i}from"./Flex-C_LlPGvM.js";import{T as p}from"./Text-C2hFegYR.js";import{I as r}from"./provider-C6Ma5UVL.js";import"./index-D8-PC79C.js";import"./clsx-B-dksMZM.js";import"./Link-DKzhZnWJ.js";import"./utils-SVxEJA3c.js";import"./useFocusRing-CSBfGNH9.js";import"./usePress-BiO5y4q0.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useStyles-Dc-DqJ_c.js";import"./spacing.props-m9PQeFPu.js";const T={title:"Backstage UI/ButtonLink",component:t,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}},o={args:{children:"Button"}},s={render:()=>n.jsxs(i,{align:"center",children:[n.jsx(t,{iconStart:n.jsx(r,{name:"cloud"}),variant:"primary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{name:"cloud"}),variant:"secondary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{name:"cloud"}),variant:"tertiary",href:"https://ui.backstage.io",target:"_blank",children:"Button"})]})},c={args:{children:"Button"},render:()=>n.jsxs(i,{align:"center",children:[n.jsx(t,{size:"small",iconStart:n.jsx(r,{name:"cloud"}),children:"Small"}),n.jsx(t,{size:"medium",iconStart:n.jsx(r,{name:"cloud"}),children:"Medium"})]})},d={args:{children:"Button"},render:e=>n.jsxs(i,{align:"center",children:[n.jsx(t,{...e,iconStart:n.jsx(r,{name:"cloud"})}),n.jsx(t,{...e,iconEnd:n.jsx(r,{name:"chevron-right"})}),n.jsx(t,{...e,iconStart:n.jsx(r,{name:"cloud"}),iconEnd:n.jsx(r,{name:"chevron-right"})})]})},l={args:{children:"Button"},render:e=>n.jsxs(i,{direction:"column",gap:"4",style:{width:"300px"},children:[n.jsx(t,{...e,iconStart:n.jsx(r,{name:"cloud"})}),n.jsx(t,{...e,iconEnd:n.jsx(r,{name:"chevron-right"})}),n.jsx(t,{...e,iconStart:n.jsx(r,{name:"cloud"}),iconEnd:n.jsx(r,{name:"chevron-right"})})]})},u={render:()=>n.jsxs(i,{direction:"row",gap:"4",children:[n.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),n.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),n.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})},m={args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}},x=["primary","secondary"],B=["small","medium"],h={args:{children:"Button"},render:()=>n.jsx(i,{direction:"column",children:x.map(e=>n.jsxs(i,{direction:"column",children:[n.jsx(p,{children:e}),B.map(a=>n.jsxs(i,{align:"center",children:[n.jsx(t,{variant:e,size:a,children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{name:"cloud"}),variant:e,size:a,children:"Button"}),n.jsx(t,{iconEnd:n.jsx(r,{name:"chevron-right"}),variant:e,size:a,children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{name:"cloud"}),iconEnd:n.jsx(r,{name:"chevron-right"}),style:{width:"200px"},variant:e,size:a,children:"Button"}),n.jsx(t,{variant:e,size:a,isDisabled:!0,children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{name:"cloud"}),variant:e,size:a,isDisabled:!0,children:"Button"}),n.jsx(t,{iconEnd:n.jsx(r,{name:"chevron-right"}),variant:e,size:a,isDisabled:!0,children:"Button"})]},a))]},e))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Flex align="center">
      <ButtonLink iconStart={<Icon name="cloud" />} variant="primary" href="https://ui.backstage.io" target="_blank">
        Button
      </ButtonLink>
      <ButtonLink iconStart={<Icon name="cloud" />} variant="secondary" href="https://ui.backstage.io" target="_blank">
        Button
      </ButtonLink>
      <ButtonLink iconStart={<Icon name="cloud" />} variant="tertiary" href="https://ui.backstage.io" target="_blank">
        Button
      </ButtonLink>
    </Flex>
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: () => <Flex align="center">
      <ButtonLink size="small" iconStart={<Icon name="cloud" />}>
        Small
      </ButtonLink>
      <ButtonLink size="medium" iconStart={<Icon name="cloud" />}>
        Medium
      </ButtonLink>
    </Flex>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <ButtonLink {...args} iconStart={<Icon name="cloud" />} />
      <ButtonLink {...args} iconEnd={<Icon name="chevron-right" />} />
      <ButtonLink {...args} iconStart={<Icon name="cloud" />} iconEnd={<Icon name="chevron-right" />} />
    </Flex>
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: args => <Flex direction="column" gap="4" style={{
    width: '300px'
  }}>
      <ButtonLink {...args} iconStart={<Icon name="cloud" />} />
      <ButtonLink {...args} iconEnd={<Icon name="chevron-right" />} />
      <ButtonLink {...args} iconStart={<Icon name="cloud" />} iconEnd={<Icon name="chevron-right" />} />
    </Flex>
}`,...l.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Flex direction="row" gap="4">
      <ButtonLink variant="primary" isDisabled>
        Primary
      </ButtonLink>
      <ButtonLink variant="secondary" isDisabled>
        Secondary
      </ButtonLink>
      <ButtonLink variant="tertiary" isDisabled>
        Tertiary
      </ButtonLink>
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
}`,...m.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: () => <Flex direction="column">
      {variants.map(variant => <Flex direction="column" key={variant}>
          <Text>{variant}</Text>
          {sizes.map(size => <Flex align="center" key={size}>
              <ButtonLink variant={variant} size={size}>
                Button
              </ButtonLink>
              <ButtonLink iconStart={<Icon name="cloud" />} variant={variant} size={size}>
                Button
              </ButtonLink>
              <ButtonLink iconEnd={<Icon name="chevron-right" />} variant={variant} size={size}>
                Button
              </ButtonLink>
              <ButtonLink iconStart={<Icon name="cloud" />} iconEnd={<Icon name="chevron-right" />} style={{
          width: '200px'
        }} variant={variant} size={size}>
                Button
              </ButtonLink>
              <ButtonLink variant={variant} size={size} isDisabled>
                Button
              </ButtonLink>
              <ButtonLink iconStart={<Icon name="cloud" />} variant={variant} size={size} isDisabled>
                Button
              </ButtonLink>
              <ButtonLink iconEnd={<Icon name="chevron-right" />} variant={variant} size={size} isDisabled>
                Button
              </ButtonLink>
            </Flex>)}
        </Flex>)}
    </Flex>
}`,...h.parameters?.docs?.source}}};const w=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive","Playground"];export{o as Default,u as Disabled,l as FullWidth,h as Playground,m as Responsive,c as Sizes,s as Variants,d as WithIcons,w as __namedExportsOrder,T as default};
